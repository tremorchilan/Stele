import React, { useState } from 'react';
import { AcademicSyllabus, SyllabusUpdateNotification } from '../../types';
import { MOCK_ACADEMIC_SYLLABI } from '../../data/mockData';
import { MOCK_SYLLABUS_UPDATES } from '../../data/academicCalendarData';
import {
  BookOpen,
  Bell,
  BellRing,
  ArrowLeft,
  Download,
  CheckCircle2,
  FileText,
  Clock,
  User,
  ShieldCheck,
  ChevronRight,
  Layers,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

interface ResourcesSyllabiViewProps {
  onBack: () => void;
  onShowToast: (msg: string) => void;
  isDark: boolean;
}

export const ResourcesSyllabiView: React.FC<ResourcesSyllabiViewProps> = ({
  onBack,
  onShowToast,
  isDark,
}) => {
  const [selectedSyllabus, setSelectedSyllabus] = useState<AcademicSyllabus | null>(MOCK_ACADEMIC_SYLLABI[0] || null);
  const [notifyEnabled, setNotifyEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('stele_syllabus_notify');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [updates, setUpdates] = useState<SyllabusUpdateNotification[]>(MOCK_SYLLABUS_UPDATES);
  const [activeTab, setActiveTab] = useState<'catalog' | 'updates'>('catalog');

  const toggleNotification = () => {
    const nextState = !notifyEnabled;
    setNotifyEnabled(nextState);
    localStorage.setItem('stele_syllabus_notify', JSON.stringify(nextState));
    onShowToast(
      nextState
        ? 'Syllabus change alerts enabled! You will be notified whenever faculty posts updates.'
        : 'Syllabus change alerts paused.'
    );
  };

  const handleSimulateFacultyUpdate = () => {
    const newUpdate: SyllabusUpdateNotification = {
      id: `syl-notif-${Date.now()}`,
      syllabusId: selectedSyllabus?.id || 'syl-phy-102',
      courseCode: selectedSyllabus?.courseCode || 'PHY-102',
      courseTitle: selectedSyllabus?.title || 'Advanced Wave Mechanics',
      date: 'Just now',
      changeType: 'rubric',
      summary: 'Faculty Mentor updated grading rubric: Problem Set Tray submission weight expanded +5% for rigorous proof appendices.',
      author: selectedSyllabus?.instructor || 'Faculty Mentor',
      read: false,
    };
    setUpdates([newUpdate, ...updates]);
    setActiveTab('updates');
    onShowToast('⚡ New Syllabus Revision: Grading rubric updated by faculty!');
  };

  const unreadCount = updates.filter((u) => !u.read).length;

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header & Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-[12px] bg-[var(--tile)] border border-[rgba(255,255,255,0.08)] text-[var(--meta)] hover:text-[var(--text)] transition-colors cursor-pointer"
            aria-label="Back to Campus Hub"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)]">
                Official Curricula
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-[6px] bg-sky-500/15 text-sky-400 font-bold">
                Faculty Verified
              </span>
            </div>
            <h1 className="text-[22px] font-extrabold text-[var(--text)] mt-0.5">
              Resources &amp; Course Syllabi
            </h1>
          </div>
        </div>

        {/* View Switcher: Catalog vs Updates */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-[14px] bg-[var(--tile)] border border-[rgba(255,255,255,0.08)]">
            <button
              type="button"
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-1.5 rounded-[10px] text-[12px] font-bold transition-all cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'text-[var(--meta)] hover:text-[var(--text)]'
              }`}
            >
              All Syllabi ({MOCK_ACADEMIC_SYLLABI.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('updates')}
              className={`px-3 py-1.5 rounded-[10px] text-[12px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'updates'
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'text-[var(--meta)] hover:text-[var(--text)]'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Revisions Log</span>
              {unreadCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* SYLLABUS REVISION NOTIFICATION CONTROL PANEL (User explicit requirement!) */}
      <div className="p-4 sm:p-5 rounded-[20px] bg-[var(--tile)] border border-[rgba(255,255,255,0.08)] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0 ${
                notifyEnabled
                  ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                  : 'bg-[var(--track)] text-[var(--meta)]'
              }`}
            >
              {notifyEnabled ? <BellRing className="w-5 h-5 animate-pulse" /> : <Bell className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-bold text-[var(--text)]">
                  Syllabus Revision Alerts
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-[6px] ${
                    notifyEnabled
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-[var(--track)] text-[var(--meta)]'
                  }`}
                >
                  {notifyEnabled ? 'Monitoring Active' : 'Muted'}
                </span>
              </div>
              <p className="text-[12.5px] text-[var(--meta)] mt-0.5 max-w-xl">
                Notify me immediately when professors update course modules, alter grading rubrics, or assign new textbook reserves.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={handleSimulateFacultyUpdate}
              className="px-3 py-1.5 rounded-[10px] bg-[var(--tile)] border border-[rgba(255,255,255,0.1)] text-[12px] text-[var(--text)] hover:border-[var(--accent)] transition-all font-medium flex items-center gap-1 cursor-pointer"
              title="Simulate a professor updating a syllabus"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulate Addendum</span>
            </button>

            <button
              type="button"
              onClick={toggleNotification}
              className={`px-4 py-1.5 rounded-[10px] text-[12.5px] font-bold transition-all shadow-xs cursor-pointer ${
                notifyEnabled
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-[var(--accent)] text-white hover:opacity-90'
              }`}
            >
              {notifyEnabled ? 'Alerts On ✓' : 'Enable Alerts'}
            </button>
          </div>
        </div>
      </div>

      {/* REVISIONS LOG TAB */}
      {activeTab === 'updates' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-[15px] font-bold text-[var(--text)]">
              Chronological Audit Trail of Syllabus Modifications
            </h3>
            <span className="text-[12px] text-[var(--meta)] font-mono">
              {updates.length} Revisions Recorded
            </span>
          </div>

          {updates.map((upd) => (
            <div
              key={upd.id}
              className="p-4 rounded-[16px] bg-[var(--tile)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.14)] transition-all flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center shrink-0 font-bold font-mono text-[11.5px]">
                  {upd.courseCode.split('-')[0]}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono font-bold text-[var(--accent)]">
                      {upd.courseCode}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-[6px] bg-[var(--track)] text-[var(--text)] capitalize">
                      {upd.changeType} Modified
                    </span>
                    <span className="text-[11.5px] text-[var(--meta)]">
                      {upd.date} by <strong className="text-[var(--text)]">{upd.author}</strong>
                    </span>
                  </div>

                  <p className="text-[13px] text-[var(--text)] leading-relaxed">
                    {upd.summary}
                  </p>
                </div>
              </div>

              <span className="text-[11px] text-emerald-400 font-semibold shrink-0 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ALL SYLLABI CATALOG */}
      {activeTab === 'catalog' && (
        <div className="flex flex-col gap-6">
          {/* Syllabus Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {MOCK_ACADEMIC_SYLLABI.map((syl) => {
              const isSelected = selectedSyllabus?.id === syl.id;
              return (
                <div
                  key={syl.id}
                  onClick={() => setSelectedSyllabus(syl)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedSyllabus(syl)}
                  className={`p-4 rounded-[18px] bg-[var(--tile)] border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-[var(--accent)] ring-1 ring-[var(--accent)] shadow-md'
                      : 'border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.18)]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-[6px] bg-[var(--accent-soft)] text-[var(--accent)]">
                        {syl.courseCode}
                      </span>
                      <span className="text-[11.5px] text-[var(--meta)]">
                        {syl.credits} Credits · {syl.term}
                      </span>
                    </div>

                    <h4 className="text-[15px] font-bold text-[var(--text)] leading-snug">
                      {syl.title}
                    </h4>

                    <p className="text-[12px] text-[var(--meta)] line-clamp-2 mt-1.5">
                      {syl.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[rgba(255,255,255,0.06)] text-[11.5px] text-[var(--meta)] flex items-center justify-between">
                    <span>{syl.instructor}</span>
                    <span className="text-[var(--accent)] font-semibold flex items-center gap-0.5">
                      View Outline <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Syllabus Detail Surface */}
          {selectedSyllabus && (
            <div className="p-5 sm:p-6 rounded-[22px] bg-[var(--tile)] border border-[rgba(255,255,255,0.08)] shadow-lg flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[rgba(255,255,255,0.08)]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-mono font-bold text-[var(--accent)]">
                      {selectedSyllabus.courseCode}
                    </span>
                    <span className="text-[11.5px] text-[var(--meta)]">
                      · {selectedSyllabus.department} · {selectedSyllabus.credits} Credits
                    </span>
                  </div>
                  <h3 className="text-[18px] sm:text-[21px] font-extrabold text-[var(--text)] mt-1">
                    {selectedSyllabus.title}
                  </h3>
                  <p className="text-[12.5px] text-[var(--meta)] mt-0.5">
                    Instructor: <strong className="text-[var(--text)]">{selectedSyllabus.instructor}</strong> ({selectedSyllabus.instructorRole}) · Office: {selectedSyllabus.officeDesk}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onShowToast(`Downloading official syllabus: ${selectedSyllabus.downloadFileName}`)}
                  className="px-3.5 py-1.5 rounded-[12px] bg-[var(--accent)] text-white text-[12.5px] font-bold hover:opacity-90 flex items-center gap-1.5 self-start sm:self-center shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Verified PDF</span>
                </button>
              </div>

              {/* Course Aims */}
              <div>
                <h4 className="text-[13.5px] font-bold text-[var(--text)] mb-1.5">
                  Course Aims &amp; Overview
                </h4>
                <p className="text-[13px] text-[var(--text)] leading-relaxed">
                  {selectedSyllabus.description}
                </p>
              </div>

              {/* Modules Breakdown */}
              <div>
                <h4 className="text-[13.5px] font-bold text-[var(--text)] mb-2.5 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[var(--accent)]" />
                  <span>Curricular Modules &amp; Duration</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedSyllabus.modules.map((mod) => (
                    <div
                      key={mod.number}
                      className="p-3.5 rounded-[14px] bg-[var(--track)] border border-[rgba(255,255,255,0.06)]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10.5px] font-mono font-bold text-[var(--accent)]">
                          Module {mod.number} · {mod.durationWeeks} Weeks
                        </span>
                      </div>
                      <h5 className="text-[13.5px] font-bold text-[var(--text)] mt-1">
                        {mod.name}
                      </h5>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {mod.topics.map((t, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2 py-0.5 rounded-[6px] bg-[var(--tile)] text-[var(--meta)]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Textbooks & Evaluation Rubric */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Prescribed Textbooks */}
                <div>
                  <h4 className="text-[13.5px] font-bold text-[var(--text)] mb-2.5">
                    Prescribed Textbooks &amp; Library Status
                  </h4>
                  <div className="space-y-2">
                    {selectedSyllabus.prescribedTextbooks.map((tb, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-[12px] bg-[var(--track)] border border-[rgba(255,255,255,0.06)] flex items-start justify-between gap-2"
                      >
                        <div>
                          <span className="text-[12.5px] font-semibold text-[var(--text)] block">
                            {tb.title}
                          </span>
                          <span className="text-[11px] text-[var(--meta)]">
                            {tb.author} · {tb.edition}
                          </span>
                        </div>
                        <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-[6px] bg-emerald-500/15 text-emerald-400 shrink-0">
                          {tb.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evaluation Rubric */}
                <div>
                  <h4 className="text-[13.5px] font-bold text-[var(--text)] mb-2.5">
                    Evaluation Weights
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedSyllabus.evaluationRubric.map((rubric, i) => (
                      <div key={i} className="p-2.5 rounded-[12px] bg-[var(--track)]">
                        <span className="text-[16px] font-extrabold text-emerald-400 font-mono block">
                          {rubric.weight}%
                        </span>
                        <span className="text-[11px] text-[var(--text)] font-semibold block mt-0.5">
                          {rubric.component}
                        </span>
                        <span className="text-[10.5px] text-[var(--meta)] leading-tight block mt-1">
                          {rubric.details}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
