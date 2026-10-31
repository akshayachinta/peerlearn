package com.peerlearn.repository;

import com.peerlearn.model.SkillCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SkillCategoryRepository extends JpaRepository<SkillCategory, Long> {
    Optional<SkillCategory> findByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);
}
