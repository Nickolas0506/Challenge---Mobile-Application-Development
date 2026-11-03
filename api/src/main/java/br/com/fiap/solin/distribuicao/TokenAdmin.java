package br.com.fiap.solin.distribuicao;

import br.com.fiap.solin.exception.ApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

/** Protege as rotas de publicacao: so quem tem o SOLIN_ADMIN_TOKEN publica APK e convida testadores. */
@Component
public class TokenAdmin {

    private final String token;

    public TokenAdmin(@Value("${solin.distribuicao.admin-token:}") String token) {
        this.token = token == null ? "" : token.trim();
    }

    public void validar(String recebido) {
        if (token.isEmpty()) {
            throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Distribuicao desligada: defina a variavel SOLIN_ADMIN_TOKEN na API.");
        }
        byte[] esperado = token.getBytes(StandardCharsets.UTF_8);
        byte[] enviado = (recebido == null ? "" : recebido.trim()).getBytes(StandardCharsets.UTF_8);
        if (!MessageDigest.isEqual(esperado, enviado)) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Token de administrador invalido.");
        }
    }
}
