import { useState } from 'react';
import { toast } from 'sonner';

const MAX_TAGS = 3;
const MAX_LENGTH = 10;

export const useTodoTags = () => {
  const [tags, setTags] = useState([]);
  const [input, setInput] = useState('');

  const addTag = () => {
    const value = input.trim();

    if (!value) return;
    if (value.length > MAX_LENGTH) {
      toast.warning('태그는 10자 이하만 가능합니다.');
      return;
    }
    if (tags.length >= MAX_TAGS) {
      toast.warning('태그는 최대 3개까지 등록 가능합니다.');
      return;
    }
    if (tags.includes(value)) {
      toast.warning('이미 등록된 태그입니다.');
      return;
    }

    setTags((prev) => [...prev, value]);
    setInput('');
  };

  const removeTag = (tag) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  return {
    tags,
    input,
    setInput,
    addTag,
    removeTag,
    setTags,
  };
};
