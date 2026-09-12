package br.com.fiap.solin.auth;

import br.com.fiap.solin.auth.dto.AuthResponse;
import br.com.fiap.solin.auth.dto.CadastroRequest;
import br.com.fiap.solin.auth.dto.LoginRequest;
import br.com.fiap.solin.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarios;
    private final PasswordEncoder senhas;
    private final JwtService jwt;

    public AuthService(UsuarioRepository usuarios, PasswordEncoder senhas, JwtService jwt) {
        this.usuarios = usuarios;
        this.senhas = senhas;
        this.jwt = jwt;
    }

    public AuthResponse cadastrar(CadastroRequest pedido) {
        String email = pedido.email().trim().toLowerCase();
        if (usuarios.existsByEmailIgnoreCase(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "Ja existe uma conta com este e-mail.");
        }
        Usuario usuario = new Usuario();
        usuario.setNome(pedido.nome().trim());
        usuario.setEmail(email);
        usuario.setSenhaHash(senhas.encode(pedido.senha()));
        usuarios.save(usuario);
        return responder(usuario);
    }

    public AuthResponse login(LoginRequest pedido) {
        Usuario usuario = usuarios.findByEmailIgnoreCase(pedido.email().trim())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "E-mail ou senha incorretos."));
        if (!senhas.matches(pedido.senha(), usuario.getSenhaHash())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "E-mail ou senha incorretos.");
        }
        return responder(usuario);
    }

    public AuthResponse eu(UsuarioLogado logado) {
        Usuario usuario = usuarios.findById(logado.id())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Sessao expirada. Entre de novo."));
        return responder(usuario);
    }

    private AuthResponse responder(Usuario usuario) {
        return new AuthResponse(jwt.gerar(usuario), String.valueOf(usuario.getId()), usuario.getNome(), usuario.getEmail());
    }
}
