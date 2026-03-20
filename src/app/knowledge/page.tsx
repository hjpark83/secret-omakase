const articles = [
  {
    id: 1,
    category: "와인",
    title: "와인 초보를 위한 페어링 가이드",
    excerpt: "레드와인과 화이트와인, 각각 어떤 음식과 잘 어울릴까요? 소믈리에가 알려주는 기본 페어링 법칙을 소개합니다.",
    author: "와인소믈리에",
    date: "2026-03-17",
    readTime: "8분",
    icon: "🍷",
  },
  {
    id: 2,
    category: "식재료",
    title: "제철 식재료 캘린더: 3월 편",
    excerpt: "봄의 시작을 알리는 3월, 가장 맛있는 제철 식재료들을 소개합니다. 달래, 냉이, 꼬막 등 봄나물의 모든 것.",
    author: "미식탐험가",
    date: "2026-03-10",
    readTime: "6분",
    icon: "🌿",
  },
  {
    id: 3,
    category: "요리 기법",
    title: "수비드 조리법의 과학",
    excerpt: "저온 진공 조리법인 수비드의 원리와 가정에서 쉽게 따라할 수 있는 방법을 알아봅니다.",
    author: "셰프의노트",
    date: "2026-03-05",
    readTime: "10분",
    icon: "🔬",
  },
  {
    id: 4,
    category: "문화",
    title: "일본 이자카야 문화의 이해",
    excerpt: "일본 이자카야의 에티켓부터 꼭 맛봐야 할 안주까지. 이자카야를 200% 즐기는 방법을 알려드립니다.",
    author: "도쿄미식가",
    date: "2026-02-28",
    readTime: "7분",
    icon: "🏮",
  },
  {
    id: 5,
    category: "커피",
    title: "스페셜티 커피 입문 가이드",
    excerpt: "원두의 종류부터 추출 방법까지, 스페셜티 커피의 세계로 안내합니다.",
    author: "카페헌터",
    date: "2026-02-20",
    readTime: "9분",
    icon: "☕",
  },
  {
    id: 6,
    category: "건강",
    title: "미식가를 위한 건강한 식습관",
    excerpt: "맛있게 먹으면서도 건강을 챙기는 방법. 영양학 전문가가 알려주는 스마트한 외식 팁.",
    author: "헬시푸디",
    date: "2026-02-15",
    readTime: "5분",
    icon: "💚",
  },
];

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
