import Link from "next/link";

const features = [
  {
    icon: "🔍",
    title: "식당 검색",
    description: "오마카세, 파인다이닝 등 지도에서 식당을 검색하고 추천하세요.",
    href: "/restaurants",
    color: "from-red-400 to-pink-500",
  },
  {
    icon: "⭐",
    title: "맛집 리뷰",
    description: "직접 방문한 식당의 솔직한 리뷰와 평점을 공유하세요.",
    href: "/reviews",
    color: "from-yellow-400 to-orange-500",
  },
  {
    icon: "🗳️",
    title: "투표",
    description: "장소와 날짜를 투표로 정하고, 익명 투표도 가능합니다.",
    href: "/vote",
    color: "from-violet-400 to-purple-500",
  },
  {
    icon: "📅",
    title: "모임 일정",
    description: "미식 모임 일정을 조율하고 함께 맛집 탐방을 떠나세요.",
    href: "/schedule",
    color: "from-green-400 to-teal-500",
  },
];

const stats = [
  { label: "등록된 맛집", value: "48" },
  { label: "총 추천수", value: "171" },
  { label: "회원 수", value: "1" },
  { label: "월간 모임", value: "0" },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              비밀미식회에<br />오신 것을 환영합니다
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              숨겨진 맛집을 발견하고, 미식 경험을 공유하며,<br className="hidden sm:block" />
              함께 특별한 미식 여정을 떠나보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-3.5 text-lg font-semibold bg-white text-orange-600 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
              >
                지금 가입하기
              </Link>
              <Link
                href="/restaurants"
                className="inline-flex items-center justify-center px-8 py-3.5 text-lg font-semibold border-2 border-white/50 text-white rounded-xl hover:bg-white/10 transition-colors"
              >
                식당 검색하기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white dark:bg-dark-bg border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="bg-gray-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              미식가들의 커뮤니티
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              비밀미식회에서 다양한 미식 활동을 즐겨보세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Link key={feature.title} href={feature.href}>
                <div className="card-hover bg-white dark:bg-dark-card rounded-2xl p-6 h-full border border-gray-100 dark:border-gray-700">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-5`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CatchTable Integration Banner */}
      <section className="bg-white dark:bg-dark-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="text-sm font-medium text-white/80 mb-2">예약 연동</div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                캐치테이블로 바로 예약하세요
              </h2>
              <p className="text-white/90 max-w-lg">
                마음에 드는 식당을 발견하셨나요? 캐치테이블 연동으로 간편하게 예약할 수 있습니다.
                별도의 앱 전환 없이 바로 예약을 완료하세요.
              </p>
            </div>
            <a
              href="https://app.catchtable.co.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center px-8 py-3.5 text-lg font-semibold bg-white text-orange-600 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
            >
              캐치테이블 바로가기
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              비밀미식회에 합류하세요
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-xl mx-auto">
              미식을 사랑하는 사람들과 함께 특별한 경험을 나눠보세요
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center px-8 py-3.5 text-lg font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-colors shadow-lg"
            >
              무료로 시작하기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
