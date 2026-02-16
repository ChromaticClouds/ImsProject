package com.example.ims.features.notice.services;

import com.example.ims.features.notice.dto.FileDownloader;
import com.example.ims.global.properties.StorageProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {

    private final StorageProperties props;

    /**
     * @return DB에 저장할 값 (Ex: "uploads/uuid.png"), 파일이 없으면 NULL 할당
     */
    public String saveToUploads(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;

        Path uploadPath = Path.of(props.getUploadDir()).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        String original = Objects.toString(file.getOriginalFilename(), "");
        String ext = extractSafeExt(original);

        String savedName = UUID.randomUUID() + ext;
        Path savePath = uploadPath.resolve(savedName).normalize();

        if (!savePath.startsWith(uploadPath))
            throw new IllegalArgumentException("유효하지 않은 파일경로입니다.");

        try (InputStream in = file.getInputStream()) {
            Files.copy(in, savePath, StandardCopyOption.REPLACE_EXISTING);
        }

        return "/uploads/" + savedName;
    }

    private String extractSafeExt(String filename) {
        int dot = filename.lastIndexOf(".");
        if (dot < 0) return ""; // 확장자가 없는 파일

        return filename.substring(dot).toLowerCase();
    }

    public FileDownloader downloadFile(String dbPath)
            throws IOException {
        if (dbPath == null || !dbPath.startsWith("/uploads"))
            throw new FileNotFoundException();

        String savedName = dbPath.substring("/uploads/".length());
        Path uploadDir = Path.of(props.getUploadDir()).toAbsolutePath().normalize();
        Path filePath = uploadDir.resolve(savedName).normalize();

        if (!filePath.startsWith(uploadDir))
            throw new FileNotFoundException();

        Resource resource = new UrlResource(filePath.toUri());
        if (!resource.exists() || !resource.isReadable())
            throw new FileNotFoundException();

        String downloadName = savedName;
        String encoded = URLEncoder.encode(downloadName, StandardCharsets.UTF_8)
            .replace("_", "%20");

        return new FileDownloader(downloadName, encoded, resource);
    }
}
