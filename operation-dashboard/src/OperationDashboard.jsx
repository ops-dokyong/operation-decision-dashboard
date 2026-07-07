import React, { useMemo, useState } from "react";
import {
  Search,
  Phone,
  MessageCircle,
  Users,
  Eye,
  TrendingDown,
  TrendingUp,
  Minus,
  Sparkles,
  Flag,
  Check,
  X,
  ChevronDown,
  RefreshCw,
  LayoutDashboard,
  GraduationCap,
  FileBarChart,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Risk stage configuration                                            */
/* ------------------------------------------------------------------ */

const STAGES = {
  intervention: {
    key: "intervention",
    label: "집중 관리",
    en: "Intervention",
    order: 0,
    badge: "bg-red-50 text-red-700 border border-red-100",
    dot: "bg-red-500",
    solid: "bg-red-600",
  },
  priority: {
    key: "priority",
    label: "우선 연락",
    en: "Priority Contact",
    order: 1,
    badge: "bg-orange-50 text-orange-700 border border-orange-100",
    dot: "bg-orange-500",
    solid: "bg-orange-600",
  },
  warning: {
    key: "warning",
    label: "주의",
    en: "Warning",
    order: 2,
    badge: "bg-amber-50 text-amber-700 border border-amber-100",
    dot: "bg-amber-500",
    solid: "bg-amber-500",
  },
  observation: {
    key: "observation",
    label: "관찰",
    en: "Observation",
    order: 3,
    badge: "bg-gray-100 text-gray-600 border border-gray-200",
    dot: "bg-gray-400",
    solid: "bg-gray-400",
  },
};

const SIGNAL_OPTIONS = [
  "출석률 추세 하락",
  "과제 미제출",
  "장려금 기준 임박",
  "제적 기준 임박",
  "이전 상담 후 미개선",
  "SMS 무응답",
  "Discord 팀 활동 감소",
  "설문 미응답",
  "단일 결석 발생",
];

const COHORTS = ["12기", "13기"];

/* ------------------------------------------------------------------ */
/* Dummy data                                                           */
/* ------------------------------------------------------------------ */

function buildHeatmap(absentDays = [], lateDays = []) {
  return Array.from({ length: 28 }, (_, i) =>
    absentDays.includes(i) ? "absent" : lateDays.includes(i) ? "late" : "present"
  );
}

const STUDENTS = [
  {
    id: "s1",
    name: "김도윤",
    cohort: "12기",
    stage: "intervention",
    isNew: true,
    currentAttendance: 41,
    prevAttendance: 82,
    sparkline: [82, 75, 68, 58, 49, 41],
    cumulativeAbsence: 6,
    incentiveNear: true,
    expulsionNear: true,
    assignmentRate: 32,
    surveyResponded: false,
    discordActivity: "inactive",
    lmsFrequency: "low",
    counselingHistory: true,
    previousAction: "SMS 발송",
    improved: false,
    evidence: ["출석률 추세 하락", "과제 미제출", "제적 기준 임박", "SMS 무응답"],
    summary:
      "최근 3주간 출석률이 82%에서 41%로 지속적으로 감소했고, 같은 기간 과제 미제출이 반복되었습니다. 지난주 발송한 SMS에는 응답이 없었습니다.",
    action: "전화 상담 예약하기",
    timeline: [
      { date: "6/28", label: "SMS 발송 · 무응답" },
      { date: "6/24", label: "과제 미제출 3주 연속 기록" },
      { date: "6/20", label: "1차 관찰 단계 등록" },
    ],
    heatmap: buildHeatmap([10, 14, 17, 20, 21, 24], [12, 23]),
  },
  {
    id: "s2",
    name: "이서연",
    cohort: "12기",
    stage: "priority",
    isNew: false,
    currentAttendance: 58,
    prevAttendance: 75,
    sparkline: [75, 71, 68, 63, 60, 58],
    cumulativeAbsence: 3,
    incentiveNear: true,
    expulsionNear: false,
    assignmentRate: 54,
    surveyResponded: true,
    discordActivity: "declining",
    lmsFrequency: "medium",
    counselingHistory: false,
    previousAction: null,
    improved: null,
    evidence: ["출석률 추세 하락", "Discord 팀 활동 감소", "장려금 기준 임박"],
    summary:
      "최근 2주간 출석률이 완만하게 하락했고, Discord 팀 채널 활동이 눈에 띄게 줄었습니다. 장려금 지급 기준 출석률에 근접해 있습니다.",
    action: "운영매니저 공유",
    timeline: [
      { date: "6/27", label: "출석률 하락 추세 감지" },
      { date: "6/22", label: "Discord 팀 활동 감소 감지" },
    ],
    heatmap: buildHeatmap([9, 16, 22], [5, 19]),
  },
  {
    id: "s3",
    name: "박준혁",
    cohort: "13기",
    stage: "priority",
    isNew: true,
    currentAttendance: 60,
    prevAttendance: 70,
    sparkline: [70, 68, 66, 63, 61, 60],
    cumulativeAbsence: 4,
    incentiveNear: false,
    expulsionNear: false,
    assignmentRate: 41,
    surveyResponded: false,
    discordActivity: "active",
    lmsFrequency: "medium",
    counselingHistory: true,
    previousAction: "1차 상담",
    improved: false,
    evidence: ["과제 미제출", "이전 상담 후 미개선"],
    summary:
      "지난 상담 이후에도 과제 미제출이 계속되고 있으며, 출석률 개선이 확인되지 않았습니다.",
    action: "전화 상담 예약하기",
    timeline: [
      { date: "6/26", label: "과제 미제출 재발" },
      { date: "6/15", label: "1차 상담 진행" },
    ],
    heatmap: buildHeatmap([8, 15, 21, 25], [3]),
  },
  {
    id: "s4",
    name: "최민서",
    cohort: "13기",
    stage: "warning",
    isNew: false,
    currentAttendance: 80,
    prevAttendance: 90,
    sparkline: [90, 88, 86, 83, 81, 80],
    cumulativeAbsence: 1,
    incentiveNear: false,
    expulsionNear: false,
    assignmentRate: 78,
    surveyResponded: true,
    discordActivity: "active",
    lmsFrequency: "high",
    counselingHistory: false,
    previousAction: null,
    improved: null,
    evidence: ["출석률 추세 하락"],
    summary: "최근 2주간 출석률이 완만한 하락 추세를 보이고 있어 모니터링이 필요합니다.",
    action: "모니터링 지속",
    timeline: [{ date: "6/25", label: "출석률 하락 추세 감지" }],
    heatmap: buildHeatmap([13], [6, 20]),
  },
  {
    id: "s5",
    name: "정하은",
    cohort: "12기",
    stage: "warning",
    isNew: true,
    currentAttendance: 78,
    prevAttendance: 88,
    sparkline: [88, 86, 83, 81, 79, 78],
    cumulativeAbsence: 2,
    incentiveNear: false,
    expulsionNear: false,
    assignmentRate: 66,
    surveyResponded: false,
    discordActivity: "active",
    lmsFrequency: "medium",
    counselingHistory: false,
    previousAction: null,
    improved: null,
    evidence: ["설문 미응답", "과제 미제출"],
    summary: "설문 미응답과 일부 과제 미제출이 함께 나타나 참여도 저하 초기 신호로 감지되었습니다.",
    action: "출석 독려 메시지 보내기",
    timeline: [{ date: "6/23", label: "설문 미응답 확인" }],
    heatmap: buildHeatmap([7, 18], [11]),
  },
  {
    id: "s6",
    name: "오지훈",
    cohort: "13기",
    stage: "observation",
    isNew: false,
    currentAttendance: 90,
    prevAttendance: 92,
    sparkline: [92, 92, 91, 90, 90, 90],
    cumulativeAbsence: 1,
    incentiveNear: false,
    expulsionNear: false,
    assignmentRate: 88,
    surveyResponded: true,
    discordActivity: "active",
    lmsFrequency: "high",
    counselingHistory: false,
    previousAction: null,
    improved: null,
    evidence: ["출석률 추세 하락"],
    summary: "단일 결석 이후 특별한 이상 신호는 없으나 지속 모니터링 대상으로 등록되었습니다.",
    action: "모니터링 지속",
    timeline: [{ date: "6/21", label: "단일 결석 기록" }],
    heatmap: buildHeatmap([5], []),
  },
  {
    id: "s7",
    name: "한소율",
    cohort: "12기",
    stage: "observation",
    isNew: false,
    currentAttendance: 95,
    prevAttendance: 95,
    sparkline: [95, 96, 95, 95, 96, 95],
    cumulativeAbsence: 0,
    incentiveNear: false,
    expulsionNear: false,
    assignmentRate: 95,
    surveyResponded: true,
    discordActivity: "active",
    lmsFrequency: "high",
    counselingHistory: false,
    previousAction: null,
    improved: null,
    evidence: ["단일 결석 발생"],
    summary: "전반적으로 양호한 상태이며, 최근 일시적 참여도 저하가 1회 감지되었습니다.",
    action: "모니터링 지속",
    timeline: [{ date: "6/19", label: "일시적 참여도 저하 감지" }],
    heatmap: buildHeatmap([], [2]),
  },
  {
    id: "s8",
    name: "장우진",
    cohort: "13기",
    stage: "intervention",
    isNew: false,
    currentAttendance: 45,
    prevAttendance: 60,
    sparkline: [60, 56, 53, 49, 47, 45],
    cumulativeAbsence: 7,
    incentiveNear: false,
    expulsionNear: true,
    assignmentRate: 28,
    surveyResponded: false,
    discordActivity: "inactive",
    lmsFrequency: "low",
    counselingHistory: true,
    previousAction: "운영매니저 공유",
    improved: false,
    evidence: ["제적 기준 임박", "이전 상담 후 미개선", "SMS 무응답"],
    summary:
      "운영매니저 공유 이후에도 출석률 개선이 확인되지 않았으며, 제적 기준에 근접한 상태입니다.",
    action: "전화 상담 예약하기",
    timeline: [
      { date: "6/29", label: "SMS 발송 · 무응답" },
      { date: "6/18", label: "운영매니저 공유" },
      { date: "6/05", label: "1차 상담 진행" },
    ],
    heatmap: buildHeatmap([4, 9, 13, 18, 22, 25, 27], [15]),
  },
  {
    id: "s9",
    name: "윤서아",
    cohort: "12기",
    stage: "priority",
    isNew: false,
    currentAttendance: 62,
    prevAttendance: 68,
    sparkline: [68, 67, 65, 64, 63, 62],
    cumulativeAbsence: 3,
    incentiveNear: false,
    expulsionNear: false,
    assignmentRate: 47,
    surveyResponded: true,
    discordActivity: "declining",
    lmsFrequency: "medium",
    counselingHistory: false,
    previousAction: null,
    improved: null,
    evidence: ["과제 미제출", "Discord 팀 활동 감소"],
    summary: "과제 미제출과 Discord 팀 활동 감소가 함께 나타나고 있어 우선 연락이 필요합니다.",
    action: "운영매니저 공유",
    timeline: [{ date: "6/24", label: "Discord 팀 활동 감소 감지" }],
    heatmap: buildHeatmap([6, 17, 24], [9, 20]),
  },
];

const SORTED_ALL = [...STUDENTS].sort(
  (a, b) => STAGES[a.stage].order - STAGES[b.stage].order || b.cumulativeAbsence - a.cumulativeAbsence
);

/* ------------------------------------------------------------------ */
/* Small presentational helpers                                        */
/* ------------------------------------------------------------------ */

function Sparkline({ data }) {
  const w = 60;
  const h = 24;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const coords = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (w - 4) + 2;
    const y = h - 4 - ((d - min) / range) * (h - 8);
    return [x, y];
  });
  const points = coords.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const trend = data[data.length - 1] - data[0];
  const tone =
    trend < 0
      ? { stroke: "#DC2626", fill: "#FEE2E2", dot: "#DC2626" }
      : trend > 0
      ? { stroke: "#059669", fill: "#D1FAE5", dot: "#059669" }
      : { stroke: "#9CA3AF", fill: "#F3F4F6", dot: "#9CA3AF" };
  const [firstX] = coords[0];
  const [lastX, lastY] = coords[coords.length - 1];
  const areaPoints = `${firstX},${h - 2} ${points} ${lastX},${h - 2}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
      <polygon points={areaPoints} fill={tone.fill} />
      <polyline
        points={points}
        fill="none"
        stroke={tone.stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r="2.1" fill={tone.dot} stroke="white" strokeWidth="1" />
    </svg>
  );
}

function StageBadge({ stage, size = "sm" }) {
  const s = STAGES[stage];
  const pad = size === "sm" ? "pl-1.5 pr-2.5 py-0.5" : "pl-2 pr-3 py-1";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full text-xs font-semibold ${pad} ${s.badge}`}>
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function EvidenceBadge({ text }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
      {text}
    </span>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">{children}</p>
  );
}

function highlightFigures(text) {
  const parts = text.split(/(\d+(?:\.\d+)?%|\d+주|\d+일)/g);
  return parts.map((part, i) =>
    /^\d/.test(part) ? (
      <strong key={i} className="font-semibold text-blue-900">
        {part}
      </strong>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                               */
/* ------------------------------------------------------------------ */

function Header() {
  const [active, setActive] = useState("dashboard");
  const navItems = [
    { key: "dashboard", label: "운영 대시보드", icon: LayoutDashboard },
    { key: "students", label: "학생 관리", icon: GraduationCap },
    { key: "reports", label: "리포트", icon: FileBarChart },
  ];

  return (
    <header className="relative flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-900">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-gray-900">
          Operation Decision Support
        </span>
      </div>

      <nav className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <RefreshCw className="h-3.5 w-3.5" />
          <span>2분 전 동기화</span>
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-700">
          PM
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* KPI cards                                                            */
/* ------------------------------------------------------------------ */

function KpiCards({ data }) {
  const counts = useMemo(() => {
    const c = { total: data.length, intervention: 0, priority: 0, warning: 0, observation: 0, isNew: 0 };
    data.forEach((s) => {
      c[s.stage] += 1;
      if (s.isNew) c.isNew += 1;
    });
    return c;
  }, [data]);

  // previous-day snapshot (dummy comparison baseline)
  const prev = { total: 7, intervention: 1, priority: 4, warning: 3, isNew: 1 };

  const cards = [
    { key: "total", label: "오늘 관리 대상", value: counts.total, tone: "bg-gray-50 text-gray-900", neutral: true },
    { key: "intervention", label: "집중 관리", value: counts.intervention, tone: "bg-red-50 text-red-700" },
    { key: "priority", label: "우선 연락", value: counts.priority, tone: "bg-orange-50 text-orange-700" },
    { key: "warning", label: "주의", value: counts.warning, tone: "bg-amber-50 text-amber-700" },
    { key: "isNew", label: "신규 위험군", value: counts.isNew, tone: "bg-blue-50 text-blue-700" },
  ];

  return (
    <div className="grid shrink-0 grid-cols-5 gap-3 border-b border-gray-200 bg-gray-50 p-4">
      {cards.map((c) => {
        const delta = c.value - prev[c.key];
        const isUp = delta > 0;
        const isDown = delta < 0;
        const badTone = !c.neutral && isUp;
        const goodTone = !c.neutral && isDown;
        const deltaColor = c.neutral
          ? "text-gray-400"
          : badTone
          ? "text-red-600"
          : goodTone
          ? "text-emerald-600"
          : "text-gray-400";
        return (
          <div
            key={c.label}
            className={`rounded-xl p-3 transition-shadow duration-150 hover:shadow-sm ${c.tone}`}
          >
            <p className="text-xs font-medium opacity-80">{c.label}</p>
            <div className="mt-1 flex items-baseline gap-2">
              <p className="text-2xl font-semibold tracking-tight">{c.value}</p>
              <span className={`flex items-center gap-0.5 text-xs font-medium ${deltaColor}`}>
                {delta === 0 ? (
                  <Minus className="h-3 w-3" />
                ) : isUp ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {delta === 0 ? "0" : `${isUp ? "+" : ""}${delta}`}
              </span>
            </div>
            <p className="mt-0.5 text-xs opacity-60">전일 대비</p>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                              */
/* ------------------------------------------------------------------ */

function CheckboxRow({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-sm text-gray-600 transition-colors duration-150 hover:bg-gray-50">
      <span
        onClick={onChange}
        className={`flex h-4 w-4 items-center justify-center rounded border transition-colors duration-150 ${
          checked ? "border-slate-900 bg-slate-900" : "border-gray-300 bg-white"
        }`}
      >
        {checked && <Check className="h-3 w-3 text-white" />}
      </span>
      <span className={checked ? "text-gray-900" : ""}>{label}</span>
    </label>
  );
}

function Sidebar({ filters, setFilters }) {
  const toggle = (field, value) => {
    setFilters((prev) => {
      const set = new Set(prev[field]);
      set.has(value) ? set.delete(value) : set.add(value);
      return { ...prev, [field]: set };
    });
  };

  return (
    <aside
      className="shrink-0 space-y-5 overflow-y-auto border-r border-gray-200 bg-white p-4"
      style={{ width: "240px" }}
    >
      <div>
        <SectionLabel>기수</SectionLabel>
        {COHORTS.map((c) => (
          <CheckboxRow
            key={c}
            label={c}
            checked={filters.cohorts.has(c)}
            onChange={() => toggle("cohorts", c)}
          />
        ))}
      </div>

      <div>
        <SectionLabel>위험 단계</SectionLabel>
        {Object.values(STAGES).map((s) => (
          <CheckboxRow
            key={s.key}
            label={s.label}
            checked={filters.stages.has(s.key)}
            onChange={() => toggle("stages", s.key)}
          />
        ))}
      </div>

      <div>
        <SectionLabel>위험 신호</SectionLabel>
        <div className="max-h-40 overflow-y-auto pr-1">
          {SIGNAL_OPTIONS.map((sig) => (
            <CheckboxRow
              key={sig}
              label={sig}
              checked={filters.signals.has(sig)}
              onChange={() => toggle("signals", sig)}
            />
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>상담 이력</SectionLabel>
        <div className="flex gap-1.5">
          {[
            { key: "all", label: "전체" },
            { key: "yes", label: "있음" },
            { key: "no", label: "없음" },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFilters((p) => ({ ...p, counseling: opt.key }))}
              className={`rounded-md border px-2 py-1 text-xs font-medium transition-all duration-150 active:scale-95 ${
                filters.counseling === opt.key
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>검색</SectionLabel>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
          <input
            value={filters.search}
            onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
            placeholder="학생 이름 검색"
            className="w-full rounded-md border border-gray-200 bg-white py-2 pl-8 pr-2 text-sm text-gray-700 outline-none transition-all duration-150 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Student list + card                                                  */
/* ------------------------------------------------------------------ */

function StudentCard({ student, active, onClick }) {
  const stage = STAGES[student.stage];
  const declining = student.currentAttendance < student.prevAttendance;

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg border p-3 text-left transition-all duration-150 ${
        active
          ? "border-slate-900 bg-white shadow-md ring-1 ring-slate-900"
          : "border-gray-200 bg-white hover:-translate-y-px hover:border-gray-300 hover:shadow-md"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <StageBadge stage={student.stage} />
          <span className="text-sm font-semibold text-gray-900">{student.name}</span>
          <span className="text-xs text-gray-400">{student.cohort}</span>
        </div>
        {student.isNew && (
          <span className="shrink-0 rounded-full bg-blue-50 px-1.5 py-0.5 text-xs font-semibold text-blue-700">
            NEW
          </span>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {student.evidence.slice(0, 2).map((e) => (
          <span
            key={e}
            className="rounded-md bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-500"
          >
            {e}
          </span>
        ))}
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-3 border-t border-gray-100 pt-2.5">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold tabular-nums ${declining ? "text-red-600" : "text-gray-700"}`}>
            {student.prevAttendance}%→{student.currentAttendance}%
          </span>
          <Sparkline data={student.sparkline} />
        </div>
        <span className="shrink-0 text-xs text-gray-400">
          결석 <span className="font-semibold text-gray-700">{student.cumulativeAbsence}일</span>
        </span>
        <button
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700 transition-all duration-150 hover:border-gray-300 hover:bg-gray-100 hover:shadow-sm active:scale-95"
        >
          {student.action}
        </button>
      </div>
    </button>
  );
}

function StudentList({ students, selectedId, onSelect }) {
  return (
    <div className="min-w-0 flex-1 space-y-2 overflow-y-auto p-3">
      <div className="flex items-center justify-between px-1 pb-1">
        <p className="text-xs text-gray-400">위험도순 정렬 · {students.length}명</p>
      </div>
      {students.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400">
          조건에 맞는 학생이 없습니다.
        </div>
      )}
      {students.map((s) => (
        <StudentCard
          key={s.id}
          student={s}
          active={s.id === selectedId}
          onClick={() => onSelect(s.id)}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Detail panel                                                         */
/* ------------------------------------------------------------------ */

function Heatmap({ data }) {
  const color = {
    present: "bg-green-400",
    late: "bg-amber-400",
    absent: "bg-red-400",
  };
  return (
    <div className="grid grid-cols-7 gap-1">
      {data.map((status, i) => (
        <div key={i} className={`aspect-square rounded-sm ${color[status]}`} />
      ))}
    </div>
  );
}

function ProgressBar({ value, tone = "bg-slate-700" }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
      <div className={`h-full rounded-full ${tone}`} style={{ width: `${value}%` }} />
    </div>
  );
}

const DISCORD_LABEL = { active: "활발함", declining: "감소 추세", inactive: "비활성" };
const LMS_LABEL = { high: "높음", medium: "보통", low: "낮음" };

function DetailPanel({ student }) {
  if (!student) {
    return (
      <aside
        className="shrink-0 border-l border-gray-200 bg-gray-50 p-6 text-sm text-gray-400"
        style={{ width: "450px" }}
      >
        학생을 선택하면 상세 정보가 표시됩니다.
      </aside>
    );
  }

  const stage = STAGES[student.stage];
  const declining = student.currentAttendance < student.prevAttendance;
  const summaryParagraphs = student.summary.split(/(?<=[.])\s+/).filter(Boolean);

  return (
    <aside
      className="shrink-0 space-y-3 overflow-y-auto border-l border-gray-200 bg-gray-50 p-3.5"
      style={{ width: "450px" }}
    >
      {/* 1. basic info */}
      <div className="flex items-center gap-2.5">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white ${stage.solid}`}
        >
          {student.name.slice(0, 1)}
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight text-gray-900">{student.name}</p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="text-xs text-gray-400">{student.cohort}</span>
            <StageBadge stage={student.stage} />
          </div>
        </div>
      </div>

      {/* 2. AI Evidence */}
      <div className="rounded-lg border border-slate-200 bg-white p-3 transition-shadow duration-150 hover:shadow-sm">
        <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <Flag className="h-3.5 w-3.5" />
          AI Evidence · 종합 근거
        </div>
        <div className="flex flex-wrap gap-1.5">
          {student.evidence.map((e) => (
            <EvidenceBadge key={e} text={e} />
          ))}
        </div>
      </div>

      {/* 3. AI Summary */}
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-blue-700">
          <Sparkles className="h-3.5 w-3.5" />
          AI Summary
        </div>
        <div className="space-y-2">
          {summaryParagraphs.map((p, i) => (
            <p key={i} className="text-xs leading-relaxed tracking-normal text-blue-900/90">
              {highlightFigures(p)}
            </p>
          ))}
        </div>
      </div>

      {/* 4. Recommended action */}
      <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-slate-800 hover:shadow active:scale-[0.98]">
        <Phone className="h-4 w-4" />
        {student.action}
      </button>

      {/* 5. Attendance */}
      <div className="rounded-lg border border-gray-200 bg-white p-3 transition-shadow duration-150 hover:shadow-sm">
        <div className="mb-1.5 flex items-center justify-between">
          <SectionLabel>출결 현황</SectionLabel>
          <span className="text-xs text-gray-400">최근 4주</span>
        </div>
        <Heatmap data={student.heatmap} />
        <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-green-400" />
            출석
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-amber-400" />
            지각
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-red-400" />
            결석
          </span>
        </div>
        <div className="mt-2 grid grid-cols-4 gap-1.5 border-t border-gray-100 pt-2 text-xs">
          <div>
            <p className="text-gray-400">현재</p>
            <p className="font-semibold text-gray-900">{student.currentAttendance}%</p>
          </div>
          <div>
            <p className="text-gray-400">이전</p>
            <p className="font-semibold text-gray-900">{student.prevAttendance}%</p>
          </div>
          <div>
            <p className="text-gray-400">변화</p>
            <p className={`flex items-center gap-0.5 font-semibold ${declining ? "text-red-600" : "text-gray-900"}`}>
              {declining ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
              {student.currentAttendance - student.prevAttendance}%p
            </p>
          </div>
          <div>
            <p className="text-gray-400">누적결석</p>
            <p className="font-semibold text-gray-900">{student.cumulativeAbsence}일</p>
          </div>
        </div>
      </div>

      {/* 6. Learning engagement */}
      <div className="rounded-lg border border-gray-200 bg-white p-3 transition-shadow duration-150 hover:shadow-sm">
        <SectionLabel>학습 참여도</SectionLabel>
        <div className="space-y-2">
          <div>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-gray-500">과제 제출률</span>
              <span className="font-semibold text-gray-900">{student.assignmentRate}%</span>
            </div>
            <ProgressBar
              value={student.assignmentRate}
              tone={student.assignmentRate < 50 ? "bg-red-500" : "bg-slate-700"}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">설문 응답</span>
            <span
              className={`flex items-center gap-1 font-semibold ${
                student.surveyResponded ? "text-gray-900" : "text-red-600"
              }`}
            >
              {student.surveyResponded ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
              {student.surveyResponded ? "응답함" : "미응답"}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Discord 팀 활동</span>
            <span className="font-semibold text-gray-900">{DISCORD_LABEL[student.discordActivity]}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">LMS 로그인 빈도</span>
            <span className="font-semibold text-gray-900">{LMS_LABEL[student.lmsFrequency]}</span>
          </div>
        </div>
      </div>

      {/* 7. Operation history */}
      <div className="rounded-lg border border-gray-200 bg-white p-3 transition-shadow duration-150 hover:shadow-sm">
        <SectionLabel>운영 이력</SectionLabel>
        <div className="space-y-2">
          {student.timeline.map((t, i) => (
            <div key={i} className="flex gap-2">
              <div className="flex flex-col items-center pt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                {i < student.timeline.length - 1 && <span className="mt-1 w-px flex-1 bg-gray-200" />}
              </div>
              <div className="pb-1.5">
                <p className="text-xs text-gray-700">{t.label}</p>
                <p className="text-xs text-gray-400">{t.date}</p>
              </div>
            </div>
          ))}
          {student.timeline.length === 0 && (
            <p className="text-xs text-gray-400">등록된 운영 이력이 없습니다.</p>
          )}
        </div>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Root                                                                 */
/* ------------------------------------------------------------------ */

export default function OperationDashboard() {
  const [filters, setFilters] = useState({
    cohorts: new Set(),
    stages: new Set(),
    signals: new Set(),
    counseling: "all",
    search: "",
  });
  const [selectedId, setSelectedId] = useState(SORTED_ALL[0].id);

  const filtered = useMemo(() => {
    return SORTED_ALL.filter((s) => {
      if (filters.cohorts.size && !filters.cohorts.has(s.cohort)) return false;
      if (filters.stages.size && !filters.stages.has(s.stage)) return false;
      if (filters.signals.size && ![...filters.signals].some((sig) => s.evidence.includes(sig)))
        return false;
      if (filters.counseling === "yes" && !s.counselingHistory) return false;
      if (filters.counseling === "no" && s.counselingHistory) return false;
      if (filters.search && !s.name.includes(filters.search.trim())) return false;
      return true;
    });
  }, [filters]);

  const selectedStudent = STUDENTS.find((s) => s.id === selectedId) || null;

  return (
    <div className="flex h-screen flex-col bg-gray-50 font-sans text-gray-900">
      <Header />
      <KpiCards data={STUDENTS} />
      <div className="flex flex-1 flex-row overflow-hidden">
        <Sidebar filters={filters} setFilters={setFilters} />
        <StudentList students={filtered} selectedId={selectedId} onSelect={setSelectedId} />
        <DetailPanel student={selectedStudent} />
      </div>
    </div>
  );
}
