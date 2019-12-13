package com.blackwell.repository;

import com.blackwell.entity.Article;
import com.blackwell.entity.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Repository
public interface ArticleRepository extends PagingAndSortingRepository<Article, UUID> {
    Page<Article> findAllByTagsInOrderByCreatedDesc(List<Tag> tags, Pageable pageable);
    Page<Article> findAllByOrderByCreatedDesc(Pageable pageable);
}
