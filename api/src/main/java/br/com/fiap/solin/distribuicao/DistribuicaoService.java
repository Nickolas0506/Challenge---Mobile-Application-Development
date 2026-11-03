package br.com.fiap.solin.distribuicao;

import br.com.fiap.solin.distribuicao.dto.ConviteResponse;
import br.com.fiap.solin.distribuicao.dto.DownloadResponse;
import br.com.fiap.solin.distribuicao.dto.TestadorRequest;
import br.com.fiap.solin.distribuicao.dto.TestadorResponse;
import br.com.fiap.solin.distribuicao.dto.VersaoResponse;
import br.com.fiap.solin.exception.ApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Distribuicao do APK para testadores (substitui o Firebase App Distribution).
 * O admin publica o APK e cadastra os testadores; cada testador recebe um link de convite
 * e so ele consegue baixar. Todo download fica registrado.
 */
@Service
public class DistribuicaoService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final TestadorRepository testadores;
    private final VersaoAppRepository versoes;
    private final ArquivoApkRepository arquivos;
    private final DownloadRepository downloads;
    private final String urlPublica;

    public DistribuicaoService(
            TestadorRepository testadores,
            VersaoAppRepository versoes,
            ArquivoApkRepository arquivos,
            DownloadRepository downloads,
            @Value("${solin.distribuicao.url-publica:}") String urlPublica
    ) {
        this.testadores = testadores;
        this.versoes = versoes;
        this.arquivos = arquivos;
        this.downloads = downloads;
        this.urlPublica = urlPublica.replaceAll("/$", "");
    }

    // ---------- testadores ----------

    public List<TestadorResponse> listarTestadores() {
        List<Download> todos = downloads.findAllByOrderByDataDesc();
        Map<Long, List<Download>> porTestador = todos.stream().collect(Collectors.groupingBy(Download::getTestadorId));
        return testadores.findAllByOrderByConvidadoEmDesc().stream()
                .map(t -> paraResposta(t, porTestador.getOrDefault(t.getId(), List.of())))
                .toList();
    }

    @Transactional
    public TestadorResponse convidar(TestadorRequest pedido) {
        String email = pedido.email().trim().toLowerCase();
        Testador testador = testadores.findByEmailIgnoreCase(email).orElseGet(() -> {
            Testador novo = new Testador();
            novo.setEmail(email);
            novo.setCodigo(gerarCodigo());
            novo.setConvidadoEm(Instant.now());
            return novo;
        });
        if (pedido.nome() != null && !pedido.nome().isBlank()) {
            testador.setNome(pedido.nome().trim());
        }
        return paraResposta(testadores.save(testador), List.of());
    }

    @Transactional
    public void removerTestador(Long id) {
        Testador testador = testadores.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Testador nao encontrado."));
        downloads.deleteByTestadorId(id);
        testadores.delete(testador);
    }

    // ---------- versoes ----------

    public List<VersaoResponse> listarVersoes() {
        return versoes.findAllByOrderByPublicadaEmDesc().stream().map(VersaoResponse::de).toList();
    }

    public VersaoResponse ultimaVersao() {
        return versoes.findFirstByOrderByPublicadaEmDesc()
                .map(VersaoResponse::de)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Nenhuma versao publicada ainda."));
    }

    @Transactional
    public VersaoResponse publicar(String versao, String commit, String notas, byte[] apk) {
        if (versao == null || versao.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Informe a versao (ex.: 1.0.0).");
        }
        if (commit == null || !commit.trim().matches("[0-9a-fA-F]{7,40}")) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Informe o hash do commit (7 a 40 caracteres hexadecimais).");
        }
        // todo APK e um arquivo zip: comeca com "PK"
        if (apk == null || apk.length < 4 || apk[0] != 'P' || apk[1] != 'K') {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Envie um arquivo .apk valido.");
        }

        VersaoApp nova = new VersaoApp();
        nova.setVersao(versao.trim());
        nova.setCommit(commit.trim().toLowerCase());
        nova.setNotas(notas == null || notas.isBlank() ? null : notas.trim());
        nova.setTamanho(apk.length);
        nova.setPublicadaEm(Instant.now());
        nova = versoes.save(nova);
        arquivos.save(new ArquivoApk(nova.getId(), apk));
        return VersaoResponse.de(nova);
    }

    @Transactional
    public void removerVersao(Long id) {
        VersaoApp versao = versoes.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Versao nao encontrada."));
        downloads.deleteByVersaoId(id);
        arquivos.deleteById(id);
        versoes.delete(versao);
    }

    public List<DownloadResponse> listarDownloads() {
        Map<Long, Testador> porId = testadores.findAll().stream()
                .collect(Collectors.toMap(Testador::getId, Function.identity()));
        Map<Long, VersaoApp> versaoPorId = versoes.findAll().stream()
                .collect(Collectors.toMap(VersaoApp::getId, Function.identity()));
        return downloads.findAllByOrderByDataDesc().stream()
                .map(d -> {
                    Testador t = porId.get(d.getTestadorId());
                    VersaoApp v = versaoPorId.get(d.getVersaoId());
                    return new DownloadResponse(
                            t != null ? t.getEmail() : "-",
                            v != null ? v.getVersao() : "-",
                            v != null ? v.getCommit() : "-",
                            d.getData()
                    );
                })
                .toList();
    }

    // ---------- lado do testador ----------

    public ConviteResponse abrirConvite(String codigo) {
        Testador testador = testadorPorCodigo(codigo);
        return new ConviteResponse(testador.getEmail(), testador.getNome(), listarVersoes());
    }

    /** Devolve o APK e registra o download. */
    @Transactional
    public ApkParaDownload baixar(String codigo, Long versaoId) {
        Testador testador = testadorPorCodigo(codigo);
        VersaoApp versao = versoes.findById(versaoId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Versao nao encontrada."));
        ArquivoApk arquivo = arquivos.findById(versaoId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Arquivo da versao nao encontrado."));
        downloads.save(new Download(testador.getId(), versao.getId(), Instant.now()));
        return new ApkParaDownload(versao.nomeArquivo(), arquivo.getConteudo());
    }

    public record ApkParaDownload(String nomeArquivo, byte[] conteudo) {
    }

    // ---------- apoio ----------

    private Testador testadorPorCodigo(String codigo) {
        return testadores.findByCodigo(codigo == null ? "" : codigo.trim())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND,
                        "Convite invalido. Peca um novo link para quem publicou o app."));
    }

    private TestadorResponse paraResposta(Testador t, List<Download> seus) {
        return new TestadorResponse(
                t.getId(),
                t.getEmail(),
                t.getNome(),
                linkConvite(t),
                t.getConvidadoEm(),
                seus.size(),
                seus.isEmpty() ? null : seus.get(0).getData()
        );
    }

    private String linkConvite(Testador t) {
        String base = urlPublica.isBlank()
                ? ServletUriComponentsBuilder.fromCurrentContextPath().toUriString()
                : urlPublica;
        return base + "/distribuicao/?c=" + t.getCodigo();
    }

    private static String gerarCodigo() {
        byte[] bytes = new byte[18];
        RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
