package br.com.fiap.solin.distribuicao.dto;

import java.time.Instant;

public record TestadorResponse(
        Long id,
        String email,
        String nome,
        String linkConvite,
        Instant convidadoEm,
        long downloads,
        Instant ultimoDownload
) {
}
