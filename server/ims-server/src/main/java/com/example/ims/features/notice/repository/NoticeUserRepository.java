package com.example.ims.features.notice.repository;

import com.example.ims.features.notice.entity.NoticeUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NoticeUserRepository extends JpaRepository<NoticeUser, Long> {
    
    // 사번(eid)으로 사용자를 찾아야 할 경우가 많으므로 미리 추가해둡니다.
    Optional<NoticeUser> findByEid(String eid);
    
    // 이메일로 찾기
    Optional<NoticeUser> findByEmail(String email);
}