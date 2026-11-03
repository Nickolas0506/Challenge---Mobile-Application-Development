package br.com.fiap.solin.distribuicao;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

/** Registro de cada download: mostra no painel quem ja baixou qual versao. */
@Entity
@Table(name = "downloads_apk")
public class Download {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long testadorId;
    private Long versaoId;
    private Instant data;

    protected Download() {
    }

    public Download(Long testadorId, Long versaoId, Instant data) {
        this.testadorId = testadorId;
        this.versaoId = versaoId;
        this.data = data;
    }

    public Long getId() {
        return id;
    }

    public Long getTestadorId() {
        return testadorId;
    }

    public Long getVersaoId() {
        return versaoId;
    }

    public Instant getData() {
        return data;
    }
}
