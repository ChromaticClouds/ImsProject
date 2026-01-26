/**
 * @typedef {object} LogoProps
 * @property {'default' | 'icon'} [variant]
 * @property {number} [size]
 * @property {string} [className]
 */

export const Logo = ({ variant = 'default', size = 24, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center gap-3 leading-none w-max ${className}`}
      style={{ fontSize: size }}
    >
      <div className="flex justify-center items-center rounded-lg bg-primary size-10">
        <svg
          aria-hidden
          viewBox='0 0 486.92 691.76'
          className='inline-block align-middle'
          width='1em'
          height='1em'
        >
          <path
            fill='#ffffff'
            d='M702.45,419.16h0a123.29,123.29,0,0,0-50.69-30.65l24.94-24.94a123.74,123.74,0,0,0,0-175h0a123.72,123.72,0,0,0-175,0L288,402.27a123.74,123.74,0,0,0,0,175h0a123.11,123.11,0,0,0,50.68,30.66l-24.93,24.94a123.72,123.72,0,0,0,0,175h0a123.74,123.74,0,0,0,175,0l213.7-213.7A123.74,123.74,0,0,0,702.45,419.16Z'
            transform='translate(-251.77 -152.33)'
          />
          <path
            fill='var(--primary)'
            d='M629.14,480.36l-78.83-22.49a14.45,14.45,0,0,1-10.44-15.11L549.94,322.9c1.15-13.64-15.53-21.09-24.92-11.13L354.77,492.24a14.46,14.46,0,0,0,6.55,23.82l78.83,22.49a14.47,14.47,0,0,1,10.44,15.12L440.51,673.53c-1.14,13.63,15.54,21.08,24.93,11.13L635.69,504.19A14.46,14.46,0,0,0,629.14,480.36Z'
            transform='translate(-251.77 -152.33)'
          />
        </svg>
      </div>

      {variant === 'default' && (
        <span className='font-bold text-xl'>IMS PROJECT</span>
      )}
    </span>
  );
};
