const articles: { id: number; category: string; title: string; excerpt: string; author: string; date: string; readTime: string; icon: string }[] = [];

const categories = ["전체", "와인", "식재료", "요리 기법", "문화", "커피", "건강"];

export default function KnowledgePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">미식 지식</h1>
        <p className="text-gray-600 dark:text-gray-400">
          미식에 관한 깊이 있는 지식과 정보를 탐색하세요
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              cat === "전체"
                ? "bg-primary-500 text-white"
                : "bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-accent"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {articles.length === 0 && (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <span className="text-5xl block mb-4">📚</span>
          <p className="text-sm">아직 등록된 지식 콘텐츠가 없습니다</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <article
            key={article.id}
            className="card-hover bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 cursor-pointer"
          >
            <div className="h-40 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-dark-accent dark:to-dark-bg flex items-center justify-center">
              <span className="text-5xl">{article.icon}</span>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded">
                  {article.category}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {article.readTime} 읽기
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {article.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-3">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                <span className="text-xs text-gray-500 dark:text-gray-400">{article.author}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{article.date}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
