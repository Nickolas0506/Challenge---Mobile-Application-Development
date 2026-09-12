package br.com.fiap.solin.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CadastroRequest(
        @NotBlank(message = "Informe o nome.") String nome,
        @NotBlank(message = "Informe o e-mail.") @Email(message = "E-mail invalido.") String email,
        @NotBlank(message = "Informe a senha.") @Size(min = 6, message = "A senha precisa ter pelo menos 6 caracteres.") String senha
) {
}
