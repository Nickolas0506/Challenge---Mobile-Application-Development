package br.com.fiap.solin.recurso.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PetRequest(
        String nome,
        String especie,
        String raca,
        String peso,
        String idade,
        String caracteristicas,
        String foto,
        String createdAt
) {
}
