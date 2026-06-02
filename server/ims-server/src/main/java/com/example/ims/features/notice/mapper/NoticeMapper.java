package com.example.ims.features.notice.mapper;

import java.util.List;

import org.apache.ibatis.annotations.*;

import com.example.ims.features.notice.dto.NoticeResponse;
import com.example.ims.features.notice.dto.NoticeResponse.NoticeAuthor;
import com.example.ims.features.notice.dto.NoticeResponse.NoticeSummary;

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
                EXISTS (
                    SELECT 1
                    FROM notice_attachment na
                    WHERE na.notice_id = n.id
                ) AS hasAttachment
		    FROM notice n
		    JOIN user u ON n.user_id = u.id 
		    <where>
		         n.pinned != 1 
			    <if test="search != null and search != ''">
			        AND (
			            n.title LIKE CONCAT('%', #{search}, '%')
			            OR u.name LIKE CONCAT('%', #{search}, '%')
			        )
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
    default List<NoticeResponse> findPinnedNotices() {
        return findPinnedNotices(null);
    }

    @Select("""
	    <script>
	    SELECT 
	        n.id, 
	        n.user_id AS userId, 
	        u.name AS userName,
	        n.title, 
	        n.content, 
	        n.pinned, 
	        n.created_at AS createdAt,
            EXISTS (
                SELECT 1
                FROM notice_attachment na
                WHERE na.notice_id = n.id
            ) AS hasAttachment
	    FROM notice n
	    JOIN user u ON n.user_id = u.id
	    <where>
	        n.pinned = 1
	        <if test="search != null and search != ''">
	            AND (
	                n.title LIKE CONCAT('%', #{search}, '%')
	                OR u.name LIKE CONCAT('%', #{search}, '%')
	            )
	        </if>
	    </where>
	    ORDER BY n.created_at DESC
	    </script>
    """)
    List<NoticeResponse> findPinnedNotices(@Param("search") String search);

    @Select("""
    <script>
    SELECT COUNT(*)
    FROM notice n
    JOIN user u ON n.user_id = u.id
    <where>
        n.pinned != 1
        <if test="search != null and search != ''">
            AND (
                n.title LIKE CONCAT('%', #{search}, '%')
                OR u.name LIKE CONCAT('%', #{search}, '%')
            )
        </if>
    </where>
    </script>
    """)
    long countNormal(@Param("search") String search);

    @Select("""
        SELECT 
        n.id, 
        n.user_id AS userId, 
        u.name AS userName,     -- 이 부분이 반드시 필요합니다! (8번째 인자)
        n.title, 
        n.content, 
        n.pinned, 
        n.created_at AS createdAt,
        EXISTS (
            SELECT 1
            FROM notice_attachment na
            WHERE na.notice_id = n.id
        ) AS hasAttachment
    FROM notice n
    JOIN user u ON n.user_id = u.id
    WHERE n.id = #{id}
    """)
    NoticeResponse findById(@Param("id") Long id);

    @Select("""
        SELECT
            u.id,
            u.name,
            u.eid,
            u.email
        FROM notice n
        JOIN user u ON n.user_id = u.id
        WHERE n.id = #{id}
    """)
    NoticeAuthor findAuthorByNoticeId(@Param("id") Long id);

    @Select("""
        SELECT
            id,
            title
        FROM notice
        WHERE id < #{id}
        ORDER BY id DESC
        LIMIT 1
    """)
    NoticeSummary findPreviousNotice(@Param("id") Long id);

    @Select("""
        SELECT
            id,
            title
        FROM notice
        WHERE id > #{id}
        ORDER BY id ASC
        LIMIT 1
    """)
    NoticeSummary findNextNotice(@Param("id") Long id);


    @Insert("""
        INSERT INTO notice (user_id, title, content, pinned, created_at)
        VALUES (#{user_id}, #{title}, #{content}, #{pinned}, NOW())
    """)
    int insert(
            @Param("user_id") Long user_id,
            @Param("title") String title,
            @Param("content") String content,
            @Param("pinned") boolean pinned
    );

    @Select("SELECT LAST_INSERT_ID()")
    Long lastInsertId();

    @Insert("""
        INSERT INTO notice_attachment (notice_id, file_name, sort_order)
        VALUES (#{notice_id}, #{file_name}, #{sort_order})
    """)
    int insertAttachment(
            @Param("notice_id") Long notice_id,
            @Param("file_name") String file_name,
            @Param("sort_order") int sort_order
    );

    @Select("""
        SELECT file_name
        FROM notice_attachment
        WHERE notice_id = #{notice_id}
        ORDER BY sort_order ASC, id ASC
    """)
    List<String> findAttachmentFileNames(@Param("notice_id") Long notice_id);

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
