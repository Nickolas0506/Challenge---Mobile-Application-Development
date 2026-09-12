package br.com.fiap.solin.auth.dto;

public record AuthResponse(String token, String uid, String nome, String email) {
}
