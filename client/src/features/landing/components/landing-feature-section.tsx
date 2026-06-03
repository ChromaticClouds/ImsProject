import { featureCards } from '@/features/landing/landing-data.js';
import { LandingShell } from './landing-shell.js';
import { LandingSectionHeading } from './landing-section-heading.js';

export const LandingFeatureSection = () => {
  return (
    <section
      id='features'
      className='py-16'
    >
      <LandingShell>
        <LandingSectionHeading
          kicker='Core Modules'
          title={
            <>
              IMS 운영에 필요한
              <br />
              핵심 기능을 한곳에
            </>
          }
          description='방문자에게 기능 목록을 나열하는 데서 멈추지 않고, 실제 화면들이 재고 업무 흐름 안에서 어떻게 연결되는지 보여줍니다.'
        />
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {featureCards.map(({ title, description, icon: Icon, wide }) => (
            <article
              key={title}
              className={`min-h-[190px] rounded-3xl border border-white/10 bg-white/[0.07] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)] ${
                wide ? 'lg:col-span-2' : ''
              }`}
            >
              <div className='mb-5 grid size-11 place-items-center rounded-2xl border border-violet-200/20 bg-violet-500/20 text-violet-100'>
                <Icon className='size-5' />
              </div>
              <h3 className='text-lg font-black text-white'>{title}</h3>
              <p className='mt-3 text-sm leading-7 text-slate-300'>
                {description}
              </p>
            </article>
          ))}
        </div>
      </LandingShell>
    </section>
  );
};
