package com.wellnest.repository;

import com.wellnest.entity.Blog;
import com.wellnest.entity.BlogStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Blog repository.
 * UPDATED: Added status-based queries for moderation while preserving existing queries
 */
@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    
    // Existing queries
    List<Blog> findAllByOrderByCreatedAtDesc();
    List<Blog> findByCategoryIgnoreCaseOrderByCreatedAtDesc(String category);
    
    // NEW: Status-based queries for RBAC
    List<Blog> findByStatusOrderByCreatedAtDesc(BlogStatus status);
    List<Blog> findByStatusAndCategoryIgnoreCaseOrderByCreatedAtDesc(BlogStatus status, String category);
    
    // NEW: Get approved blogs only (for public view)
    default List<Blog> findApprovedBlogs() {
        return findByStatusOrderByCreatedAtDesc(BlogStatus.APPROVED);
    }
    
    // NEW: Get pending blogs (for moderation)
    default List<Blog> findPendingBlogs() {
        return findByStatusOrderByCreatedAtDesc(BlogStatus.PENDING);
    }
    
    // NEW: Get user's own blogs (all statuses)
    List<Blog> findByAuthor_IdOrderByCreatedAtDesc(Long authorId);
    
    // NEW: Find blogs by author ID (keeping existing authorId field)
    List<Blog> findByAuthorIdOrderByCreatedAtDesc(Long authorId);
    
    // NEW: Find pending blogs for a specific author
    List<Blog> findByAuthorIdAndStatusOrderByCreatedAtDesc(Long authorId, BlogStatus status);
}