package com.blackwell.mapper;


import com.blackwell.entity.Article;
import com.blackwell.entity.Tag;
import com.blackwell.payload.ArticleDTO;
import org.apache.commons.io.IOUtils;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.blackwell.api.ArticleRestController.IMAGE_PATH;

public class ArticleMapper {

    private ArticleMapper() {}

    public static ArticleDTO mapToDTO(Article article) {
        byte[] fileBytes;
        //TODO refactor this construction
        try {
            if (article.isImageLoaded()) {
                File file = new File(IMAGE_PATH + article.getImageFullName());
                fileBytes = IOUtils.toByteArray(new FileInputStream(file));
            } else {
                URL url = new URL(article.getImageUrl());
                fileBytes = new BufferedInputStream(url.openConnection().getInputStream()).readAllBytes();
            }
        } catch (IOException e) {
            fileBytes = null;
            // TODO log it
            e.printStackTrace();
        }
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy.MM.dd 'at' HH:mm:ss z");
        return ArticleDTO.builder()
                .id(article.getId().toString())
                .title(article.getTitle())
                .author(article.getAuthor())
                .content(article.getContent())
                .created(dateFormat.format(article.getCreated()))
                .liked(article.getLiked())
                .totalVotes(article.getLiked() + article.getDisliked())
                .image(fileBytes)
                .tags(article.getTags().stream()
                        .map(Tag::getName)
                        .collect(Collectors.toList()))
                .build();
    }

    public static Article mapToEntity(ArticleDTO article, List<Tag> tags) {
        // TODO refactor it with less db usage
        return Article.builder()
                .id(article.getId() == null ? null : UUID.fromString(article.getId()))
                .title(article.getTitle())
                .author(article.getAuthor())
                .content(article.getContent())
                .isImageLoaded(article.getImage() != null)
                .tags(tags)
                .build();
    }

}
