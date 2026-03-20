import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl">🍽️</span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">회원가입</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">비밀미식회의 일원이 되어보세요</p>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">닉네임</label>
              <input
                type="text"
                placeholder="사용할 닉네임을 입력하세요"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">이메일</label>
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">비밀번호</label>
              <input
                type="password"
                placeholder="비밀번호 (8자 이상)"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">비밀번호 확인</label>
              <input
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            <button type="submit" className="w-full px-6 py-3.5 text-base font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-colors">
              가입하기
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            이미 회원이신가요?{" "}
            <Link href="/login" className="text-primary-500 hover:text-primary-600 font-medium">로그인</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
