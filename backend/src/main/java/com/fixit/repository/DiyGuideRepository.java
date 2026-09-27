package com.fixit.repository;

import com.fixit.entity.DifficultyLevel;
import com.fixit.entity.DiyGuide;
import com.fixit.entity.ProblemCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiyGuideRepository extends JpaRepository<DiyGuide, Long> {

    @Query("SELECT g FROM DiyGuide g WHERE " +
           "(:category IS NULL OR g.category = :category) AND " +
           "(:difficulty IS NULL OR g.difficulty = :difficulty) AND " +
           "(:search IS NULL OR LOWER(g.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(g.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<DiyGuide> filterGuides(@Param("category") ProblemCategory category,
                                @Param("difficulty") DifficultyLevel difficulty,
                                @Param("search") String search);
}
