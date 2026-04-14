package com.wellnest.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Blog entity – health articles created by admins/trainers/users.
 * UPDATED: Added BlogStatus with moderation workflow while preserving existing fields
 */
@Entity
@Table(name = "blogs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Blog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 5, max = 200)
    @Column(nullable = false)
    private String title;

    @NotBlank
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @NotBlank
    @Column(nullable = false)
    @Builder.Default
    private String category = "General";

    @Column(nullable = true)
    private String imageUrl;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(name = "author_name")
    private String authorName;

    @Column(name = "author_id")
    private Long authorId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private BlogStatus status = BlogStatus.PENDING;

    @Column(name = "likes_count")
    @Builder.Default
    private Integer likesCount = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "moderated_at")
    private LocalDateTime moderatedAt;

    @Column(name = "moderated_by")
    private String moderatedBy;  // Name of admin/trainer who approved/rejected

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_user_id")
    private User author;

    // For backward compatibility - get author name from either author object or authorName field
    public String getAuthor() {
        if (author != null && author.getName() != null) {
            return author.getName();
        }
        return authorName;
    }

    public void setAuthor(String author) {
        this.authorName = author;
    }

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        
        if (this.likesCount == null) {
            this.likesCount = 0;
        }
        
        if (this.status == null) {
            this.status = BlogStatus.PENDING;
        }
        
        if (this.category == null) {
            this.category = "General";
        }
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}