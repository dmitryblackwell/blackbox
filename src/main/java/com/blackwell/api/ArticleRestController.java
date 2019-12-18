package com.blackwell.api;

import com.blackwell.entity.Article;
import com.blackwell.entity.Tag;
import com.blackwell.payload.ArticleDTO;
import com.blackwell.payload.SaveArticleResponse;
import com.blackwell.payload.TagSearchRequest;
import com.blackwell.repository.ArticleRepository;
import com.blackwell.repository.TagRepository;
import lombok.AllArgsConstructor;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/article")
@AllArgsConstructor
public class ArticleRestController {

    private ArticleRepository articleRepository;
    private TagRepository tagRepository;

    private static final int PAGE_SIZE = 3;

    public static final String IMAGE_PATH = System.getProperty("user.dir") + File.separator
            + "target" + File.separator + "images" + File.separator;


    @PostMapping
    public Page<ArticleDTO> articles(@RequestBody(required = false) TagSearchRequest params) {
        if (params.isTagsNotPresent()) {
            return articleRepository.findAllByOrderByCreatedDesc(params.getPageRequest(PAGE_SIZE))
                    .map(this::mapToDTO);
        }

        Page<Article> articlePage = articleRepository.findAllByTagsInOrderByCreatedDesc(
                params.getTags(),
                params.getPageRequest(PAGE_SIZE));
        return articlePage.map(this::mapToDTO);
    }


    @PostMapping("/tag/")
    public Set<ArticleDTO> tagSearch(@RequestBody TagSearchRequest tagSearchRequest) {
        Page<Article> articlePage =
                articleRepository.findAllByTagsInOrderByCreatedDesc(
                        tagSearchRequest.getTags(),
                        tagSearchRequest.getPageRequest(PAGE_SIZE));
        return articlePage.get()
                .map(this::mapToDTO)
                .collect(Collectors.toSet());
    }

    @GetMapping("/{id}")
    public ArticleDTO getArticle(@PathVariable String id) {
        return mapToDTO(articleRepository.findById(UUID.fromString(id)).orElseThrow());
    }

    @PutMapping
    public ResponseEntity<SaveArticleResponse> saveArticle(@Valid @RequestBody ArticleDTO article, BindingResult bindingResult) {
        SaveArticleResponse articleResponse = new SaveArticleResponse();
        if (bindingResult.hasErrors()) {
            articleResponse.setErrors(bindingResult.getAllErrors().stream().map(DefaultMessageSourceResolvable::getDefaultMessage)
                    .collect(Collectors.toList()));
            return new ResponseEntity<>(articleResponse, HttpStatus.BAD_REQUEST);
        }
        Article result = articleRepository.save(mapToEntity(article));
        articleResponse.setId(result.getId().toString());
        return ResponseEntity.ok(articleResponse);
    }

    @PostMapping(value = "/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file, String id) throws IOException {
        File dir = new File(IMAGE_PATH);
        if (!dir.exists())
            dir.mkdir();

        String fileExtension = "." + FilenameUtils.getExtension(file.getOriginalFilename());
        UUID imageId = UUID.randomUUID();
        file.transferTo(new File(IMAGE_PATH + imageId.toString() + fileExtension));

        Article article = articleRepository.findById(UUID.fromString(id)).orElseThrow();
        article.setImageExtension(fileExtension);
        article.setImageName(imageId);
        article.setImageLoaded(true);
        articleRepository.save(article);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/liked")
    public ResponseEntity<?> liked(String id) {
        Article article = articleRepository.findById(UUID.fromString(id)).orElseThrow();
        article.increaseLiked();
        articleRepository.save(article);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/disliked")
    public ResponseEntity<?> disliked(String id) {
        Article article = articleRepository.findById(UUID.fromString(id)).orElseThrow();
        article.increaseDisliked();
        articleRepository.save(article);
        return ResponseEntity.ok().build();
    }


    // TODO refactor it with mapper or converter
    private ArticleDTO mapToDTO(Article article) {
        byte[] fileBytes;
        // refactor this construction
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

    private Article mapToEntity(ArticleDTO article) {
        // TODO refactor it with less db usage
        List<Tag> tags = article.getTags().stream()
                .map(tagName -> {
                    Optional<Tag> tagOptional = tagRepository.findByName(tagName);
                    return tagOptional.orElseGet(() -> Tag.builder()
                            .name(tagName)
                            .build());
                })
                .collect(Collectors.toList());
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
