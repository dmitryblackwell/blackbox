package com.blackwell.payload;

import com.blackwell.entity.Tag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.PageRequest;

import java.util.Arrays;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TagSearchRequest {
    private Integer pageId;
    private List<Tag> tags;

    public void setPageId(Integer pageId) {
        if (pageId == null)
            pageId = 0;
        this.pageId = pageId;
    }

    public PageRequest getPageRequest(int pageSize) {
        return PageRequest.of(pageId, pageSize);
    }
}
