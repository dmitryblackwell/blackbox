package com.blackwell.payload;

import lombok.Data;

@Data
public class PixabayApiResponse {

    @Data
    public static class Hit {
        private long id;
        private String webformatURL;
    }

    private int totalHits;
    private Hit[] hits;

}
