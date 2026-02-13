package com.example.ims.features.todo.entities;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record TodoResponse(
	    Long id,
	    String userName,
	    String title,
	    String description,
	    LocalDateTime createdAt,
	    LocalDate startDate,
	    LocalDate endDate,
	    String tags,
	    String status
	) {
	    public static TodoResponse from(Todo t) {
	        return new TodoResponse(
	            t.getId(),
	            t.getUser().getName(),
	            t.getTitle(),
	            t.getDescription(),
	            t.getCreatedAt(),
	            t.getStartDate(),
	            t.getEndDate(),
	            t.getTags(),
	            t.getStatus().name()
	        );
	    }
	}