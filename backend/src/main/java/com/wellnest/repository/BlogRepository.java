package com.wellnest.repository;

import com.wellnest.entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/** Blog repository. */
@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    List<Blog> findAllByOrderByCreatedAtDesc();
    List<Blog> findByCategoryIgnoreCaseOrderByCreatedAtDesc(String category);
}