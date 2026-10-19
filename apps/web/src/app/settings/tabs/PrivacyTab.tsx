import type { ReactNode } from 'react';

export function PrivacyTab() {
  return (
    <div className="max-w-2xl text-body-sm leading-relaxed text-text-secondary space-y-6">
      <div>
        <h1 className="text-title-xs font-bold text-text mb-1">개인정보처리방침</h1>
        <p className="text-caption text-text-muted">시행일자: 2026년 3월 2일</p>
      </div>

      <div className="border-t border-border pt-6 space-y-6">
        <section>
          <ArticleTitle>제1조 (목적)</ArticleTitle>
          <p>
            who.tech(이하 &apos;서비스&apos;)는 우아한테크코스 교육생(크루) 및 구성원의 공개된 활동 정보를 취합하여 상호
            검색 및 네트워크 형성을 돕기 위해 운영되는 비영리 서비스입니다. 서비스는 정보주체의 개인정보를 소중하게
            생각하며, 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고
            원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
          </p>
        </section>

        <section>
          <ArticleTitle>제2조 (처리하는 개인정보의 항목)</ArticleTitle>
          <p>
            서비스는 다음의 개인정보 항목을 처리하고 있습니다. 수집된 모든 정보는 GitHub 및 YouTube 등 외부 서비스의
            공개 API 및 웹피드를 통해 제공되는 공개 정보에 기반합니다.
          </p>
          <ul className="mt-1.5 list-disc list-inside space-y-1 pl-1">
            <li>GitHub 계정 정보 (GitHub ID, 프로필 이미지, 닉네임, 실명 등 공개 프로필 정보)</li>
            <li>우아한테크코스 활동 정보 (기수, 트랙, 크루/스태프 구분 등의 참여 정보)</li>
            <li>블로그 활동 정보 (RSS 피드를 통해 공개적으로 제공되는 포스트 제목, 발행일, URL)</li>
            <li>테코톡 활동 정보 (YouTube에 공개 업로드된 발표 영상의 제목, 썸네일, URL, 발표자 명)</li>
          </ul>
        </section>

        <section>
          <ArticleTitle>제3조 (개인정보의 처리 및 보유 기간)</ArticleTitle>
          <p>
            서비스는 원칙적으로 서비스 운영 기간 동안 수집된 개인정보를 보유하며, 정보주체가 삭제를 요청하거나 동의를
            철회하는 경우 지체 없이 해당 개인정보를 파기합니다.
          </p>
        </section>

        <section>
          <ArticleTitle>제4조 (개인정보의 제3자 제공)</ArticleTitle>
          <p>
            서비스는 정보주체의 개인정보를 제1조(목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의 없이 제3자에게
            제공하거나 공유하지 않습니다.
          </p>
        </section>

        <section>
          <ArticleTitle>제5조 (정보주체의 권리·의무 및 그 행사방법)</ArticleTitle>
          <p>
            ① 정보주체는 언제든지 서비스에 대해 개인정보 열람, 정정, 삭제, 처리정지 요구 등의 권리를 행사할 수 있습니다.
          </p>
          <p className="mt-1">
            ② 권리 행사는 서비스 내의 프로필 새로고침 기능을 통해 최신 정보로 갱신하거나, 본 서비스의 공식 GitHub
            저장소(https://github.com/iftype/who-tech-course)의 Issue 등록 또는 담당자 이메일을 통해 요청하실 수
            있습니다. 요청을 받은 경우 지체 없이 조치하겠습니다.
          </p>
        </section>

        <section>
          <ArticleTitle>제6조 (개인정보의 파기절차 및 파기방법)</ArticleTitle>
          <p>
            ① 서비스는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당
            개인정보를 파기합니다.
          </p>
          <p className="mt-1">
            ② 파기방법: 데이터베이스에 저장된 레코드를 영구 삭제 처리하여 복구 또는 재생할 수 없도록 파기합니다.
          </p>
        </section>

        <section>
          <ArticleTitle>제7조 (개인정보의 안전성 확보 조치)</ArticleTitle>
          <p>
            서비스는 개인정보의 안전성 확보를 위해 관리자 권한 제어 등 합리적인 수준의 기술적·관리적 보호 조치를 취하고
            있습니다.
          </p>
        </section>

        <section>
          <ArticleTitle>제8조 (개인정보 보호책임자 및 고충처리)</ArticleTitle>
          <p>
            서비스는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및
            피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
          </p>
          <div className="mt-2 rounded-lg bg-surface-alt p-4 text-label border border-border">
            <p>
              <strong>개인정보 보호책임 및 고충처리 담당</strong>
            </p>
            <p className="mt-1">담당 부서/자: who.tech 운영팀</p>
            <p>문의 방법: GitHub 저장소 Issue 등록 (https://github.com/iftype/who-tech-course)</p>
          </div>
        </section>

        <section>
          <ArticleTitle>제9조 (개인정보 처리방침의 변경)</ArticleTitle>
          <p>이 개인정보 처리방침은 2026년 3월 2일부터 적용됩니다.</p>
        </section>
      </div>
    </div>
  );
}

function ArticleTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-body font-semibold text-text mb-1.5">{children}</h2>;
}
