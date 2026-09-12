package br.com.fiap.solin.recurso.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PasseioRequest(
        String petId,
        String data,
        String duracaoMin,
        Boolean bebeuAgua,
        Boolean urinou,
        Boolean urinaNormal,
        Boolean fezesNormais,
        Boolean comportamentoNormal,
        String observacao
) {
}
