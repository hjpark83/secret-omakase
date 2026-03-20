const notices: { id: number; category: string; title: string; date: string; content: string; pinned: boolean }[] = [];

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
        {notices.length === 0 && (
          <div className="text-center py-16 text-gray-400 dark:text-gray-500">
            <span className="text-5xl block mb-4">📢</span>
            <p className="text-sm">아직 등록된 공지사항이 없습니다</p>
          </div>
        )}
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
