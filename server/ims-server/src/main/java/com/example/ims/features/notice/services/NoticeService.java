package com.example.ims.features.notice.services;

import com.example.ims.features.notice.dto.*;
import com.example.ims.features.notice.entity.Notice;
import com.example.ims.features.notice.entity.NoticeUser;
import com.example.ims.features.notice.repository.NoticeRepository;
import com.example.ims.features.notice.repository.NoticeUserRepository;
import com.example.ims.features.user.repositories.UserRepository;   // user
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class NoticeService {

    // 중요 공지 3개 제한
    private static final int PINNED_LIMIT = 3;

    // 목록에서 "중요 3 + 일반 10"
    private static final int NORMAL_SIZE = 10;

    private final NoticeRepository noticeRepository;
    private final UserRepository userRepository;
    private final NoticeUserRepository noticeUserRepository;
    
    public NoticeService(NoticeRepository noticeRepository, UserRepository userRepository, NoticeUserRepository noticeUserRepository) {
        this.noticeRepository = noticeRepository;
        this.userRepository = userRepository;
        this.noticeUserRepository = noticeUserRepository;
    }

    //  목록: 핀 3개 + 일반 10개
    public NoticeListResponse getList(int page) {
        int safePage = Math.max(page, 1); // 1부터 받는다고 가정
        var pageable = PageRequest.of(
                safePage - 1,
                NORMAL_SIZE,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        List<NoticeResponse> pinned = noticeRepository
            .findTop3ByPinnedTrueOrderByCreatedAtDesc()
            .stream().map(NoticeResponse::from).toList();

        var normalPage = noticeRepository.findByPinnedFalseOrderByCreatedAtDesc(pageable);

        List<NoticeResponse> items = normalPage.getContent()
                .stream().map(NoticeResponse::from).toList();

        return new NoticeListResponse(
            pinned,
            items,
            safePage,
            normalPage.getTotalPages(),
            normalPage.getTotalElements()
        );
    }

    public NoticeResponse getNotice(Long id) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다"));
        return NoticeResponse.from(notice);
    }

    //  등록 (FIRST_ADMIN + 필수입력 + 핀3 제한)
    @Transactional
    public NoticeActionResponse create(Long loginUserId, NoticeCreateRequest req, String storedFileName) {
        assertFirstAdmin(loginUserId);

        NoticeUser user = noticeUserRepository.findById(loginUserId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        
        List<Notice> pinned = noticeRepository
            .findTop3ByPinnedTrueOrderByCreatedAtDesc();

        System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>> 핀 개수: " + pinned.size());

        String title = (req.getTitle() == null) ? "" : req.getTitle().trim();
        String content = (req.getContent() == null) ? "" : req.getContent().trim();
        if (title.isBlank() || content.isBlank()) {
            return new NoticeActionResponse(false, "미입력되었습니다", null);
        }

        if (req.isPinned()) {
            long pinnedCount = noticeRepository.countByPinnedTrue();
            if (pinnedCount >= PINNED_LIMIT) {
                return new NoticeActionResponse(false, "중요 게시글의 개수가 초과되었습니다", null);
            }
        }

        Notice notice = new Notice(
                user,             // 변경된 부분
                title,
                content,
                req.isPinned(),
                LocalDate.now(),
                storedFileName
        );

        Notice saved = noticeRepository.save(notice);
        return new NoticeActionResponse(true, "등록되었습니다", NoticeResponse.from(saved));
    }

    //  수정 (핀3 제한은 “현재 글이 pinned인지” 고려)
    @Transactional
    public NoticeActionResponse update(Long loginUserId, Long noticeId, NoticeUpdateRequest req, String storedFileNameOrNull) {
        assertFirstAdmin(loginUserId);

        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다"));

        String title = (req.title() == null) ? "" : req.title().trim();
        String content = (req.content() == null) ? "" : req.content().trim();
        if (title.isBlank() || content.isBlank()) {
            return new NoticeActionResponse(false, "미입력되었습니다", null);
        }

        boolean willPinned = req.pinned();

        if (willPinned) {
            long pinnedCount = noticeRepository.countByPinnedTrue();
            boolean isCurrentlyPinned = notice.isPinned();
            long nextPinnedCount = isCurrentlyPinned ? pinnedCount : pinnedCount + 1;

            if (nextPinnedCount > PINNED_LIMIT) {
                return new NoticeActionResponse(false, "중요 게시글의 개수가 초과되었습니다", null);
            }
        }

        String nextFile = (storedFileNameOrNull != null) ? storedFileNameOrNull : notice.getFileName();
        notice.update(title, content, willPinned, nextFile);

        return new NoticeActionResponse(true, "수정되었습니다", NoticeResponse.from(notice));
    }

    @Transactional
    public NoticeActionResponse delete(Long loginUserId, Long noticeId) {
        assertFirstAdmin(loginUserId);

        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다"));

        noticeRepository.delete(notice);
        return new NoticeActionResponse(true, "삭제 완료 되었습니다.", null);
    }

    private void assertFirstAdmin(Long userId) {
        String rank = String.valueOf(userRepository.findById(userId)
                .map(u -> u.getUserRank())
                .orElseThrow(() -> new IllegalArgumentException("유저가 없습니다")));

        if (!"FIRST_ADMIN".equals(rank)) {
            throw new SecurityException("FIRST_ADMIN만 가능합니다.");
        }
    }
}
