package br.com.fiap.solin.distribuicao.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record TestadorRequest(
        @NotBlank(message = "Informe o e-mail do testador.")
        @Email(message = "E-mail invalido.")
        String email,
        String nome
) {
}
