package br.com.fiap.solin.distribuicao;

import br.com.fiap.solin.distribuicao.dto.ConviteResponse;
import br.com.fiap.solin.distribuicao.dto.VersaoResponse;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Rotas do testador (fora de /api, entao nao exigem login no app). */
@RestController
@RequestMapping("/distribuicao")
public class DistribuicaoController {

    private static final MediaType APK = MediaType.parseMediaType("application/vnd.android.package-archive");

    private final DistribuicaoService service;

    public DistribuicaoController(DistribuicaoService service) {
        this.service = service;
    }

    /** Versao mais recente publicada (o app compara com o proprio commit na tela "Sobre o App"). */
    @GetMapping("/ultima")
    public VersaoResponse ultima() {
        return service.ultimaVersao();
    }

    @GetMapping("/convites/{codigo}")
    public ConviteResponse convite(@PathVariable String codigo) {
        return service.abrirConvite(codigo);
    }

    @GetMapping("/convites/{codigo}/versoes/{versaoId}/apk")
    public ResponseEntity<byte[]> baixar(@PathVariable String codigo, @PathVariable Long versaoId) {
        DistribuicaoService.ApkParaDownload apk = service.baixar(codigo, versaoId);
        return ResponseEntity.ok()
                .contentType(APK)
                .contentLength(apk.conteudo().length)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename(apk.nomeArquivo()).build().toString())
                .body(apk.conteudo());
    }
}
