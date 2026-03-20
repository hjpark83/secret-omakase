const schedules = [
  {
    id: 1,
    title: "3월 정기모임: 이탈리안 나이트",
    date: "2026-03-28",
    time: "19:00",
    location: "트라토리아 벨라 (성수동)",
    description: "이번 달 정기모임은 성수동 이탈리안 레스토랑에서 진행합니다. 셰프 특별 코스를 즐겨보세요.",
    capacity: 20,
    registered: 14,
    status: "모집중" as const,
    type: "정기모임",
  },
  {
    id: 2,
    title: "와인 테이스팅 클래스",
    date: "2026-04-05",
    time: "15:00",
    location: "와인홀릭 (이태원)",
    description: "프랑스 부르고뉴 지방의 피노누아 5종을 비교 시음합니다. 초보자도 환영합니다.",
    capacity: 12,
    registered: 12,
    status: "마감" as const,
    type: "클래스",
  },
  {
    id: 3,
    title: "숨은 맛집 탐방: 을지로 편",
    date: "2026-04-12",
    time: "18:00",
    location: "을지로3가역 2번 출구 집합",
    description: "을지로의 숨겨진 노포와 핫플레이스를 함께 탐방합니다. 3곳 이상 방문 예정.",
    capacity: 15,
    registered: 8,
    status: "모집중" as const,
    type: "탐방",
  },
  {
    id: 4,
    title: "4월 정기모임: 스시 오마카세",
    date: "2026-04-25",
    time: "19:00",
    location: "스시 오마카세 히든 (강남)",
    description: "4월 정기모임은 회원들의 요청이 가장 많았던 스시 오마카세입니다.",
    capacity: 10,
    registered: 3,
    status: "모집중" as const,
    type: "정기모임",
  },
];

function statusStyle(status: string) {
  switch (status) {
    case "모집중": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "마감": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
}

function typeStyle(type: string) {
  switch (type) {
    case "정기모임": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "클래스": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    case "탐방": return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
    default: return "bg-gray-100 text-gray-700";
  }
}

export default function SchedulePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">일정</h1>
          <p className="text-gray-600 dark:text-gray-400">
            비밀미식회의 다양한 모임과 이벤트에 참여하세요
          </p>
        </div>
      </div>

      {/* Calendar-style header */}
      <div className="bg-gradient-to-r from-primary-500 to-orange-500 rounded-2xl p-6 mb-8 text-white">
        <div className="text-sm font-medium text-white/80">다음 일정</div>
        <div className="text-2xl font-bold mt-1">3월 28일 (토) - 이탈리안 나이트</div>
        <div className="text-white/90 mt-1">트라토리아 벨라 | 19:00</div>
        <div className="mt-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-full bg-white/30 rounded-full h-2">
              <div className="bg-white rounded-full h-2" style={{ width: "70%" }} />
            </div>
            <span className="shrink-0">14/20명</span>
          </div>
        </div>
      </div>

      {/* Schedule List */}
      <div className="space-y-4">
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className="card-hover bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Date badge */}
              <div className="shrink-0 w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex flex-col items-center justify-center">
                <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                  {new Date(schedule.date).toLocaleDateString("ko-KR", { month: "short" })}
                </span>
                <span className="text-xl font-bold text-primary-700 dark:text-primary-300">
                  {new Date(schedule.date).getDate()}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${typeStyle(schedule.type)}`}>
                    {schedule.type}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${statusStyle(schedule.status)}`}>
                    {schedule.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {schedule.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{schedule.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>🕐 {schedule.time}</span>
                  <span>📍 {schedule.location}</span>
                  <span>👥 {schedule.registered}/{schedule.capacity}명</span>
                </div>
              </div>

              {/* Action */}
              <div className="shrink-0 flex items-center">
                {schedule.status === "모집중" ? (
                  <button className="px-5 py-2.5 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-colors">
                    참여하기
                  </button>
                ) : (
                  <button className="px-5 py-2.5 text-sm font-medium text-gray-400 bg-gray-100 dark:bg-dark-bg rounded-xl cursor-not-allowed">
                    마감
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
