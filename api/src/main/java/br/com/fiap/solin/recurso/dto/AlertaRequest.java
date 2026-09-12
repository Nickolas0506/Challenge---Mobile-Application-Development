package br.com.fiap.solin.recurso.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record AlertaRequest(
        String titulo,
        String mensagem,
        String tipo,
        Boolean lido,
        String data
) {
}
