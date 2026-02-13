package com.example.ims.features.todo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.ims.features.todo.entities.Todo;
import com.example.ims.features.todo.entities.TodoActionResponse;
import com.example.ims.features.todo.entities.TodoRequest;
import com.example.ims.features.todo.entities.TodoResponse;
import com.example.ims.features.todo.entities.TodoStatus;
import com.example.ims.features.todo.repository.TodoRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TodoService {
	private final TodoRepository todoRepository;

    // 전체 조회
    public List<TodoResponse> getTodoList() {
        return todoRepository.findAllWithUser().stream()
                .map(TodoResponse::from)
                .toList();
    }

    // 단건 조회
    public TodoResponse getTodoById(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("업무가 없습니다."));
        return TodoResponse.from(todo);
    }

    // 상태 토글 로직
    @Transactional
    public TodoActionResponse toggleStatus(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("업무가 없습니다."));
        
        // 리액트의 DONE <-> IN_PROGRESS 로직을 DB ENUM에 맞춤
        TodoStatus newStatus = (todo.getStatus() == TodoStatus.COMPLETE) 
                               ? TodoStatus.IN_ACTIVE : TodoStatus.COMPLETE;
        
        todo.changeStatus(newStatus); // 엔티티 내부에 메서드 작성 권장
        return new TodoActionResponse(true, "상태가 변경되었습니다.");
    }

    // 삭제 로직
    @Transactional
    public TodoActionResponse deleteTodo(Long id) {
        if (!todoRepository.existsById(id)) {
            return new TodoActionResponse(false, "업무가 없습니다.");
        }
        todoRepository.deleteById(id);
        return new TodoActionResponse(true, "삭제 완료");
    }
    
    @Transactional
    public TodoActionResponse updateTodo(Long id, TodoRequest req) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("업무가 없습니다."));

        // 필수 항목 검증 (리액트의 if (!title || !startDate || !endDate) 로직)
        if (req.title() == null || req.title().isBlank() || 
            req.startDate() == null || req.endDate() == null) {
            return new TodoActionResponse(false, "필수 항목이 누락되었습니다.");
        }

        todo.update(req); // 엔티티 수정 (더티 체킹으로 자동 저장)
        
        return new TodoActionResponse(true, "수정되었습니다");
    }
}