import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { InputGroupInput, InputGroupTextarea } from '@/components/ui/input-group.js';
import { XIcon } from 'lucide-react';

export const EmailInput = () => {
  const [value, setValue] = useState('');
  const [items, setItems] = useState([]);

  /**
   * @param {React.KeyboardEvent<HTMLInputElement>} e
   */
  const onKeyDown = (e) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();

      const trimmed = value.trim();
      if (!trimmed) return;

      setItems((prev) => [...prev, trimmed]);
      setValue('');
    }

    // Backspace로 마지막 badge 제거
    if (e.key === 'Backspace' && value === '' && items.length > 0) {
      setItems((prev) => prev.slice(0, -1));
    }
  };

  /**
   * @param {number} index
   */
  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className='w-full flex flex-col gap-2 p-2'>
      {items.length > 0 && (
        <div className='w-full flex gap-2 p-2 flex-wrap'>
          {items.map((item, idx) => (
            <Badge
              key={idx}
              variant='secondary'
              className='flex items-center gap-1'
            >
              {item}
              <button onClick={() => removeItem(idx)}>
                <XIcon className='h-3 w-3' />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <InputGroupInput
        className='flex-1 border-none shadow-none focus-visible:ring-0'
        id='block-end-textarea'
        placeholder='이메일 입력 후 (,) 혹은 Enter'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}
