package com.blackwell.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.StringUtils;

import javax.persistence.*;
import java.util.Date;
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

    private UUID imageName;
    private String imageExtension;
    private boolean isImageLoaded;

    private String imageUrl;

    private Date created;
    private Date updated;

    @ManyToMany(cascade = CascadeType.MERGE)
    private List<Tag> tags;

    @PrePersist
    protected void onCreate() {
        created = new Date();
    }

    @PreUpdate
    protected void onUpdate() {
        updated = new Date();
    }

    public String getImageFullName() {
        return imageName != null ? (imageName.toString() + imageExtension) : StringUtils.EMPTY;
    }
}
