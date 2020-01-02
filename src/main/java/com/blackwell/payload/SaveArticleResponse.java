package com.blackwell.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SaveArticleResponse {
    private String id;
    private boolean isValid;
    private Map<String, String> errors;
}
