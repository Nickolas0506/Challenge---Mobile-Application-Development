package br.com.fiap.solin.distribuicao;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

/** Pessoa autorizada a baixar o APK (o professor entra aqui com o e-mail institucional). */
@Entity
@Table(name = "testadores")
public class Testador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    private String nome;

    /** Codigo secreto do link de convite (/distribuicao/?c=CODIGO). */
    @Column(nullable = false, unique = true)
    private String codigo;

    private Instant convidadoEm;

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public Instant getConvidadoEm() {
        return convidadoEm;
    }

    public void setConvidadoEm(Instant convidadoEm) {
        this.convidadoEm = convidadoEm;
    }
}
