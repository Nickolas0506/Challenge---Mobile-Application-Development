package br.com.fiap.solin.recurso;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "passeios")
public class Passeio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String userId;
    private String petId;
    private String data;
    private String duracaoMin;
    private boolean bebeuAgua;
    private boolean urinou;
    private boolean urinaNormal;
    private boolean fezesNormais;
    private boolean comportamentoNormal;
    private String observacao;

    public Long getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getPetId() {
        return petId;
    }

    public void setPetId(String petId) {
        this.petId = petId;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getDuracaoMin() {
        return duracaoMin;
    }

    public void setDuracaoMin(String duracaoMin) {
        this.duracaoMin = duracaoMin;
    }

    public boolean isBebeuAgua() {
        return bebeuAgua;
    }

    public void setBebeuAgua(boolean bebeuAgua) {
        this.bebeuAgua = bebeuAgua;
    }

    public boolean isUrinou() {
        return urinou;
    }

    public void setUrinou(boolean urinou) {
        this.urinou = urinou;
    }

    public boolean isUrinaNormal() {
        return urinaNormal;
    }

    public void setUrinaNormal(boolean urinaNormal) {
        this.urinaNormal = urinaNormal;
    }

    public boolean isFezesNormais() {
        return fezesNormais;
    }

    public void setFezesNormais(boolean fezesNormais) {
        this.fezesNormais = fezesNormais;
    }

    public boolean isComportamentoNormal() {
        return comportamentoNormal;
    }

    public void setComportamentoNormal(boolean comportamentoNormal) {
        this.comportamentoNormal = comportamentoNormal;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }
}
