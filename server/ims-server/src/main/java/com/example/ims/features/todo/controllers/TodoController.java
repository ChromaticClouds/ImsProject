package com.example.ims.features.todo.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ims.global.response.ApiResponse;

@RestController
@RequestMapping("/todo")
public class TodoController {
    
    @PreAuthorize("hasAuthority('PERM_ALL')")
    @GetMapping
    public ResponseEntity<ApiResponse<Void>> getTodo() {
        return ResponseEntity.ok(ApiResponse.success("Authorization successfully"));
    }
}
