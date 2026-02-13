package com.example.ims.features.notice.mapper;

import java.util.List;

import org.apache.ibatis.annotations.*;

import com.example.ims.features.notice.dto.NoticeResponse;

@Mapper
public interface NoticeMapper {

//    @Select("""
//    SELECT notice.*, user.name
//    FROM notice
//    JOIN user on notice.user_id = user.id
//    WHERE #{search} IS NULL OR #{search} = '' OR title LIKE CONCAT('%', #{search}, '%')
//    ORDER BY pinned DESC, created_at DESC
//    LIMIT #{size} OFFSET #{offset}
//    """)
	@Select("""
			<script>
		    SELECT 
		        n.id, 
		        n.user_id AS userId, 
		        u.name AS userName, -- DTO의 필드명과 일치시킴
		        n.title, 
		        n.content, 
		        n.pinned, 
		        n.created_at AS createdAt, 
		        n.file_name AS fileName
		    FROM notice n
		    JOIN user u ON n.user_id = u.id 
		    <where>
		         n.pinned != 1 
			    <if test="search != null and search != ''">
			        AND n.title LIKE CONCAT('%', #{search}, '%') 
			    </if>
			</where>
		    ORDER BY n.pinned DESC, n.id DESC
		    LIMIT #{size} OFFSET #{offset}
		    </script>
		    """)
    List<NoticeResponse> list(
        @Param("size") int size,
        @Param("offset") int offset,
        @Param("search") String search
    );

    /**
     * 중요 태그가 붙은 게시글을 조회
     */
    @Select("""
	    SELECT 
	    n.id, 
	    n.user_id AS userId, 
	    u.name AS userName,     -- 이 부분이 추가되어야 8개가 맞춰집니다.
	    n.title, 
	    n.content, 
	    n.pinned, 
	    n.created_at AS createdAt, 
	    n.file_name AS fileName
	FROM notice n
	JOIN user u ON n.user_id = u.id  -- 작성자 정보를 가져오기 위한 조인
	WHERE n.pinned = 1 
	ORDER BY n.created_at DESC;
    """)
    List<NoticeResponse> findPinnedNotices();

    @Select("""
    SELECT COUNT(*) FROM notice
    """)
    long countNormal();

    @Select("""
        SELECT 
        n.id, 
        n.user_id AS userId, 
        u.name AS userName,     -- 이 부분이 반드시 필요합니다! (8번째 인자)
        n.title, 
        n.content, 
        n.pinned, 
        n.created_at AS createdAt, 
        n.file_name AS fileName 
    FROM notice n
    JOIN user u ON n.user_id = u.id
    WHERE n.id = #{id}
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
    
    @Update("""
            UPDATE notice 
            SET 
            title=#{title}, 
            content=#{content}, 
            pinned=#{pinned}
            WHERE id=#{id}
        """)
    int update(
            @Param("id") Long id,
            @Param("title") String title,
            @Param("content") String content,
            @Param("pinned") boolean pinned
    );
}
