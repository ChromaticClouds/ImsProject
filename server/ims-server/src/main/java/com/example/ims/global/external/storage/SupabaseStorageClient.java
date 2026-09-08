package com.example.ims.global.external.storage;

import com.example.ims.global.properties.StorageProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.util.UriUtils;

import java.io.IOException;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@Component
@ConditionalOnProperty(name = "app.storage.provider", havingValue = "supabase")
public class SupabaseStorageClient {

    private final RestClient restClient;
    private final String storageApiUrl;

    public SupabaseStorageClient(StorageProperties properties) {
        StorageProperties.Supabase config = properties.getSupabase();
        requireConfigured(config.getUrl(), "SUPABASE_URL");
        requireConfigured(config.getSecretKey(), "SUPABASE_SECRET_KEY");

        this.storageApiUrl = stripTrailingSlash(config.getUrl()) + "/storage/v1";
        this.restClient = RestClient.builder()
            .baseUrl(storageApiUrl)
            .defaultHeader("apikey", config.getSecretKey())
            .build();
    }

    public void upload(String bucket, String objectKey, MultipartFile file) throws IOException {
        try {
            restClient.post()
                .uri(objectUri(bucket, objectKey))
                .contentType(resolveContentType(file.getContentType()))
                .contentLength(file.getSize())
                .header("Cache-Control", "max-age=3600")
                .header("x-upsert", "false")
                .body(file.getResource())
                .retrieve()
                .toBodilessEntity();
        } catch (RestClientResponseException exception) {
            throw storageException("파일 업로드", exception);
        }
    }

    public URI createSignedDownloadUrl(
        String bucket,
        String objectKey,
        String downloadName,
        long expiresInSeconds
    ) throws IOException {
        try {
            SignedUrlResponse response = restClient.post()
                .uri(signUri(bucket, objectKey))
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("expiresIn", expiresInSeconds))
                .retrieve()
                .body(SignedUrlResponse.class);

            if (response == null || !StringUtils.hasText(response.signedUrl())) {
                throw new IOException("Supabase가 서명 URL을 반환하지 않았습니다.");
            }

            String separator = response.signedUrl().contains("?") ? "&" : "?";
            String encodedName = UriUtils.encodeQueryParam(downloadName, StandardCharsets.UTF_8);
            return URI.create(storageApiUrl + response.signedUrl() + separator + "download=" + encodedName);
        } catch (RestClientResponseException exception) {
            throw storageException("서명 URL 생성", exception);
        }
    }

    public void delete(String bucket, List<String> objectKeys) throws IOException {
        if (objectKeys.isEmpty()) return;

        try {
            restClient.method(org.springframework.http.HttpMethod.DELETE)
                .uri(deleteUri(bucket))
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("prefixes", objectKeys))
                .retrieve()
                .toBodilessEntity();
        } catch (RestClientResponseException exception) {
            throw storageException("파일 삭제", exception);
        }
    }

    private URI objectUri(String bucket, String objectKey) {
        return storageUri("object", bucket, objectKey);
    }

    private URI signUri(String bucket, String objectKey) {
        return storageUri("object/sign", bucket, objectKey);
    }

    private URI deleteUri(String bucket) {
        return UriComponentsBuilder.fromUriString(storageApiUrl)
            .pathSegment("object", bucket)
            .build()
            .encode()
            .toUri();
    }

    private URI storageUri(String operation, String bucket, String objectKey) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(storageApiUrl)
            .pathSegment(operation.split("/"))
            .pathSegment(bucket);

        for (String segment : objectKey.split("/")) {
            if (StringUtils.hasText(segment)) builder.pathSegment(segment);
        }
        return builder.build().encode().toUri();
    }

    private MediaType resolveContentType(String contentType) {
        if (!StringUtils.hasText(contentType)) return MediaType.APPLICATION_OCTET_STREAM;
        try {
            return MediaType.parseMediaType(contentType);
        } catch (IllegalArgumentException ignored) {
            return MediaType.APPLICATION_OCTET_STREAM;
        }
    }

    private IOException storageException(String operation, RestClientResponseException exception) {
        HttpStatusCode status = exception.getStatusCode();
        return new IOException("Supabase Storage " + operation + "에 실패했습니다. (HTTP "
            + status.value() + ")", exception);
    }

    private static void requireConfigured(String value, String environmentVariable) {
        if (!StringUtils.hasText(value)) {
            throw new IllegalStateException(environmentVariable + " 환경변수가 필요합니다.");
        }
    }

    private static String stripTrailingSlash(String value) {
        return value.replaceAll("/+$", "");
    }

    private record SignedUrlResponse(@JsonProperty("signedURL") String signedUrl) {
    }
}
