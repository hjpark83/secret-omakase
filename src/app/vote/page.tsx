"use client";

import { useState } from "react";

/* ── Types ── */
interface VoteOption {
  id: string;
  label: string;
  description?: string;
  votes: number;
  voters: string[]; // hidden when anonymous
}

interface Poll {
  id: number;
  title: string;
  description: string;
  type: "place" | "date" | "general";
  anonymous: boolean;
  multiSelect: boolean;
  status: "active" | "closed";
  createdBy: string;
  createdAt: string;
  deadline: string;
  options: VoteOption[];
}

const initialPolls: Poll[] = [];

/* ── Helpers ── */
function totalVotes(options: VoteOption[]) {
  return options.reduce((sum, o) => sum + o.votes, 0);
}

function typeLabel(type: Poll["type"]) {
  switch (type) {
    case "place": return "장소 투표";
    case "date": return "날짜 투표";
    case "general": return "일반 투표";
  }
}

function typeColor(type: Poll["type"]) {
  switch (type) {
    case "place": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "date": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "general": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
  }
}

/* ── Create Poll Modal ── */
function CreatePollModal({ onClose, onCreate }: { onClose: () => void; onCreate: (poll: Poll) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<Poll["type"]>("place");
  const [anonymous, setAnonymous] = useState(false);
  const [multiSelect, setMultiSelect] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (idx: number) => setOptions(options.filter((_, i) => i !== idx));
  const updateOption = (idx: number, val: string) => {
    const next = [...options];
    next[idx] = val;
    setOptions(next);
  };

  const canSubmit = title && options.filter((o) => o.trim()).length >= 2 && deadline;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onCreate({
      id: Date.now(),
      title,
      description,
      type,
      anonymous,
      multiSelect,
      status: "active",
      createdBy: "나",
      createdAt: new Date().toISOString().slice(0, 10),
      deadline,
      options: options
        .filter((o) => o.trim())
        .map((label, i) => ({
          id: `new-${i}`,
          label,
          votes: 0,
          voters: [],
        })),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg max-h-[90vh] bg-white dark:bg-dark-card rounded-2xl shadow-2xl flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">투표 만들기</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">제목 *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="투표 제목을 입력하세요"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">설명</label>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="투표에 대한 설명을 입력하세요"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">투표 유형</label>
              <select value={type} onChange={(e) => setType(e.target.value as Poll["type"])}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm">
                <option value="place">장소 투표</option>
                <option value="date">날짜 투표</option>
                <option value="general">일반 투표</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">마감일 *</label>
              <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm" />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">익명 투표</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={multiSelect} onChange={(e) => setMultiSelect(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">복수 선택</span>
            </label>
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">선택지 (최소 2개) *</label>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={opt} onChange={(e) => updateOption(i, e.target.value)}
                    placeholder={`선택지 ${i + 1}`}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm" />
                  {options.length > 2 && (
                    <button onClick={() => removeOption(i)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  )}
                </div>
              ))}
              <button onClick={addOption} className="flex items-center gap-1.5 text-sm text-primary-500 hover:text-primary-600 font-medium mt-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                선택지 추가
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-bg hover:bg-gray-200 dark:hover:bg-dark-accent rounded-xl transition-colors">취소</button>
          <button onClick={handleSubmit} disabled={!canSubmit}
            className="px-5 py-2.5 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:dark:bg-gray-700 disabled:cursor-not-allowed rounded-xl transition-colors">
            투표 생성
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Poll Card ── */
function PollCard({ poll, onVote }: { poll: Poll; onVote: (pollId: number, optionId: string) => void }) {
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [hasVoted, setHasVoted] = useState(false);
  const [showVoters, setShowVoters] = useState<string | null>(null);
  const total = totalVotes(poll.options);
  const isActive = poll.status === "active";
  const showResults = hasVoted || !isActive;

  const toggleOption = (optionId: string) => {
    if (!isActive || hasVoted) return;
    setSelectedOptions((prev) => {
      const next = new Set(prev);
      if (next.has(optionId)) {
        next.delete(optionId);
      } else {
        if (!poll.multiSelect) next.clear();
        next.add(optionId);
      }
      return next;
    });
  };

  const submitVote = () => {
    if (selectedOptions.size === 0) return;
    selectedOptions.forEach((optId) => onVote(poll.id, optId));
    setHasVoted(true);
  };

  const winner = poll.options.reduce((a, b) => (a.votes > b.votes ? a : b));

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${typeColor(poll.type)}`}>{typeLabel(poll.type)}</span>
            {poll.anonymous && (
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                <svg className="w-3 h-3 inline mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                익명
              </span>
            )}
            {poll.multiSelect && (
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">복수선택</span>
            )}
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
              {isActive ? "진행중" : "마감"}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{poll.title}</h3>
        {poll.description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{poll.description}</p>}
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-2">
          <span>by {poll.createdBy}</span>
          <span>마감: {poll.deadline}</span>
          <span>총 {total}표</span>
        </div>
      </div>

      {/* Options */}
      <div className="px-6 pb-2 space-y-2">
        {poll.options.map((option) => {
          const pct = total > 0 ? Math.round((option.votes / total) * 100) : 0;
          const isSelected = selectedOptions.has(option.id);
          const isWinner = !isActive && option.id === winner.id;

          return (
            <div key={option.id}>
              <button
                onClick={() => toggleOption(option.id)}
                disabled={!isActive || hasVoted}
                className={`w-full text-left rounded-xl p-3 transition-all relative overflow-hidden ${
                  isSelected
                    ? "border-2 border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                    : "border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                } ${!isActive || hasVoted ? "cursor-default" : "cursor-pointer"} ${isWinner ? "ring-2 ring-yellow-400" : ""}`}
              >
                {/* Progress bar background */}
                {showResults && (
                  <div
                    className={`absolute inset-y-0 left-0 transition-all duration-500 ${isWinner ? "bg-yellow-100 dark:bg-yellow-900/20" : "bg-gray-100 dark:bg-gray-800/50"}`}
                    style={{ width: `${pct}%` }}
                  />
                )}

                <div className="relative flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Radio / Checkbox visual */}
                    {isActive && !hasVoted && (
                      <div className={`shrink-0 w-5 h-5 rounded-${poll.multiSelect ? "md" : "full"} border-2 flex items-center justify-center ${
                        isSelected ? "border-primary-500 bg-primary-500" : "border-gray-300 dark:border-gray-600"
                      }`}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        )}
                      </div>
                    )}
                    {isWinner && <span className="text-lg shrink-0">&#127942;</span>}
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-gray-900 dark:text-white block truncate">{option.label}</span>
                      {option.description && <span className="text-xs text-gray-500 dark:text-gray-400">{option.description}</span>}
                    </div>
                  </div>

                  {showResults && (
                    <div className="shrink-0 flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{pct}%</span>
                      <span className="text-xs text-gray-500">({option.votes})</span>
                    </div>
                  )}
                </div>
              </button>

              {/* Voter list (non-anonymous only) */}
              {showResults && !poll.anonymous && option.voters.length > 0 && (
                <div className="ml-3 mt-1 mb-2">
                  <button onClick={() => setShowVoters(showVoters === option.id ? null : option.id)} className="text-xs text-primary-500 hover:text-primary-600">
                    {showVoters === option.id ? "접기" : `투표자 ${option.voters.length}명 보기`}
                  </button>
                  {showVoters === option.id && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {option.voters.map((v) => (
                        <span key={v} className="text-xs bg-gray-100 dark:bg-dark-bg text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">{v}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Vote button */}
      {isActive && !hasVoted && (
        <div className="px-6 pb-5 pt-3">
          <button
            onClick={submitVote}
            disabled={selectedOptions.size === 0}
            className="w-full px-5 py-2.5 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:dark:bg-gray-700 disabled:cursor-not-allowed rounded-xl transition-colors"
          >
            투표하기
          </button>
        </div>
      )}

      {hasVoted && isActive && (
        <div className="px-6 pb-5 pt-1">
          <div className="text-center text-sm text-green-600 dark:text-green-400 font-medium py-2 bg-green-50 dark:bg-green-900/20 rounded-xl">
            투표 완료!
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Page ── */
export default function VotePage() {
  const [polls, setPolls] = useState<Poll[]>(initialPolls);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "closed">("all");

  const handleVote = (pollId: number, optionId: string) => {
    setPolls((prev) =>
      prev.map((poll) =>
        poll.id === pollId
          ? {
              ...poll,
              options: poll.options.map((opt) =>
                opt.id === optionId ? { ...opt, votes: opt.votes + 1, voters: [...opt.voters, "나"] } : opt
              ),
            }
          : poll
      )
    );
  };

  const handleCreate = (poll: Poll) => {
    setPolls((prev) => [poll, ...prev]);
  };

  const filtered = filter === "all" ? polls : polls.filter((p) => p.status === filter);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">투표</h1>
          <p className="text-gray-600 dark:text-gray-400">장소와 일정을 함께 정해보세요</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          투표 만들기
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {([["all", "전체"], ["active", "진행중"], ["closed", "마감"]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === key
                ? "bg-primary-500 text-white"
                : "bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-accent"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Polls */}
      <div className="space-y-6">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 dark:text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            <p>해당하는 투표가 없습니다</p>
          </div>
        ) : (
          filtered.map((poll) => (
            <PollCard key={poll.id} poll={poll} onVote={handleVote} />
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreatePollModal onClose={() => setShowCreateModal(false)} onCreate={handleCreate} />
      )}
    </div>
  );
}
