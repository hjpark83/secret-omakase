import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-dark-card border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🍽️</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">비밀미식회</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              숨겨진 맛집을 발견하고, 미식 경험을 공유하며,<br />
              함께 특별한 미식 여정을 떠나보세요.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">바로가기</h3>
            <ul className="space-y-2">
              {[
                { href: "/restaurants", label: "식당 추천" },
                { href: "/reviews", label: "리뷰" },
                { href: "/knowledge", label: "지식" },
                { href: "/schedule", label: "일정" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">지원</h3>
            <ul className="space-y-2">
              {[
                { href: "/notice", label: "공지사항" },
                { href: "/contact", label: "문의하기" },
                { href: "/privacy", label: "개인정보처리방침" },
                { href: "/terms", label: "이용약관" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-sm text-gray-500 dark:text-gray-500">
            &copy; 2026 비밀미식회. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
