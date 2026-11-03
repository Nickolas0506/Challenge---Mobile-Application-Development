package br.com.fiap.solin.distribuicao;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

/** Dados de um APK publicado. O arquivo fica em ArquivoApk para a listagem nao carregar os bytes. */
@Entity
@Table(name = "versoes_app")
public class VersaoApp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String versao;

    /** Hash do commit do codigo que gerou o APK (o mesmo exibido na tela "Sobre o App"). */
    @Column(name = "commit_hash", nullable = false)
    private String commit;

    @Column(length = 2000)
    private String notas;

    private long tamanho;
    private Instant publicadaEm;

    public Long getId() {
        return id;
    }

    public String getVersao() {
        return versao;
    }

    public void setVersao(String versao) {
        this.versao = versao;
    }

    public String getCommit() {
        return commit;
    }

    public void setCommit(String commit) {
        this.commit = commit;
    }

    public String getNotas() {
        return notas;
    }

    public void setNotas(String notas) {
        this.notas = notas;
    }

    public long getTamanho() {
        return tamanho;
    }

    public void setTamanho(long tamanho) {
        this.tamanho = tamanho;
    }

    public Instant getPublicadaEm() {
        return publicadaEm;
    }

    public void setPublicadaEm(Instant publicadaEm) {
        this.publicadaEm = publicadaEm;
    }

    public String nomeArquivo() {
        String curto = commit.length() > 7 ? commit.substring(0, 7) : commit;
        return "solin-" + versao + "-" + curto + ".apk";
    }
}
