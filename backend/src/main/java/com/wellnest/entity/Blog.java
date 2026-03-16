package com.wellnest.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category = "General";

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
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
    private BlogStatus status;

    @Column(name = "likes_count")
    private Integer likesCount = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    private String author;

public String getAuthor() {
    return author;
}

public void setAuthor(String author) {
    this.author = author;
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