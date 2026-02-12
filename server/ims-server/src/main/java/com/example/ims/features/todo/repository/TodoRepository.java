package com.example.ims.features.todo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.ims.features.todo.entities.Todo;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    @Query("SELECT t FROM Todo t JOIN FETCH t.user ORDER BY t.createdAt DESC")
    List<Todo> findAllWithUser();
}
