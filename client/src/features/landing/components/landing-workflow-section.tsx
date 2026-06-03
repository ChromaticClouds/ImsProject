import { workflowSteps } from '@/features/landing/landing-data.js';
import { LandingShell } from './landing-shell.js';
import { LandingSectionHeading } from './landing-section-heading.js';

export const LandingWorkflowSection = () => {
  return (
    <section
      id='workflow'
      className='py-16'
    >
      <LandingShell>
        <LandingSectionHeading
          kicker='Workflow'
          title={
            <>
              업무 흐름 중심으로
              <br />
              제품 가치를 설명
            </>
          }
          description='발주, 입고, 출고, 조정, 이력/통계로 이어지는 화면 흐름을 강조해 실제 운영 장면을 선명하게 보여줍니다.'
        />
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
          {workflowSteps.map(([number, title, description]) => (
            <article
              key={number}
              className='min-h-[165px] rounded-3xl border border-white/10 bg-white/[0.07] p-5'
            >
              <span className='text-xs font-black text-violet-200'>
                {number}
              </span>
              <h3 className='mt-7 text-lg font-black text-white'>{title}</h3>
              <p className='mt-2 text-sm leading-6 text-slate-300'>
                {description}
              </p>
            </article>
          ))}
        </div>
      </LandingShell>
    </section>
  );
};
