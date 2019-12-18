package com.blackwell.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ArticleDTO {
    private String id;

    @NotBlank
    private String title;
    @NotBlank
    private String content;
    @NotBlank
    private String author;

    private byte[] image;

    String created;

    private List<String> tags;

    private int liked;
    private int totalVotes;
}
