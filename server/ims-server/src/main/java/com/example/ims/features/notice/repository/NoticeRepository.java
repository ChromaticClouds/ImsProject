package com.example.ims.features.notice.repository;

import com.example.ims.features.notice.entity.Notice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

    // 핀 3개(최신순)
    List<Notice> findTop3ByPinnedTrueOrderByCreatedAtDesc();

    // 일반 공지 10개 페이지(최신순)
    Page<Notice> findByPinnedFalseOrderByCreatedAtDesc(Pageable pageable);

    // 핀 개수 제한 체크
    long countByPinnedTrue();
}
