package com.example.ims.features.todo.entities;

import java.time.LocalDate;
import java.util.List;

public record TodoRequest(
	    String title,
	    String description,
	    LocalDate startDate,
	    LocalDate endDate,
	    List<String> tags, // 리액트의 tages(오타 포함)를 tags로 정정해서 받음
	    String status      // 선택 사항
	) {}
