package br.com.fiap.solin.auth;

public record UsuarioLogado(Long id, String nome, String email) {
    public String uid() {
        return String.valueOf(id);
    }
}
