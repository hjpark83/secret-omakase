const notices = [
  {
    id: 1,
    category: "공지",
    title: "비밀미식회 3월 정기모임 안내",
    date: "2026-03-15",
    content: "3월 정기모임은 강남 이탈리안 레스토랑에서 진행됩니다. 자세한 내용은 일정 페이지를 확인해주세요.",
    pinned: true,
  },
  {
    id: 2,
    category: "업데이트",
    title: "캐치테이블 예약 연동 기능 업데이트",
    date: "2026-03-10",
    content: "이제 식당 추천 페이지에서 캐치테이블을 통해 바로 예약할 수 있습니다.",
    pinned: true,
  },
  {
    id: 3,
    category: "공지",
    title: "신규 회원 가입 이벤트 진행 중",
    date: "2026-03-05",
    content: "3월 한 달간 신규 가입 회원에게 첫 모임 참가비 50% 할인 혜택을 드립니다.",
    pinned: false,
  },
  {
    id: 4,
    category: "이벤트",
    title: "2월 베스트 리뷰어 선정 결과",
    date: "2026-02-28",
    content: "2월 한 달간 가장 양질의 리뷰를 작성해주신 분들을 발표합니다.",
    pinned: false,
  },
  {
    id: 5,
    category: "공지",
    title: "커뮤니티 가이드라인 업데이트",
    date: "2026-02-20",
    content: "보다 건전한 커뮤니티 운영을 위해 가이드라인이 일부 수정되었습니다.",
    pinned: false,
  },
];

function categoryColor(cat: string) {
  switch (cat) {
    case "공지": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "업데이트": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "이벤트": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
}

export default function NoticePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">공지사항</h1>
        <p className="text-gray-600 dark:text-gray-400">비밀미식회의 새로운 소식과 공지를 확인하세요</p>
      </div>

      <div className="space-y-4">
        {notices.map((notice) => (
          <article
            key={notice.id}
            className={`card-hover bg-white dark:bg-dark-card rounded-xl p-6 border cursor-pointer ${
              notice.pinned
                ? "border-primary-200 dark:border-primary-800"
                : "border-gray-100 dark:border-gray-700"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {notice.pinned && (
                    <span className="text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 px-2 py-0.5 rounded">
                      📌 고정
                    </span>
                  )}
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${categoryColor(notice.category)}`}>
                    {notice.category}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {notice.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{notice.content}</p>
              </div>
              <time className="text-sm text-gray-500 dark:text-gray-500 shrink-0">{notice.date}</time>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
