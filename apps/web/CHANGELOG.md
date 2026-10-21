# Changelog

## [0.2.0](https://github.com/iftype/who-tech-frontend/compare/web-v0.1.0...web-v0.2.0) (2026-10-21)


### 기능

* **web:** 피드 다음 페이지 실패를 받은 글 아래에서 다시 시도, 로딩·빈 글 문구 통일 ([#130](https://github.com/iftype/who-tech-frontend/issues/130)) ([655b570](https://github.com/iftype/who-tech-frontend/commit/655b570931023cf996c87ce344ee60e54323925e))
* **web:** 홈(/)에서 피드 메뉴를 활성으로 표시 ([#132](https://github.com/iftype/who-tech-frontend/issues/132)) ([16f117a](https://github.com/iftype/who-tech-frontend/commit/16f117a3608849ec3d2e3f4bd2738a3bcd65420c))


### 리팩토링

* **web:** 트랙 센티널 통일 — 기수 화면도 Track | null (URL은 그대로) ([#134](https://github.com/iftype/who-tech-frontend/issues/134)) ([e23d7e1](https://github.com/iftype/who-tech-frontend/commit/e23d7e166c808031b06166feb3be3bb0b4f39b6f))

## [0.1.0](https://github.com/iftype/who-tech-frontend/compare/web-v0.0.6...web-v0.1.0) (2026-10-21)


### 기능

* **web:** 요청 실패를 빈 상태가 아니라 실패로 보여 주고 다시 시도 ([#126](https://github.com/iftype/who-tech-frontend/issues/126)) ([dd26d78](https://github.com/iftype/who-tech-frontend/commit/dd26d788a8e56139222b6824f0bf0082b7b83772))


### 리팩토링

* **web:** 데이터 경계 — 피드 작성자 roles·tracks 정규화, 기수 목록 서버 캐시 ([#127](https://github.com/iftype/who-tech-frontend/issues/127)) ([b8b317a](https://github.com/iftype/who-tech-frontend/commit/b8b317ab4c9ef95c819401d51101151ad8d5bf13))

## [0.0.6](https://github.com/iftype/who-tech-frontend/compare/web-v0.0.5...web-v0.0.6) (2026-10-21)


### 버그 수정

* **web:** 프로필 새로고침 실패 문구가 보이게 한다 ([#101](https://github.com/iftype/who-tech-frontend/issues/101)) ([47751fe](https://github.com/iftype/who-tech-frontend/commit/47751fe1ecf5c95ed279e932f94c88c3fd090b21))
* **web:** 피드 기수 탭 글 누락, 설정 탭 SSR, 가이드 &lt;p&gt; 안 블록 요소 ([#120](https://github.com/iftype/who-tech-frontend/issues/120)) ([559b0d5](https://github.com/iftype/who-tech-frontend/commit/559b0d5b65c3b090392f5c6d16fc130e88d84e6d))


### 리팩토링

* **web:** className 탈출구 정리 — Avatar 크기 한 가지, 검색창·메뉴 링크 배치를 variant로 ([#124](https://github.com/iftype/who-tech-frontend/issues/124)) ([31a9626](https://github.com/iftype/who-tech-frontend/commit/31a962682772326d96d0d22709fef69447806664))
* **web:** Navbar·PatchToast — effect 대신 파생 상태, WebView 계약은 테스트로 ([#117](https://github.com/iftype/who-tech-frontend/issues/117)) ([e42429e](https://github.com/iftype/who-tech-frontend/commit/e42429efce1e62cdba93f3ca04f1a63a5f2e73c0))
* **web:** URL 상태를 외부 저장소 하나로 (useSyncExternalStore) ([#98](https://github.com/iftype/who-tech-frontend/issues/98)) ([0d36443](https://github.com/iftype/who-tech-frontend/commit/0d364439f3edb398fc5abe683b2562a8e6f05658))
* **web:** URL 파서 통일, 마지막 useState 탭 복사 2곳 제거 ([#109](https://github.com/iftype/who-tech-frontend/issues/109)) ([9d7fe4b](https://github.com/iftype/who-tech-frontend/commit/9d7fe4bbc45647acb3d202437eb61e13d3ce693c))
* **web:** URL 훅·파서 모양 통일 — *Location.ts의 parse*/build*, 객체 인자, useSettingsTab ([#122](https://github.com/iftype/who-tech-frontend/issues/122)) ([cf8cb09](https://github.com/iftype/who-tech-frontend/commit/cf8cb09a954313f84ba9ce0a336a5b087c8fb2f9))
* **web:** widgets/profile-tabs → widgets/member-profile 로 이동 (이동만) ([#112](https://github.com/iftype/who-tech-frontend/issues/112)) ([3722df9](https://github.com/iftype/who-tech-frontend/commit/3722df99265e16431c3b263358f23bcf214eba0f))
* **web:** 공용 원시 컴포넌트·엔티티 UI 합성 ([#111](https://github.com/iftype/who-tech-frontend/issues/111)) ([49b66df](https://github.com/iftype/who-tech-frontend/commit/49b66dfa0c3cd86ec1f68d6d843ab08532f80111))
* **web:** 도메인 규칙을 엔티티로 — 역할 그룹·배지 선택·트랙 색·출처·경로 ([#121](https://github.com/iftype/who-tech-frontend/issues/121)) ([920a01c](https://github.com/iftype/who-tech-frontend/commit/920a01c0f8e2991d4cbbf871a1883f6dc60c6ee0))
* **web:** 도메인 사실을 entities로 (라벨·역할·링크·상수) ([#108](https://github.com/iftype/who-tech-frontend/issues/108)) ([291b4e7](https://github.com/iftype/who-tech-frontend/commit/291b4e7bde4cad71dcac3e6404c115d7f0454edc))
* **web:** 렌더링 경계 정리 (정적 설정 탭은 서버 슬롯, 죽은 revalidate 제거, error 경계) ([#102](https://github.com/iftype/who-tech-frontend/issues/102)) ([4d1e8f5](https://github.com/iftype/who-tech-frontend/commit/4d1e8f5e7d3a1281fab41e6536c4a25fd4bd7a7b))
* **web:** 링크 모양을 shared/ui linkVariants로, 토큰 린트가 a·Link도 검사 ([#123](https://github.com/iftype/who-tech-frontend/issues/123)) ([b995ef2](https://github.com/iftype/who-tech-frontend/commit/b995ef28c020e4686dffcbf389099e800fc87b56))
* **web:** 멤버 검색 — 불리언 2개를 variant 하나로, 훅 분해 ([#115](https://github.com/iftype/who-tech-frontend/issues/115)) ([f52bc90](https://github.com/iftype/who-tech-frontend/commit/f52bc90de17528b274286235edeff7859e826b8f))
* **web:** 멤버 상세 하이드레이션, 새로고침은 useMutation + 카운트다운 외부 저장소 ([#100](https://github.com/iftype/who-tech-frontend/issues/100)) ([39f4164](https://github.com/iftype/who-tech-frontend/commit/39f4164ea1379a18c78e41e7a827231ff7e99662))
* **web:** 멤버 프로필 위젯 — MemberDetailClient 123줄을 세 조각으로 ([#113](https://github.com/iftype/who-tech-frontend/issues/113)) ([16e45f6](https://github.com/iftype/who-tech-frontend/commit/16e45f6496e688e8794cda33ee0069324b827e24))
* **web:** 서버 prefetch + HydrationBoundary로 첫 데이터를 넘긴다 (피드·기수) ([#99](https://github.com/iftype/who-tech-frontend/issues/99)) ([fbe291b](https://github.com/iftype/who-tech-frontend/commit/fbe291b855029b5d3ccb9439ff371f45752d984e))
* **web:** 접근성 (검색 combobox, 탭 role, 메뉴는 진짜 링크, 단축키 한 곳) ([#103](https://github.com/iftype/who-tech-frontend/issues/103)) ([372a3b0](https://github.com/iftype/who-tech-frontend/commit/372a3b0bfa2746ff4f0e950104bbd8ce548680ed))
* **web:** 죽은 코드 정리, URL 값은 단언 대신 파싱, noUncheckedIndexedAccess ([#96](https://github.com/iftype/who-tech-frontend/issues/96)) ([9891eb6](https://github.com/iftype/who-tech-frontend/commit/9891eb68a7546496be5afa75caae3889fc5f2316))
* **web:** 쿼리 레이어 — 키 네임스페이스, 팩토리 전부, http 경계 ([#107](https://github.com/iftype/who-tech-frontend/issues/107)) ([97e6620](https://github.com/iftype/who-tech-frontend/commit/97e66201c755d7dd171c17806357beb54efc89e9))
* **web:** 페이지는 파싱·prefetch·하이드레이션만, 쓰레기 URL·5xx 처리 ([#110](https://github.com/iftype/who-tech-frontend/issues/110)) ([f56eda7](https://github.com/iftype/who-tech-frontend/commit/f56eda7f3e1fe12fed139daeb44a0af26af56af2))

## [0.0.5](https://github.com/iftype/who-tech-frontend/compare/web-v0.0.4...web-v0.0.5) (2026-10-19)


### 버그 수정

* **web:** 인접 기수 미리 받기를 무한 쿼리 모양으로 맞춘다 ([#94](https://github.com/iftype/who-tech-frontend/issues/94)) ([834234d](https://github.com/iftype/who-tech-frontend/commit/834234de85e86f9a91c0664fdcf9c5278ae7f667))

## [0.0.4](https://github.com/iftype/who-tech-frontend/compare/web-v0.0.3...web-v0.0.4) (2026-10-19)


### 리팩토링

* **web:** 계층 구조 완성 — 폴더 이동, 큰 컴포넌트 분리, 의존 규칙 강제 ([#88](https://github.com/iftype/who-tech-frontend/issues/88)) ([b269593](https://github.com/iftype/who-tech-frontend/commit/b269593e8cd747f0761f5f2c48ecdeb2db78f9c6))
* **web:** 데이터 계층 정리 — shared/api, member·post 엔티티, 쿼리 키 팩토리 ([#86](https://github.com/iftype/who-tech-frontend/issues/86)) ([02c9f87](https://github.com/iftype/who-tech-frontend/commit/02c9f87ad178f5af3be284accc96a26dbd2ddf66))
* **web:** 디자인 토큰과 공용 UI — 스타일 중복 정리 ([#87](https://github.com/iftype/who-tech-frontend/issues/87)) ([06e1e75](https://github.com/iftype/who-tech-frontend/commit/06e1e7575e604d63ab5c468ac01e0e17e0c7a19a))
* **web:** 버튼 모양을 shared/ui variant로 모으고 직접 지정을 막는다 ([#91](https://github.com/iftype/who-tech-frontend/issues/91)) ([c6f6f3e](https://github.com/iftype/who-tech-frontend/commit/c6f6f3e4e8f7ae0f31560a6de858a74b1f4992f2))
* **web:** 한 파일 안에서 반복되던 단축키·작은 링크·뼈대 클래스를 상수로 ([#92](https://github.com/iftype/who-tech-frontend/issues/92)) ([31f982e](https://github.com/iftype/who-tech-frontend/commit/31f982e78bea798ee04f707977b4cf759a6ec122))

## [0.0.3](https://github.com/iftype/who-tech-frontend/compare/web-v0.0.2...web-v0.0.3) (2026-10-18)


### 리팩토링

* 설정 페이지 탭을 파일별로 분리 ([#80](https://github.com/iftype/who-tech-frontend/issues/80)) ([b077463](https://github.com/iftype/who-tech-frontend/commit/b0774636a3d706c6077cd5a0a86f0a9c66588e1b))

## [0.0.2](https://github.com/iftype/who-tech-frontend/compare/web-v0.0.1...web-v0.0.2) (2026-10-18)


### 버그 수정

* next를 15.5.28로 올려 원격 코드 실행 취약점 패치 ([#64](https://github.com/iftype/who-tech-frontend/issues/64)) ([13b4acd](https://github.com/iftype/who-tech-frontend/commit/13b4acd760279ee11148163287f0199e6e82a933))
* 개발·빌드 전이 의존성 취약점 해소 ([#70](https://github.com/iftype/who-tech-frontend/issues/70)) ([fe90c2a](https://github.com/iftype/who-tech-frontend/commit/fe90c2a8be0544aebfaf14e0b9d8395bdda3cb43))
