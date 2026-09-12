package br.com.fiap.solin.recurso.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record CheckinRequest(
        String petId,
        String data,
        String humor,
        String observacao
) {
}
