package com.tcc.art.dto.response;

import com.tcc.art.model.TosItem;

public record TosItemResponse(
        Integer seq,
        String grupo,
        String subgrupo,
        String obraServico,
        String complemento
) {
    public static TosItemResponse from(TosItem t) {
        return new TosItemResponse(t.getSeq(), t.getGrupo(), t.getSubgrupo(), t.getObraServico(), t.getComplemento());
    }
}
