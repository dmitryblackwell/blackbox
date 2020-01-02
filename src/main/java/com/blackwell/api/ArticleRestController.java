package com.blackwell.api;

import com.blackwell.entity.Article;
import com.blackwell.entity.Tag;
import com.blackwell.mapper.ArticleMapper;
import com.blackwell.payload.ArticleDTO;
import com.blackwell.payload.SaveArticleResponse;
import com.blackwell.payload.TagSearchRequest;
import com.blackwell.repository.ArticleRepository;
import com.blackwell.repository.TagRepository;
import lombok.AllArgsConstructor;
import org.apache.commons.io.FilenameUtils;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.File;
import java.io.IOException;
import java.util.*;
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
                    .map(ArticleMapper::mapToDTO);
        }

        Page<Article> articlePage = articleRepository.findAllByTagsInOrderByCreatedDesc(
                params.getTags(),
                params.getPageRequest(PAGE_SIZE));
        return articlePage.map(ArticleMapper::mapToDTO);
    }


    @PostMapping("/tag/")
    public Set<ArticleDTO> tagSearch(@RequestBody TagSearchRequest tagSearchRequest) {
        Page<Article> articlePage =
                articleRepository.findAllByTagsInOrderByCreatedDesc(
                        tagSearchRequest.getTags(),
                        tagSearchRequest.getPageRequest(PAGE_SIZE));
        return articlePage.get()
                .map(ArticleMapper::mapToDTO)
                .collect(Collectors.toSet());
    }

    @GetMapping("/{id}")
    public ArticleDTO getArticle(@PathVariable String id) {
        return ArticleMapper.mapToDTO(articleRepository.findById(UUID.fromString(id)).orElseThrow());
    }

    @PutMapping
    public ResponseEntity<SaveArticleResponse> saveArticle(@Valid @RequestBody ArticleDTO article, BindingResult bindingResult) {
        SaveArticleResponse articleResponse = new SaveArticleResponse();
        if (bindingResult.hasErrors()) {
            Map<String, String> errorsMap = new HashMap<>();
            for (FieldError fieldError : bindingResult.getFieldErrors()) {
                errorsMap.put(fieldError.getField(), fieldError.getDefaultMessage());
            }
            articleResponse.setErrors(errorsMap);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(articleResponse);
        }

        // TODO save tags other way
        List<Tag> tags = article.getTags().stream()
                .map(tagName -> {
                    Optional<Tag> tagOptional = tagRepository.findByName(tagName);
                    return tagOptional.orElseGet(() -> Tag.builder()
                            .name(tagName)
                            .build());
                })
                .collect(Collectors.toList());
        Article result = articleRepository.save(ArticleMapper.mapToEntity(article, tags));
        articleResponse.setId(result.getId().toString());
        return ResponseEntity.ok(articleResponse);
    }

    @PostMapping(value = "/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file, String id) throws IOException {
        File dir = new File(IMAGE_PATH);
        if (!dir.exists())
            dir.mkdir();

        // TODO move this code to the handlers
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



}
