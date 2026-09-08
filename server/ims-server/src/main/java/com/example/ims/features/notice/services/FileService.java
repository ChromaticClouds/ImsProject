package com.example.ims.features.notice.services;

import com.example.ims.features.notice.dto.FileDownloader;
import com.example.ims.features.notice.exceptions.FileNotFoundException;
import com.example.ims.global.external.storage.SupabaseStorageClient;
import com.example.ims.global.properties.StorageProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {

    private final StorageProperties props;
    private final ObjectProvider<SupabaseStorageClient> supabaseClientProvider;

    /**
     * @return DB에 저장할 로컬 경로 또는 Supabase 객체 키. 파일이 없으면 null.
     */
    public String saveAttachment(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;

        String original = Objects.toString(file.getOriginalFilename(), "");
        String savedName = UUID.randomUUID() + extractSafeExt(original);

        if (props.usesSupabase()) {
            String objectKey = "notices/" + savedName;
            supabaseClient().upload(
                props.getSupabase().getNoticeAttachmentBucket(),
                objectKey,
                file
            );
            return objectKey;
        }

        Path uploadPath = Path.of(props.getUploadDir()).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);
        Path savePath = uploadPath.resolve(savedName).normalize();

        if (!savePath.startsWith(uploadPath)) {
            throw new IllegalArgumentException("유효하지 않은 파일경로입니다.");
        }

        try (InputStream in = file.getInputStream()) {
            Files.copy(in, savePath, StandardCopyOption.REPLACE_EXISTING);
        }

        return "/uploads/" + savedName;
    }

    private String extractSafeExt(String filename) {
        int dot = filename.lastIndexOf(".");
        if (dot < 0) return "";

        String extension = filename.substring(dot).toLowerCase();
        return extension.matches("\\.[a-z0-9]{1,10}") ? extension : "";
    }

    public FileDownloader downloadFile(String dbPath) throws IOException {
        if (dbPath == null) throw new FileNotFoundException();

        if (dbPath.startsWith("/uploads/")) {
            return downloadLocalFile(dbPath);
        }

        if (!props.usesSupabase() || !dbPath.startsWith("notices/")) {
            throw new FileNotFoundException();
        }

        String downloadName = fileName(dbPath);
        return FileDownloader.redirect(
            downloadName,
            supabaseClient().createSignedDownloadUrl(
                props.getSupabase().getNoticeAttachmentBucket(),
                dbPath,
                downloadName,
                props.getSupabase().getSignedUrlTtlSeconds()
            )
        );
    }

    public void deleteAttachments(List<String> dbPaths) throws IOException {
        List<String> remoteKeys = new ArrayList<>();
        for (String dbPath : dbPaths) {
            if (dbPath == null) continue;
            if (dbPath.startsWith("/uploads/")) {
                deleteLocalFile(dbPath);
            } else if (dbPath.startsWith("notices/")) {
                remoteKeys.add(dbPath);
            }
        }

        if (!remoteKeys.isEmpty() && props.usesSupabase()) {
            supabaseClient().delete(
                props.getSupabase().getNoticeAttachmentBucket(),
                remoteKeys
            );
        }
    }

    private FileDownloader downloadLocalFile(String dbPath) throws IOException {
        String downloadName = fileName(dbPath);
        Path filePath = resolveLocalPath(downloadName);

        Resource resource = new UrlResource(filePath.toUri());
        if (!resource.exists() || !resource.isReadable()) {
            throw new FileNotFoundException();
        }

        return FileDownloader.local(downloadName, resource);
    }

    private void deleteLocalFile(String dbPath) throws IOException {
        Files.deleteIfExists(resolveLocalPath(fileName(dbPath)));
    }

    private Path resolveLocalPath(String downloadName) {
        Path uploadDir = Path.of(props.getUploadDir()).toAbsolutePath().normalize();
        Path filePath = uploadDir.resolve(downloadName).normalize();

        if (!filePath.startsWith(uploadDir)) throw new FileNotFoundException();
        return filePath;
    }

    private String fileName(String dbPath) {
        if (dbPath.contains("..") || dbPath.contains("\\")) {
            throw new FileNotFoundException();
        }
        int slash = dbPath.lastIndexOf('/');
        String result = slash >= 0 ? dbPath.substring(slash + 1) : dbPath;
        if (result.isBlank()) throw new FileNotFoundException();
        return result;
    }

    private SupabaseStorageClient supabaseClient() {
        SupabaseStorageClient client = supabaseClientProvider.getIfAvailable();
        if (client == null) {
            throw new IllegalStateException("Supabase Storage 클라이언트가 활성화되지 않았습니다.");
        }
        return client;
    }
}
