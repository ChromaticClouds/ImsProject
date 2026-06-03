export type NoticeItem = {
  id: number;
  title: string;
  date: string;
  isPinned: boolean;
  hasAttachment: boolean;
};

export type NoticeWidgetProps = {
  maxVisible?: number;
  onViewList?: () => void;
  onClickItem?: (id: NoticeItem['id']) => void;
  onViewAll?: () => void;
};
