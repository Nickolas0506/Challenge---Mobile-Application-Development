package br.com.fiap.solin.distribuicao;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/** Bytes do APK guardados no banco (bytea no PostgreSQL), para sobreviver a novos deploys no Railway. */
@Entity
@Table(name = "arquivos_apk")
public class ArquivoApk {

    @Id
    private Long versaoId;

    @JdbcTypeCode(SqlTypes.VARBINARY)
    @Column(nullable = false, length = 200_000_000)
    private byte[] conteudo;

    protected ArquivoApk() {
    }

    public ArquivoApk(Long versaoId, byte[] conteudo) {
        this.versaoId = versaoId;
        this.conteudo = conteudo;
    }

    public Long getVersaoId() {
        return versaoId;
    }

    public byte[] getConteudo() {
        return conteudo;
    }
}
