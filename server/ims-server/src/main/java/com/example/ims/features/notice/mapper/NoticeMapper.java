package com.example.ims.features.notice.mapper;

import java.util.List;

import org.apache.ibatis.annotations.*;

import com.example.ims.features.notice.dto.NoticeResponse;

@Mapper
public interface NoticeMapper {

    @Select("""
    SELECT *
    FROM notice
    ORDER BY pinned DESC, created_at DESC
    LIMIT #{size} OFFSET #{offset}
    """)
    List<NoticeResponse> list(
        @Param("size") int size,
        @Param("offset") int offset
    );

    /**
     * 중요 태그가 붙은 게시글을 조회
     */
    @Select("""
    SELECT * FROM notice WHERE pinned = 1 ORDER BY created_at DESC;
    """)
    List<NoticeResponse> findPinnedNotices();

    @Select("""
    SELECT COUNT(*) FROM notice
    """)
    long countNormal();

    @Select("""
        SELECT
          id,
          user_id as userId,
          title,
          content,
          pinned,
          created_at as createdAt,
          file_name as fileName
        FROM notice
        WHERE id = #{id}
    """)
    NoticeResponse findById(@Param("id") Long id);


    @Insert("""
        INSERT INTO notice (user_id, title, content, pinned, created_at, file_name)
        VALUES (#{user_id}, #{title}, #{content}, #{pinned}, NOW(), #{file_name})
    """)
    int insert(
            @Param("user_id") Long user_id,
            @Param("title") String title,
            @Param("content") String content,
            @Param("pinned") boolean pinned,
            @Param("file_name") String file_name
    );

    @Delete("""
        DELETE FROM notice
        WHERE id = #{id}
    """)
    int delete(@Param("id") Long id);

    @Update("""
        UPDATE notice
        SET pinned = #{pinned}
        WHERE id = #{id}
    """)
    int updatePinned(@Param("id") Long id, @Param("pinned") boolean pinned);
}
