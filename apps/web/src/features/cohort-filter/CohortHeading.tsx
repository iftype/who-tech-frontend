// 기수 화면 제목. 필터 바와 로딩 스켈레톤이 같은 조각을 쓴다 (문구가 두 곳에서 어긋나지 않게)
export function CohortHeading({ cohort }: { cohort: number | null }) {
  return (
    <div>
      <h1 className="text-title font-bold tracking-tight text-text sm:text-title-lg">
        {cohort === null ? '전체 크루' : `${cohort}기 크루`}
      </h1>
      <p className="mt-1 text-label text-text-muted">
        우아한테크코스 {cohort === null ? '전체' : `${cohort}기`} 멤버 목록
      </p>
    </div>
  );
}
