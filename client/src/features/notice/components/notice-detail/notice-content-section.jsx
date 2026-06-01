// @ts-check

/**
 * @typedef {object} NoticeContentSectionProps
 * @property {string} content
 */

/**
 * @param {NoticeContentSectionProps} props
 */
export const NoticeContentSection = ({ content }) => (
  <section className='min-h-48'>
    <h2 className='sr-only'>공지 내용</h2>
    <div className='whitespace-pre-wrap text-sm leading-7'>{content}</div>
  </section>
);
