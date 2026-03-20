import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "비밀미식회 - 숨겨진 맛집을 발견하다",
  description: "미식가들의 비밀 커뮤니티. 숨겨진 맛집을 발견하고, 리뷰를 공유하며, 함께 미식 여정을 떠나보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
