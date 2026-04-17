package com.tcc.art.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tos_item")
public class TosItem {

    @Id
    private Integer seq;

    @Column(nullable = false, length = 60)
    private String grupo;

    @Column(nullable = false, length = 200)
    private String subgrupo;

    @Column(name = "obra_servico", nullable = false, length = 200)
    private String obraServico;

    @Column(length = 200)
    private String complemento;

    public TosItem() {}

    public Integer getSeq() { return seq; }
    public void setSeq(Integer seq) { this.seq = seq; }

    public String getGrupo() { return grupo; }
    public void setGrupo(String grupo) { this.grupo = grupo; }

    public String getSubgrupo() { return subgrupo; }
    public void setSubgrupo(String subgrupo) { this.subgrupo = subgrupo; }

    public String getObraServico() { return obraServico; }
    public void setObraServico(String obraServico) { this.obraServico = obraServico; }

    public String getComplemento() { return complemento; }
    public void setComplemento(String complemento) { this.complemento = complemento; }
}
