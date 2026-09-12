package br.com.fiap.solin.auth;

import br.com.fiap.solin.auth.dto.AuthResponse;
import br.com.fiap.solin.auth.dto.CadastroRequest;
import br.com.fiap.solin.auth.dto.LoginRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/cadastrar")
    public AuthResponse cadastrar(@Valid @RequestBody CadastroRequest pedido) {
        return service.cadastrar(pedido);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest pedido) {
        return service.login(pedido);
    }

    @GetMapping("/me")
    public AuthResponse me(@RequestAttribute("usuario") UsuarioLogado usuario) {
        return service.eu(usuario);
    }
}
