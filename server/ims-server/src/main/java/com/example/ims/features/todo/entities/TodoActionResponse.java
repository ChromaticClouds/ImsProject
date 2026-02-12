package com.example.ims.features.todo.entities;

public record TodoActionResponse(
	    boolean ok,      // 리액트에서 res.data.ok로 접근
	    String message,  // 리액트에서 res.data.message로 접근
	    Object data      // (선택사항) 추가 데이터를 담고 싶을 때 사용
) {
    // 성공 응답을 위한 간축 생성자 (필요시)
    public TodoActionResponse(boolean ok, String message) {
        this(ok, message, null);
    }
}