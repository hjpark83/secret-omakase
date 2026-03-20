export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">문의하기</h1>
        <p className="text-gray-600 dark:text-gray-400">
          궁금한 점이나 제안사항이 있으시면 언제든 연락주세요
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-dark-card rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700">
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    이름
                  </label>
                  <input
                    type="text"
                    placeholder="이름을 입력해주세요"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    이메일
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  문의 유형
                </label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none">
                  <option>일반 문의</option>
                  <option>모임 관련</option>
                  <option>식당 추천 제안</option>
                  <option>버그 제보</option>
                  <option>기타</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  제목
                </label>
                <input
                  type="text"
                  placeholder="문의 제목을 입력해주세요"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  내용
                </label>
                <textarea
                  rows={6}
                  placeholder="문의 내용을 자세히 적어주세요"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3.5 text-base font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-colors"
              >
                문의 보내기
              </button>
            </form>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">연락처 정보</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">📧</span>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">이메일</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">contact@secretgourmet.kr</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">💬</span>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">카카오톡</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">@비밀미식회</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">📱</span>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">인스타그램</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">@secret_gourmet</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">운영 시간</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">평일</span>
                <span className="text-gray-900 dark:text-white font-medium">10:00 - 18:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">주말/공휴일</span>
                <span className="text-gray-900 dark:text-white font-medium">휴무</span>
              </div>
            </div>
          </div>

          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-300 mb-2">
              자주 묻는 질문
            </h3>
            <p className="text-sm text-primary-700 dark:text-primary-400 mb-3">
              문의하기 전에 FAQ를 확인해보세요. 빠르게 답을 찾을 수 있습니다.
            </p>
            <button className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
              FAQ 보러가기 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
