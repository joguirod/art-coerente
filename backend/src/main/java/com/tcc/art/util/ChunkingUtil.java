package com.tcc.art.util;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Splits text into overlapping chunks of approximately targetTokens tokens.
 * Uses a simple whitespace-based tokenization approximation (1 token ≈ 4 characters).
 */
@Component
public class ChunkingUtil {

    private static final int CHARS_PER_TOKEN = 4;

    public List<String> chunk(String text, int targetTokens, int overlapTokens) {
        if (text == null || text.isBlank()) return List.of();

        int targetChars = targetTokens * CHARS_PER_TOKEN;
        int overlapChars = overlapTokens * CHARS_PER_TOKEN;

        List<String> chunks = new ArrayList<>();
        String[] words = text.split("\\s+");

        StringBuilder current = new StringBuilder();
        int start = 0;

        while (start < words.length) {
            current.setLength(0);
            int end = start;

            while (end < words.length) {
                String word = words[end];
                if (current.length() + word.length() + 1 > targetChars && current.length() > 0) {
                    break;
                }
                if (current.length() > 0) current.append(" ");
                current.append(word);
                end++;
            }

            if (current.length() > 0) {
                chunks.add(current.toString().trim());
            }

            if (end >= words.length) break;

            // Calculate overlap: step back overlapChars worth of words
            int overlapWordCount = 0;
            int overlapAccum = 0;
            for (int i = end - 1; i >= start && overlapAccum < overlapChars; i--) {
                overlapAccum += words[i].length() + 1;
                overlapWordCount++;
            }
            start = end - overlapWordCount;
            if (start <= 0 || start >= end) start = end; // safety guard
        }

        return chunks;
    }

    /**
     * Default chunking: ~500 tokens, ~50 token overlap.
     */
    public List<String> chunk(String text) {
        return chunk(text, 500, 50);
    }
}
