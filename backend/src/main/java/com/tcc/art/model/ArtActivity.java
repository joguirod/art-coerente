package com.tcc.art.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "art_activity")
public class ArtActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "art_id", nullable = false)
    private Art art;

    @Column(nullable = false, length = 150)
    private String atividade;

    @Column(nullable = false, length = 60)
    private String grupo;

    @Column(nullable = false, length = 200)
    private String subgrupo;

    @Column(name = "obra_servico", nullable = false, length = 200)
    private String obraServico;

    @Column(length = 200)
    private String complemento;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal quantidade;

    @Column(nullable = false, length = 50)
    private String unidade;

    public ArtActivity() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Art getArt() { return art; }
    public void setArt(Art art) { this.art = art; }

    public String getAtividade() { return atividade; }
    public void setAtividade(String atividade) { this.atividade = atividade; }

    public String getGrupo() { return grupo; }
    public void setGrupo(String grupo) { this.grupo = grupo; }

    public String getSubgrupo() { return subgrupo; }
    public void setSubgrupo(String subgrupo) { this.subgrupo = subgrupo; }

    public String getObraServico() { return obraServico; }
    public void setObraServico(String obraServico) { this.obraServico = obraServico; }

    public String getComplemento() { return complemento; }
    public void setComplemento(String complemento) { this.complemento = complemento; }

    public BigDecimal getQuantidade() { return quantidade; }
    public void setQuantidade(BigDecimal quantidade) { this.quantidade = quantidade; }

    public String getUnidade() { return unidade; }
    public void setUnidade(String unidade) { this.unidade = unidade; }
}
