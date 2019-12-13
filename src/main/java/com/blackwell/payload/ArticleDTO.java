package com.blackwell.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ArticleDTO {
    private String id;

    private String title;
    private String content;
    private String author;

    private byte[] image;

    String created;

    private List<String> tags;
}
