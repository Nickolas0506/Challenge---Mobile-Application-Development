package br.com.fiap.solin.recurso;

import br.com.fiap.solin.auth.UsuarioLogado;
import br.com.fiap.solin.recurso.dto.CheckinRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/checkins")
public class CheckinController {

    private final CheckinService service;

    public CheckinController(CheckinService service) {
        this.service = service;
    }

    @GetMapping
    public List<Checkin> listar(@RequestAttribute("usuario") UsuarioLogado usuario) {
        return service.listar(usuario);
    }

    @GetMapping("/{id}")
    public Checkin buscar(@RequestAttribute("usuario") UsuarioLogado usuario, @PathVariable String id) {
        return service.buscar(usuario, id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Checkin criar(@RequestAttribute("usuario") UsuarioLogado usuario, @RequestBody CheckinRequest pedido) {
        return service.criar(usuario, pedido);
    }

    @PutMapping("/{id}")
    public Checkin atualizar(
            @RequestAttribute("usuario") UsuarioLogado usuario,
            @PathVariable String id,
            @RequestBody CheckinRequest pedido
    ) {
        return service.atualizar(usuario, id, pedido);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@RequestAttribute("usuario") UsuarioLogado usuario, @PathVariable String id) {
        service.remover(usuario, id);
    }
}
