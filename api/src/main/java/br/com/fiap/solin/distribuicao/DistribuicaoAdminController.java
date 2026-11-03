package br.com.fiap.solin.distribuicao;

import br.com.fiap.solin.distribuicao.dto.DownloadResponse;
import br.com.fiap.solin.distribuicao.dto.TestadorRequest;
import br.com.fiap.solin.distribuicao.dto.TestadorResponse;
import br.com.fiap.solin.distribuicao.dto.VersaoResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/** Rotas de quem publica o app (painel em /distribuicao/painel.html ou scripts/distribuir.sh). */
@RestController
@RequestMapping("/distribuicao/admin")
public class DistribuicaoAdminController {

    private static final String CABECALHO = "X-Admin-Token";

    private final DistribuicaoService service;
    private final TokenAdmin tokenAdmin;

    public DistribuicaoAdminController(DistribuicaoService service, TokenAdmin tokenAdmin) {
        this.service = service;
        this.tokenAdmin = tokenAdmin;
    }

    @GetMapping("/testadores")
    public List<TestadorResponse> testadores(@RequestHeader(value = CABECALHO, required = false) String token) {
        tokenAdmin.validar(token);
        return service.listarTestadores();
    }

    @PostMapping("/testadores")
    @ResponseStatus(HttpStatus.CREATED)
    public TestadorResponse convidar(
            @RequestHeader(value = CABECALHO, required = false) String token,
            @Valid @RequestBody TestadorRequest pedido
    ) {
        tokenAdmin.validar(token);
        return service.convidar(pedido);
    }

    @DeleteMapping("/testadores/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removerTestador(
            @RequestHeader(value = CABECALHO, required = false) String token,
            @PathVariable Long id
    ) {
        tokenAdmin.validar(token);
        service.removerTestador(id);
    }

    @GetMapping("/versoes")
    public List<VersaoResponse> versoes(@RequestHeader(value = CABECALHO, required = false) String token) {
        tokenAdmin.validar(token);
        return service.listarVersoes();
    }

    @PostMapping(value = "/versoes", consumes = "multipart/form-data")
    @ResponseStatus(HttpStatus.CREATED)
    public VersaoResponse publicar(
            @RequestHeader(value = CABECALHO, required = false) String token,
            @RequestParam("apk") MultipartFile apk,
            @RequestParam("versao") String versao,
            @RequestParam("commit") String commit,
            @RequestParam(value = "notas", required = false) String notas
    ) throws IOException {
        tokenAdmin.validar(token);
        return service.publicar(versao, commit, notas, apk.getBytes());
    }

    @DeleteMapping("/versoes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removerVersao(
            @RequestHeader(value = CABECALHO, required = false) String token,
            @PathVariable Long id
    ) {
        tokenAdmin.validar(token);
        service.removerVersao(id);
    }

    @GetMapping("/downloads")
    public List<DownloadResponse> downloads(@RequestHeader(value = CABECALHO, required = false) String token) {
        tokenAdmin.validar(token);
        return service.listarDownloads();
    }
}
