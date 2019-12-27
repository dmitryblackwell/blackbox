package com.blackwell.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ArticleDTO {
    private String id;

    @NotBlank(message = "Title must not be blank")
    private String title;

    @NotBlank(message = "Content must not be blank")
    private String content;

    @NotBlank(message = "Author must not be blank")
    private String author;

    private byte[] image;

    String created;

    private List<String> tags;

    private int liked;
    private int totalVotes;
}
