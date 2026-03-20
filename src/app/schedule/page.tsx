const schedules: { id: number; title: string; date: string; time: string; location: string; description: string; capacity: number; registered: number; status: "모집중" | "마감"; type: string }[] = [];

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
      {schedules.length > 0 ? (
        <div className="bg-gradient-to-r from-primary-500 to-orange-500 rounded-2xl p-6 mb-8 text-white">
          <div className="text-sm font-medium text-white/80">다음 일정</div>
          <div className="text-2xl font-bold mt-1">등록된 일정이 있습니다</div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-primary-500 to-orange-500 rounded-2xl p-6 mb-8 text-white">
          <div className="text-sm font-medium text-white/80">다음 일정</div>
          <div className="text-2xl font-bold mt-1">아직 예정된 일정이 없습니다</div>
          <div className="text-white/90 mt-1">곧 새로운 모임이 등록될 예정입니다</div>
        </div>
      )}

      {/* Schedule List */}
      {schedules.length === 0 && (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <span className="text-5xl block mb-4">📅</span>
          <p className="text-sm">등록된 일정이 없습니다</p>
        </div>
      )}
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
