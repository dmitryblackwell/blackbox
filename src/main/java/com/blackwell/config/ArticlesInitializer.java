package com.blackwell.config;

import com.blackwell.entity.Article;
import com.blackwell.entity.Tag;
import com.blackwell.repository.ArticleRepository;
import com.blackwell.repository.TagRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public class ArticlesInitializer implements ApplicationListener<ApplicationReadyEvent> {

    private static final String API_URL_CONTENT = "http://loripsum.net/api/9/short/headers/links/ol/dl/bc/code";
    private static final String API_URL_HEADER = "http://loripsum.net/api/1/short/header/plaintext";

    private static final String[] TAGS = {"future", "tech", "element", "health", "science", "business", "work", "culture",
                        "food", "programming", "design", "neuroscience", "politics", "relationships", "style"};

    private static final String[] AUTHORS = {"Delia Owens", "Michelle Obama", "Dav Pilkey", "Rachel Hollis", "Jeff Kinney",
                        "Rachel Hollis", "Dr. Seuss", "Tara Westover", "Heather Morris", "Craig Smith"};

    private static final UUID IMAGES_ID = UUID.fromString("10a4bf1f-a3cf-4283-b8fe-0ae9168146a8");
    private static final String IMAGES_EXTENSION = ".png";


    private static final int ARTICLES_COUNT = 50;
    public static final String SPLIT_BY_SENTENCE_REGEXP = "(?<=[a-z])\\.\\s+";
    public static final int TAGS_LIMIT_PER_ARTICLE = 2;

    private ArticleRepository articleRepository;
    private TagRepository tagRepository;
    private Random random;
    private RestTemplate restTemplate;

    public ArticlesInitializer(ArticleRepository articleRepository, TagRepository tagRepository) {
        this.articleRepository = articleRepository;
        this.tagRepository = tagRepository;
        this.random = new Random();
        this.restTemplate = new RestTemplate();
    }


    @Override
    public void onApplicationEvent(ApplicationReadyEvent applicationReadyEvent) {
        List<Tag> tags = Arrays.stream(TAGS)
                .map(tagName ->
                        Tag.builder()
                                .name(tagName)
                                .build())
                .collect(Collectors.toList());
        articleRepository.saveAll(
                Stream.generate(() -> {
                    List<Tag> articlesTags = getRandomTags(tags);
                    return Article.builder()
                            .author(getRandomAuthor())
                            .content(getRandomContent())
                            .title(getRandomHeader())
                            .tags(articlesTags)
                            .imageUrl("https://source.unsplash.com/1600x900/?" + getTagsNamesAsParam(articlesTags))
                            .isImageLoaded(false)
                            .build();
                }).limit(ARTICLES_COUNT)
                        .collect(Collectors.toList()));
    }

    private String getRandomContent() {
        return restTemplate.getForObject(API_URL_CONTENT, String.class);
    }

    private String getRandomHeader() {
        String header = restTemplate.getForObject(API_URL_HEADER, String.class);
        String[] sentence = Objects.requireNonNull(header).split(SPLIT_BY_SENTENCE_REGEXP);
        return sentence[random.nextInt(sentence.length)];
    }

    private String getRandomAuthor() {
        return AUTHORS[random.nextInt(AUTHORS.length)];
    }

    private List<Tag> getRandomTags(List<Tag> allTags) {
        return Stream.generate(() ->
                allTags.get(random.nextInt(allTags.size())))
                .limit(TAGS_LIMIT_PER_ARTICLE)
                .collect(Collectors.toList());
    }
    private String getTagsNamesAsParam(List<Tag> tags) {
        return tags.stream()
                .map(Tag::getName)
                .collect(Collectors.joining(","));
    }

}
