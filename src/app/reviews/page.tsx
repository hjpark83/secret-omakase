"use client";

import { useState, useRef } from "react";

interface ReviewImage {
  id: string;
  url: string;
  name: string;
}

interface Review {
  id: number;
  author: string;
  avatar: string;
  restaurant: string;
  category: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  photos: ReviewImage[];
  likes: number;
  comments: number;
}

const initialReviews: Review[] = [];

/* ── Star Rating (display) ── */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`text-sm ${star <= rating ? "text-yellow-500" : "text-gray-300 dark:text-gray-600"}`}>
          ★
        </span>
      ))}
    </div>
  );
}

/* ── Star Rating (interactive) ── */
function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className={`text-2xl transition-colors ${
            star <= (hover || value) ? "text-yellow-500" : "text-gray-300 dark:text-gray-600"
          }`}
        >
          ★
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-500">{value > 0 ? `${value}점` : "별점을 선택하세요"}</span>
    </div>
  );
}

/* ── Photo Gallery (in review card, click to enlarge) ── */
function PhotoGallery({ photos }: { photos: ReviewImage[] }) {
  const [viewingIdx, setViewingIdx] = useState<number | null>(null);

  if (photos.length === 0) return null;

  return (
    <>
      <div className={`grid gap-2 mb-4 ${
        photos.length === 1 ? "grid-cols-1" :
        photos.length === 2 ? "grid-cols-2" :
        "grid-cols-3"
      }`}>
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => setViewingIdx(i)}
            className={`relative rounded-xl overflow-hidden bg-gray-100 dark:bg-dark-bg group ${
              photos.length === 1 ? "h-64" :
              photos.length === 2 ? "h-48" :
              i === 0 && photos.length === 3 ? "h-48 row-span-2" : "h-[calc(6rem-0.25rem)]"
            }`}
          >
            {photo.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs">{photo.name}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {viewingIdx !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setViewingIdx(null)}>
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {photos[viewingIdx].url && (
              <a
                href={photos[viewingIdx].url}
                download={photos[viewingIdx].name}
                onClick={(e) => e.stopPropagation()}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors"
                title="다운로드"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </a>
            )}
            <button onClick={() => setViewingIdx(null)} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Nav arrows */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setViewingIdx((viewingIdx - 1 + photos.length) % photos.length); }}
                className="absolute left-4 text-white/80 hover:text-white"
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setViewingIdx((viewingIdx + 1) % photos.length); }}
                className="absolute right-4 text-white/80 hover:text-white"
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </>
          )}
          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            {photos[viewingIdx].url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photos[viewingIdx].url} alt={photos[viewingIdx].name} className="max-h-[80vh] object-contain rounded-lg" />
            ) : (
              <div className="w-96 h-64 bg-gray-800 rounded-lg flex flex-col items-center justify-center text-gray-400">
                <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{photos[viewingIdx].name}</span>
              </div>
            )}
            <div className="text-white/60 text-sm mt-3">{viewingIdx + 1} / {photos.length}</div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Review Write Modal ── */
const MAX_PHOTOS = 20;

function ReviewWriteModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (review: Review) => void }) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [category, setCategory] = useState("한식");
  const [content, setContent] = useState("");
  const [uploadedPhotos, setUploadedPhotos] = useState<ReviewImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const remaining = MAX_PHOTOS - uploadedPhotos.length;
    const toProcess = fileArray.slice(0, remaining);

    toProcess.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedPhotos((prev) => {
          if (prev.length >= MAX_PHOTOS) return prev;
          return [
            ...prev,
            {
              id: `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`,
              url: ev.target?.result as string,
              name: file.name,
            },
          ];
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removePhoto = (id: string) => {
    setUploadedPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSubmit = () => {
    if (!title || !restaurant || !content || rating === 0) return;
    onSubmit({
      id: Date.now(),
      author: "나",
      avatar: "NA",
      restaurant,
      category,
      rating,
      date: new Date().toISOString().slice(0, 10),
      title,
      content,
      photos: uploadedPhotos,
      likes: 0,
      comments: 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-dark-card rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">리뷰 작성</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">별점 *</label>
            <StarInput value={rating} onChange={setRating} />
          </div>

          {/* Restaurant & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">식당 이름 *</label>
              <input
                type="text"
                value={restaurant}
                onChange={(e) => setRestaurant(e.target.value)}
                placeholder="방문한 식당 이름"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">카테고리</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
              >
                {["한식", "일식", "이탈리안", "프렌치", "중식", "멕시칸", "카페", "기타"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">제목 *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="리뷰 제목을 입력해주세요"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">내용 *</label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="맛, 분위기, 서비스 등 솔직한 후기를 남겨주세요"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm resize-none"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">사진 첨부</label>
              <span className="text-xs text-gray-400">{uploadedPhotos.length} / {MAX_PHOTOS}장</span>
            </div>
            <div className="space-y-3">
              {/* Uploaded photos preview */}
              {uploadedPhotos.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {uploadedPhotos.map((photo, idx) => (
                    <div key={photo.id} className="relative group rounded-xl overflow-hidden aspect-square bg-gray-100 dark:bg-dark-bg">
                      {photo.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-1">{photo.name}</div>
                      )}
                      <button
                        onClick={() => removePhoto(photo.id)}
                        className="absolute top-1 right-1 w-6 h-6 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="absolute top-1 left-1 bg-black/50 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-medium">
                        {idx + 1}
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] px-1.5 py-0.5 truncate">
                        {photo.name}
                      </div>
                    </div>
                  ))}
                  {/* Add more button (inline) */}
                  {uploadedPhotos.length < MAX_PHOTOS && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500 flex flex-col items-center justify-center gap-1 transition-colors group"
                    >
                      <svg className="w-6 h-6 text-gray-400 group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className="text-[10px] text-gray-400 group-hover:text-primary-500 transition-colors">추가</span>
                    </button>
                  )}
                </div>
              )}

              {/* Upload area (shown when no photos yet) */}
              {uploadedPhotos.length === 0 && (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer group ${
                    isDragging
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10"
                      : "border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-600"
                  }`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                    isDragging ? "bg-primary-100 dark:bg-primary-900/30" : "bg-gray-100 dark:bg-dark-bg group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20"
                  }`}>
                    <svg className={`w-7 h-7 transition-colors ${isDragging ? "text-primary-500" : "text-gray-400 group-hover:text-primary-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className={`text-sm font-medium transition-colors ${isDragging ? "text-primary-500" : "text-gray-500 dark:text-gray-400 group-hover:text-primary-500"}`}>
                    {isDragging ? "여기에 놓으세요!" : "클릭하거나 드래그하여 사진을 업로드하세요"}
                  </span>
                  <span className="text-xs text-gray-400">여러 장을 한꺼번에 선택할 수 있어요 (최대 {MAX_PHOTOS}장)</span>
                  <span className="text-xs text-gray-400">JPG, PNG, WEBP (각 10MB 이하)</span>
                </div>
              )}

              {/* Drag overlay when photos already exist */}
              {uploadedPhotos.length > 0 && uploadedPhotos.length < MAX_PHOTOS && (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`w-full border-2 border-dashed rounded-xl p-3 flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    isDragging
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10"
                      : "border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-xs text-gray-400">
                    {isDragging ? "여기에 놓으세요!" : "사진을 더 추가하려면 클릭하거나 드래그하세요"}
                  </span>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between shrink-0">
          <span className="text-xs text-gray-400">
            {uploadedPhotos.length > 0 && `사진 ${uploadedPhotos.length}장 첨부됨`}
          </span>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-bg hover:bg-gray-200 dark:hover:bg-dark-accent rounded-xl transition-colors">
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title || !restaurant || !content || rating === 0}
              className="px-5 py-2.5 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:dark:bg-gray-700 disabled:cursor-not-allowed rounded-xl transition-colors"
            >
              리뷰 등록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showWriteModal, setShowWriteModal] = useState(false);

  const handleNewReview = (review: Review) => {
    setReviews((prev) => [review, ...prev]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">리뷰</h1>
          <p className="text-gray-600 dark:text-gray-400">회원들의 솔직한 맛집 리뷰를 확인하세요</p>
        </div>
        <button
          onClick={() => setShowWriteModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          리뷰 작성
        </button>
      </div>

      <div className="space-y-6">
        {reviews.length === 0 && (
          <div className="text-center py-16 text-gray-400 dark:text-gray-500">
            <span className="text-5xl block mb-4">⭐</span>
            <p className="text-sm">아직 등록된 리뷰가 없습니다</p>
            <p className="text-xs mt-1">첫 번째 리뷰를 작성해보세요!</p>
          </div>
        )}
        {reviews.map((review) => (
          <article
            key={review.id}
            className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
          >
            {/* Author info */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-bold text-primary-700 dark:text-primary-300">
                  {review.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{review.author}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{review.date}</div>
                </div>
              </div>
              <span className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2.5 py-1 rounded-full">
                {review.category}
              </span>
            </div>

            {/* Restaurant & Rating */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                <svg className="w-4 h-4 inline mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {review.restaurant}
              </span>
              <StarRating rating={review.rating} />
            </div>

            {/* Review content */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{review.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{review.content}</p>

            {/* Photo Gallery */}
            <PhotoGallery photos={review.photos} />

            {/* Actions */}
            <div className="flex items-center gap-6 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                <span>{review.likes}</span>
              </button>
              <button className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                <span>{review.comments}</span>
              </button>
              <button className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors ml-auto">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                공유
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Write Modal */}
      {showWriteModal && (
        <ReviewWriteModal onClose={() => setShowWriteModal(false)} onSubmit={handleNewReview} />
      )}
    </div>
  );
}
