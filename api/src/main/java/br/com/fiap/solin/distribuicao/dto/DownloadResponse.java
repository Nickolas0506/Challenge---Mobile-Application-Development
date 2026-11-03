package br.com.fiap.solin.distribuicao.dto;

import java.time.Instant;

public record DownloadResponse(String email, String versao, String commit, Instant data) {
}
