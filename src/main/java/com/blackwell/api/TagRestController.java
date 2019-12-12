package com.blackwell.api;

import com.blackwell.entity.Tag;
import com.blackwell.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tag")
public class TagRestController {

    @Autowired
    private TagRepository tagRepository;

    @GetMapping
    public Iterable<Tag> tags() {
        return tagRepository.findAll();
    }

}
