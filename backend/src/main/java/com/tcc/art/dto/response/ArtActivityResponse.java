package com.tcc.art.dto.response;

import com.tcc.art.model.ArtActivity;

import java.math.BigDecimal;
import java.util.UUID;

public record ArtActivityResponse(
        UUID id,
        String atividade,
        String grupo,
        String subgrupo,
        String obraServico,
        String complemento,
        BigDecimal quantidade,
        String unidade
) {
    public static ArtActivityResponse from(ArtActivity a) {
        return new ArtActivityResponse(
                a.getId(),
                a.getAtividade(),
                a.getGrupo(),
                a.getSubgrupo(),
                a.getObraServico(),
                a.getComplemento(),
                a.getQuantidade(),
                a.getUnidade()
        );
    }
}
