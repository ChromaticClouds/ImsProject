package com.example.ims.v1;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ims.global.response.ApiResponse;

@RestController
@RequestMapping("/api/health")
public class ApiHealthCheckController {

    private final JdbcTemplate jdbcTemplate;

    private final DateTimeFormatter FORMATTER 
        = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public ApiHealthCheckController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, String>>> getApiHealth() {
        return ResponseEntity.status(HttpStatus.OK)
            .body(ApiResponse.success(
                "API Connected successfully",
                Map.of(
                    "status", "OK",
                    "version", "1.0.0",
                    "timestamp", FORMATTER.format(LocalDateTime.now())
                )
            )
        );
    }

    @GetMapping("/database")
    public ResponseEntity<ApiResponse<Map<String, String>>> getDatabaseHealth() {
        Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);

        return ResponseEntity.status(HttpStatus.OK)
            .body(ApiResponse.success(
                "Database connected successfully",
                Map.of(
                    "status", result != null && result == 1 ? "OK" : "ERROR",
                    "timestamp", FORMATTER.format(LocalDateTime.now())
                )
            )
        );
    }
}
