package com.blackwell.config;

import com.blackwell.entity.Article;
import com.blackwell.entity.Tag;
import com.blackwell.payload.PixabayApiResponse;
import com.blackwell.repository.ArticleRepository;
import com.blackwell.repository.TagRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public class ArticlesInitializer implements ApplicationListener<ApplicationReadyEvent> {

    private static final String API_URL_CONTENT = "http://loripsum.net/api/9/short/headers/links/ol/dl/bc/";
    private static final String API_URL_HEADER = "http://loripsum.net/api/1/short/header/plaintext";

    private static final int PIXABAY_IMAGES_PER_PAGE_LENGTH = 50;
    private static final String PIXABAY_API_URL = "https://pixabay.com/api/?key=" + AuthKey.PIXABAY_AUTH_KEY
            + "&per_page=" + PIXABAY_IMAGES_PER_PAGE_LENGTH + "&q=";

    private static final String[] TAGS = {"future", "tech", "element", "health", "science", "business", "work", "culture",
                        "food", "programming", "design", "neuroscience", "politics", "relationships", "style"};

    private static final String[] AUTHORS = {"Delia Owens", "Michelle Obama", "Dav Pilkey", "Rachel Hollis", "Jeff Kinney",
                        "Rachel Hollis", "Dr. Seuss", "Tara Westover", "Heather Morris", "Craig Smith"};

    private static final Logger LOGGER = LoggerFactory.getLogger(ArticlesInitializer.class);

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
        LOGGER.info("Starting initialization of photos...");
        articleRepository.saveAll(
                Stream.generate(() -> {
                    List<Tag> articlesTags = getRandomTags(tags);
                    return Article.builder()
                            .author(getRandomAuthor())
                            .content(getRandomContent())
                            .title(getRandomHeader())
                            .tags(articlesTags)
                            .imageUrl(getRandomImageUrl(articlesTags))
                            .isImageLoaded(false)
                            .build();
                }).limit(ARTICLES_COUNT)
                        .collect(Collectors.toList()));
        LOGGER.info("Finish initialization of photos");
    }

    private String getRandomImageUrl(List<Tag> tags) {
        // TODO get whole bunch of images for all tags and after pick one
        String url = PIXABAY_API_URL + tags.get(0).getName();
        PixabayApiResponse response = restTemplate.getForObject(url, PixabayApiResponse.class);
        if (response == null)
            return "";
        return response.getHits()[random.nextInt(response.getHits().length)].getWebformatURL();
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
                .collect(Collectors.joining("+"));
    }

}
