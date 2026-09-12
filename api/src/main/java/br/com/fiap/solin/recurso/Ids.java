package br.com.fiap.solin.recurso;

import br.com.fiap.solin.exception.ApiException;
import org.springframework.http.HttpStatus;

public final class Ids {
    private Ids() {
    }

    public static Long parse(String id) {
        try {
            return Long.valueOf(id);
        } catch (Exception e) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Registro nao encontrado.");
        }
    }
}
