import { useQuery } from '@tanstack/react-query';
import { fetchNoticessssss } from '../api/noticeApi';

export const NoticeList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['notices'],
    queryFn: fetchNotices,
  });

  if (isLoading) return <div>불러오는 중...</div>;
  if (error) return <div>에러 발생</div>;

  return (
    <ul>
      {data.map((notice) => (
        <li key={notice.id}>
          <h3>
            {notice.title}
            {notice.pinned && <span> 📌</span>}
          </h3>
          <p>{notice.content}</p>
          <small>
            작성일: {notice.created_at} / 작성자: {notice.user_id}
          </small>
        </li>
      ))}
    </ul>
  );
};
