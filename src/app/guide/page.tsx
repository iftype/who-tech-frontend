import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = { title: '가이드' };

const sections = [
  {
    id: 'search',
    number: 1,
    title: '크루 검색하기',
    description: (
      <>
        홈 화면 중앙의 검색창에 <strong className="text-text">닉네임</strong> 또는{' '}
        <strong className="text-text">GitHub ID</strong>를 입력하면 실시간으로 크루를 검색할 수 있습니다.
        <ul className="mt-3 flex flex-col gap-2 list-disc pl-4">
          <li>입력 후 자동으로 드롭다운에 검색 결과가 나타납니다</li>
          <li>기수 번호, 역할(크루/코치/리뷰어), 트랙 정보가 함께 표시됩니다</li>
          <li>결과를 클릭하면 해당 크루의 상세 페이지로 이동합니다</li>
        </ul>
        <div className="mt-3 inline-flex items-center gap-2 rounded-md border border-border-dim bg-surface px-3 py-2 text-[12px] text-text-muted">
          <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[11px]">⌘</kbd>
          <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[11px]">K</kbd>
          <span>단축키로 어디서든 검색창을 열 수 있어요</span>
        </div>
      </>
    ),
  },
  {
    id: 'detail',
    number: 2,
    title: '크루 상세 페이지',
    description: (
      <>
        크루의 <strong className="text-text">미션 PR 이력</strong>과 <strong className="text-text">블로그 글</strong>을
        한 페이지에서 확인할 수 있습니다.
        <ul className="mt-3 flex flex-col gap-2 list-disc pl-4">
          <li>기준 미션 / 공통 미션 / 프리코스 탭으로 구분되어 있어요</li>
          <li>레벨별 PR 링크를 직접 클릭해 제출 내역을 볼 수 있습니다</li>
          <li>미제출 항목도 함께 표시되어 전체 미션 현황을 파악할 수 있어요</li>
          <li>
            <strong className="text-text">Markdown 복사</strong> 버튼으로 포트폴리오용 아카이브 표를 바로 생성할 수
            있습니다
          </li>
          <li>여러 기수를 거친 크루라면 크루로 참여한 기수의 기록만 표시됩니다</li>
        </ul>
      </>
    ),
  },
  {
    id: 'cohort',
    number: 3,
    title: '기수별 크루 목록',
    description: (
      <>
        기수별로 모든 크루, 코치, 리뷰어를 한눈에 볼 수 있습니다.
        <ul className="mt-3 flex flex-col gap-2 list-disc pl-4">
          <li>상단 탭에서 전체 기수 또는 특정 기수를 선택할 수 있어요</li>
          <li>
            <strong className="text-text">크루 / 운영진</strong> 역할 토글로 구분해서 볼 수 있습니다
          </li>
          <li>트랙 필터(프론트엔드 / 백엔드 / 안드로이드)로 원하는 트랙만 볼 수 있어요</li>
          <li>크루 카드를 클릭하면 상세 페이지로 이동합니다</li>
        </ul>
      </>
    ),
  },
  {
    id: 'feed',
    number: 4,
    title: '블로그 피드',
    description: (
      <>
        크루들이 최근에 올린 블로그 글을 모아볼 수 있습니다. 스터디 자료나 회고, 기술 글을 한 곳에서 탐색해보세요.
        <ul className="mt-3 flex flex-col gap-2 list-disc pl-4">
          <li>전체 / 기수별 탭으로 범위를 좁힐 수 있어요</li>
          <li>7일 / 30일 기간 필터로 최신 글과 이달의 글을 구분할 수 있습니다</li>
          <li>트랙 필터로 원하는 트랙 크루의 글만 볼 수 있어요</li>
          <li>닉네임 클릭 시 크루 상세 페이지, 프로필 사진 클릭 시 GitHub으로 이동합니다</li>
          <li>Velog, Tistory, 브런치 등 다양한 플랫폼 블로그를 지원합니다</li>
        </ul>
      </>
    ),
  },
  {
    id: 'blog-register',
    number: 5,
    title: '블로그 등록 방법',
    description: (
      <>
        블로그는 <strong className="text-text">GitHub 프로필</strong>에 등록된 URL을 자동으로 수집합니다. 별도 신청 없이
        GitHub 프로필만 업데이트하면 돼요.
        <ol className="mt-3 flex flex-col gap-2 list-decimal pl-4">
          <li>
            GitHub 프로필 편집 → <strong className="text-text">Website 또는 Bio</strong> 필드에 블로그 URL 입력
          </li>
          <li>다음 수집 주기(매시간)에 자동으로 반영됩니다</li>
        </ol>
        <div className="mt-4 flex flex-col gap-2">
          <div className="rounded-md border border-border-dim bg-surface px-4 py-3 text-[12px] text-text-secondary">
            <strong className="text-text block mb-1">지원 플랫폼</strong>
            Velog, Tistory, GitHub Pages, 브런치, Medium, 개인 블로그 등 RSS를 제공하는 모든 블로그
          </div>
          <div className="rounded-md border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-[12px] text-amber-400">
            <strong className="block mb-1">블로그 글이 안 보인다면?</strong>
            블로그가 RSS를 지원하지 않거나 URL이 잘못 등록된 경우 글이 수집되지 않을 수 있어요. Notion, Instagram,
            LinkedIn 등 RSS가 없는 플랫폼은 지원하지 않습니다.
          </div>
        </div>
      </>
    ),
  },
];

const navItems = [
  { id: 'search', label: '크루 검색하기' },
  { id: 'detail', label: '크루 상세 페이지' },
  { id: 'cohort', label: '기수별 목록' },
  { id: 'feed', label: '블로그 피드' },
  { id: 'blog-register', label: '블로그 등록 방법' },
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
          {/* Intro */}
          <div className="mb-10">
            <h1 className="text-[20px] font-bold text-text mb-2">who.tech 사용 가이드</h1>
            <p className="text-[14px] text-text-secondary leading-relaxed">
              who.tech는 우아한테크코스 크루의 미션 PR 이력과 블로그를 한 곳에서 탐색할 수 있는 서비스예요.
              <br />
              크루를 검색하거나 기수별로 목록을 살펴보고, 블로그 피드로 최신 글을 확인해보세요.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-[12px] text-text-secondary hover:text-text hover:bg-surface-alt transition-colors"
              >
                홈으로 가기 →
              </Link>
              <Link
                href="/cohort"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-[12px] text-text-secondary hover:text-text hover:bg-surface-alt transition-colors"
              >
                기수별 목록 보기 →
              </Link>
              <Link
                href="/feed"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-[12px] text-text-secondary hover:text-text hover:bg-surface-alt transition-colors"
              >
                블로그 피드 보기 →
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-14">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="flex flex-col gap-4 scroll-mt-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-accent-bg border border-accent-border text-[13px] font-bold text-accent-dm">
                    {section.number}
                  </span>
                  <h2 className="text-[16px] font-semibold text-text">{section.title}</h2>
                </div>
                <div className="flex flex-col gap-4">
                  <p className="pl-10 text-[13px] text-text-secondary leading-relaxed">{section.description}</p>
                  {section.id !== 'blog-register' && (
                    <div className="overflow-hidden rounded-xl border border-border-dim shadow-sm">
                      <Image
                        src={`/guide/${section.id}.png`}
                        alt={section.title}
                        width={1280}
                        height={800}
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
