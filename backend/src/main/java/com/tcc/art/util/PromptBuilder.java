package com.tcc.art.util;

import com.tcc.art.model.Art;
import com.tcc.art.model.ArtActivity;
import com.tcc.art.model.KnowledgeChunk;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PromptBuilder {

    private static final String SYSTEM_INSTRUCTION = """
            Você é um assistente de análise de coerência técnica de Anotações de Responsabilidade Técnica (ART).

            Com base nos trechos normativos fornecidos abaixo, analise se existe coerência entre a descrição da obra e as atividades técnicas declaradas.

            Para cada inconsistência encontrada, gere um alerta indicando:
            - O tipo (erro para inconsistências graves, aviso para pontos de atenção)
            - Uma mensagem descritiva em linguagem acessível
            - A fonte normativa que fundamenta o alerta
            - Qual atividade específica da ART gerou o problema

            Gere também um score de coerência de 0 a 100, onde 100 é totalmente coerente e 0 é completamente inconsistente. O score deve ser proporcional à quantidade e gravidade dos alertas.

            Se houver observações relevantes baseadas em conhecimento geral que não estejam fundamentadas nos trechos normativos fornecidos, inclua-as separadamente no campo "recomendacoes_complementares" e deixe claro que são recomendações opcionais.

            Responda APENAS com o JSON no formato especificado, sem texto adicional.

            Formato de resposta JSON:
            {
              "coerente": boolean,
              "score": integer (0-100),
              "resumo": "string (1-3 frases)",
              "alertas": [
                {
                  "tipo": "erro" | "aviso",
                  "mensagem": "string",
                  "fonte": "string",
                  "atividade": "string"
                }
              ],
              "sugestoes": ["string"],
              "recomendacoes_complementares": ["string"]
            }
            """;

    public String build(Art art, List<KnowledgeChunk> chunks) {
        StringBuilder prompt = new StringBuilder();
        prompt.append(SYSTEM_INSTRUCTION).append("\n\n");

        // Normative context
        if (!chunks.isEmpty()) {
            prompt.append("Trechos normativos relevantes:\n\n");
            for (int i = 0; i < chunks.size(); i++) {
                KnowledgeChunk chunk = chunks.get(i);
                prompt.append("[").append(i + 1).append("] Fonte: ").append(chunk.getSource()).append("\n");
                prompt.append("Trecho: ").append(chunk.getChunkText()).append("\n\n");
            }
        } else {
            prompt.append("Nota: Nenhum trecho normativo específico foi recuperado para esta consulta. ");
            prompt.append("A análise será baseada no conhecimento geral do modelo.\n\n");
        }

        // ART data
        prompt.append("Dados da ART para análise:\n\n");
        prompt.append("Descrição da obra: ").append(art.getDescription()).append("\n");
        prompt.append("Localização: ").append(art.getLocation()).append("\n");
        prompt.append("Contratante: ").append(art.getContractorName()).append("\n");
        prompt.append("Período: ").append(art.getStartDate()).append(" a ").append(art.getEndDate()).append("\n");

        if (art.getArtNumber() != null && !art.getArtNumber().isBlank()) {
            prompt.append("Número da ART: ").append(art.getArtNumber()).append("\n");
        }

        prompt.append("\nAtividades declaradas:\n");
        List<ArtActivity> activities = art.getActivities();
        for (int i = 0; i < activities.size(); i++) {
            ArtActivity activity = activities.get(i);
            prompt.append("- Atividade ").append(i + 1).append(":\n");
            prompt.append("  Atividade: ").append(activity.getAtividade()).append("\n");
            prompt.append("  Grupo TOS: ").append(activity.getGrupo()).append("\n");
            prompt.append("  Subgrupo TOS: ").append(activity.getSubgrupo()).append("\n");
            prompt.append("  Obra/Serviço (TOS): ").append(activity.getObraServico()).append("\n");
            if (activity.getComplemento() != null) {
                prompt.append("  Complemento: ").append(activity.getComplemento()).append("\n");
            }
            prompt.append("  Quantidade: ").append(activity.getQuantidade())
                    .append(" ").append(activity.getUnidade()).append("\n");
        }

        return prompt.toString();
    }

    /**
     * Builds query text for embedding generation from ART data.
     */
    public String buildQueryText(Art art) {
        StringBuilder sb = new StringBuilder();
        sb.append(art.getDescription()).append(" ");
        sb.append(art.getLocation()).append(" ");
        for (ArtActivity a : art.getActivities()) {
            sb.append(a.getAtividade()).append(" ");
            sb.append(a.getGrupo()).append(" ");
            sb.append(a.getSubgrupo()).append(" ");
            sb.append(a.getObraServico()).append(" ");
            if (a.getComplemento() != null) sb.append(a.getComplemento()).append(" ");
        }
        return sb.toString().trim();
    }
}
