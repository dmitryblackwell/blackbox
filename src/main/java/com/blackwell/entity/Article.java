package com.blackwell.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;
import java.util.UUID;

@Entity
@Table
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Article {
    @Id
    @GeneratedValue
    private UUID id;

    private String title;
    private String author;

    @Column(columnDefinition="TEXT")
    private String content;

    private String imageExtension;
    private boolean isImageLoaded;

    @ManyToMany(cascade = CascadeType.ALL)
    private List<Tag> tags;
}
