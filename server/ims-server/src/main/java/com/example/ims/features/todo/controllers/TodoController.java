package com.example.ims.features.todo.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ims.features.todo.entities.TodoActionResponse;
import com.example.ims.features.todo.entities.TodoRequest;
import com.example.ims.features.todo.entities.TodoResponse;
import com.example.ims.features.todo.service.TodoService;
import com.example.ims.global.response.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/todo")
@RequiredArgsConstructor
public class TodoController {
	private final TodoService todoService;
	
    @PreAuthorize("hasAuthority('PERM_ALL')")
    @GetMapping
    public ResponseEntity<ApiResponse<Void>> getTodo() {
        return ResponseEntity.ok(ApiResponse.success("Authorization successfully"));
    }
    
 // 1. 전체 목록 조회 (fetchTodos)
    @GetMapping("/list")
    public List<TodoResponse> getList() {
        return todoService.getTodoList();
    }

    // 2. 단건 조회 (fetchTodoById)
    @GetMapping("/{id}")
    public ResponseEntity<TodoResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(todoService.getTodoById(id));
    }

    // 3. 상태 토글 (toggleTodoStatus)
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<TodoActionResponse> toggleStatus(@PathVariable Long id) {
        return ResponseEntity.ok(todoService.toggleStatus(id));
    }

    // 4. 업무 수정 (updateTodo)
    @PutMapping("/{id}")
    public ResponseEntity<TodoActionResponse> update(@PathVariable Long id, @RequestBody TodoRequest req) {
        return ResponseEntity.ok(todoService.updateTodo(id, req));
    }

    // 5. 업무 삭제 (deleteTodo)
    @DeleteMapping("/{id}")
    public ResponseEntity<TodoActionResponse> delete(@PathVariable Long id) {
        return ResponseEntity.ok(todoService.deleteTodo(id));
    }
}
