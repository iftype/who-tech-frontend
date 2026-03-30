import type { Metadata } from 'next';

export const metadata: Metadata = { title: '가이드' };

const sections = [
  {
    id: 'search',
    number: 1,
    title: '크루 검색하기',
    description: (
      <>
        홈 화면의 검색창에 닉네임 또는 GitHub ID를 입력하면 실시간으로 크루를 검색할 수 있습니다. 입력 후 300ms의 딜레이
        후 자동으로 검색 결과가 표시됩니다.
        <ul className="mt-3 flex flex-col gap-1.5 list-disc pl-4">
          <li>기수 번호, 역할(크루/코치/리뷰어), 트랙 정보가 드롭다운에 함께 표시됩니다</li>
          <li>크루를 클릭하면 상세 페이지로 이동합니다</li>
          <li>30K 단축키로 언제든 검색창을 열 수 있습니다</li>
        </ul>
      </>
    ),
  },
  {
    id: 'detail',
    number: 2,
    title: '상세 페이지 — 미션 아카이브 & 블로그',
    description: (
      <>
        크루의 전체 미션 PR 이력을 레벨별로 확인하고, &ldquo;Markdown 복사&rdquo; 버튼으로 포트폴리오에 바로 활용할 수
        있습니다. 블로그가 등록된 크루는 최근 글 목록도 함께 볼 수 있습니다.
        <ul className="mt-3 flex flex-col gap-1.5 list-disc pl-4">
          <li>기준 미션 / 공통 미션 / 프리코스 탭으로 구분</li>
          <li>step별 PR 링크 직접 연결</li>
          <li>미제출 항목도 함께 표시</li>
        </ul>
      </>
    ),
  },
  {
    id: 'archive',
    number: 3,
    title: '미션 아카이브',
    description: (
      <>
        미션 아카이브 페이지에서는 기수와 트랙에 관계없이 전체 미션 목록을 한눈에 볼 수 있습니다. 레벨별, 탭별로
        분류되어 있어 원하는 미션을 빠르게 찾을 수 있습니다.
        <ul className="mt-3 flex flex-col gap-1.5 list-disc pl-4">
          <li>base / common / precourse 탭 구분</li>
          <li>트랙 필터 (프론트엔드 / 백엔드 / 안드로이드)</li>
        </ul>
      </>
    ),
  },
  {
    id: 'cohort',
    number: 4,
    title: '기수별 목록',
    description: (
      <>
        기수별로 모든 크루, 코치, 리뷰어를 확인할 수 있습니다. 트랙 필터와 역할 필터를 조합해 원하는 멤버를 빠르게 찾을
        수 있습니다.
        <ul className="mt-3 flex flex-col gap-1.5 list-disc pl-4">
          <li>전체 기수 보기 / 특정 기수 보기 지원</li>
          <li>크루 / 운영진 역할 토글</li>
          <li>트랙 필터 (프론트엔드 / 백엔드 / 안드로이드)</li>
        </ul>
      </>
    ),
  },
  {
    id: 'feed',
    number: 5,
    title: '피드',
    description: (
      <>
        크루들이 최근에 올린 블로그 글을 모아 볼 수 있습니다. 기수 탭과 트랙 필터, 7일/30일 기간 토글로 원하는 범위의
        글을 확인하세요.
        <ul className="mt-3 flex flex-col gap-1.5 list-disc pl-4">
          <li>전체 / 기수별 탭 구분</li>
          <li>7일 / 30일 기간 필터</li>
          <li>트랙 필터 지원</li>
        </ul>
      </>
    ),
  },
  {
    id: 'stats',
    number: 6,
    title: '통계',
    description: (
      <>
        기수별, 트랙별 크루 현황과 미션 제출 통계를 한눈에 볼 수 있습니다. 누가 얼마나 많은 미션을 제출했는지, 어떤
        기수가 활발한지 파악할 수 있습니다.
      </>
    ),
  },
];

const navItems = [
  { id: 'search', label: '크루 검색하기' },
  { id: 'detail', label: '상세 페이지' },
  { id: 'archive', label: '미션 아카이브' },
  { id: 'cohort', label: '기수별 목록' },
  { id: 'feed', label: '피드' },
  { id: 'stats', label: '통계' },
];

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8 sm:py-10">
      <div className="flex gap-12">
        {/* Sidebar */}
        <aside className="hidden lg:block w-[160px] flex-shrink-0">
          <nav className="sticky top-8 flex flex-col gap-0.5">
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-3 px-2">목차</p>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block px-2 py-1.5 rounded text-[13px] text-text-secondary hover:text-text hover:bg-surface-alt transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <h1 className="text-[20px] font-bold text-text mb-1">who.tech 사용 가이드</h1>
          <p className="text-[13px] text-text-muted mb-10">
            우아한테크코스 크루를 검색하고, 미션 이력과 블로그를 탐색하는 방법을 안내합니다.
          </p>

          <div className="flex flex-col gap-16">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="flex flex-col gap-5 scroll-mt-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-accent-bg border border-accent-border text-[13px] font-bold text-accent-dm">
                    {section.number}
                  </span>
                  <h2 className="text-[16px] font-semibold text-text">{section.title}</h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-text-secondary leading-relaxed">{section.description}</p>
                  </div>
                  <div className="sm:w-[240px] flex-shrink-0 h-[140px] rounded-lg border border-border-dim bg-surface flex items-center justify-center">
                    <span className="text-[11px] text-text-dim">스크린샷 준비 중</span>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
