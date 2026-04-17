package com.tcc.art.repository;

import com.tcc.art.model.TosItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TosItemRepository extends JpaRepository<TosItem, Integer> {

    @Query(value = """
            SELECT * FROM tos_item
            WHERE to_tsvector('portuguese',
                grupo || ' ' || subgrupo || ' ' || obra_servico || ' ' || COALESCE(complemento, ''))
                @@ plainto_tsquery('portuguese', :q)
            ORDER BY seq
            LIMIT :limit
            """, nativeQuery = true)
    List<TosItem> searchFullText(@Param("q") String q, @Param("limit") int limit);

    @Query(value = """
            SELECT * FROM tos_item
            WHERE LOWER(grupo || ' ' || subgrupo || ' ' || obra_servico || ' ' || COALESCE(complemento, ''))
                LIKE LOWER(CONCAT('%', :q, '%'))
            ORDER BY seq
            LIMIT :limit
            """, nativeQuery = true)
    List<TosItem> searchIlike(@Param("q") String q, @Param("limit") int limit);

    @Query("SELECT DISTINCT t.grupo FROM TosItem t ORDER BY t.grupo")
    List<String> findDistinctGrupos();
}
