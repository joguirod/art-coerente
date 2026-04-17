package com.tcc.art.controller;

import com.tcc.art.dto.response.TosItemResponse;
import com.tcc.art.repository.TosItemRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tos")
public class TosController {

    private final TosItemRepository tosItemRepository;

    public TosController(TosItemRepository tosItemRepository) {
        this.tosItemRepository = tosItemRepository;
    }

    @GetMapping("/search")
    public List<TosItemResponse> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "30") int limit) {
        if (q == null || q.isBlank()) return List.of();
        List<TosItemResponse> results = tosItemRepository.searchFullText(q.trim(), limit)
                .stream().map(TosItemResponse::from).toList();
        if (results.isEmpty()) {
            results = tosItemRepository.searchIlike(q.trim(), limit)
                    .stream().map(TosItemResponse::from).toList();
        }
        return results;
    }

    @GetMapping("/grupos")
    public List<String> grupos() {
        return tosItemRepository.findDistinctGrupos();
    }
}
