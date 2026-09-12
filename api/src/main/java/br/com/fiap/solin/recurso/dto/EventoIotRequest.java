package br.com.fiap.solin.recurso.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record EventoIotRequest(
        String data,
        String tipo,
        String mensagem
) {
}
