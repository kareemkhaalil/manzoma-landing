import React, { useState, useEffect } from "react";
import { Terminal, Filter, RefreshCw, Loader2, AlertTriangle, Info, AlertCircle, ChevronDown, Building2 } from "lucide-react";
import { fetchLogs, fetchCompanies, type SystemLog, type CompanyFromAPI } from "../../lib/apiService";

export default function SystemLogs() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [companies, setCompanies] = useState<CompanyFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companyFilter, setCompanyFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [logsData, companiesData] = await Promise.all([
        fetchLogs({ companyId: companyFilter || undefined, level: levelFilter || undefined, limit: 100 }),
        companies.length === 0 ? fetchCompanies() : Promise.resolve(companies),
      ]);
      setLogs(logsData);
      if (companies.length === 0) setCompanies(companiesData as CompanyFromAPI[]);
    } catch (err: any) {
      setError(err.message || "فشل تحميل السجلات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [companyFilter, levelFilter]);

  const levelIcon = (level: string) => {
    switch (level?.toUpperCase()) {
      case "ERROR": return <AlertCircle className="w-3.5 h-3.5 text-rose-400" />;
      case "WARN": case "WARNING": return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      default: return <Info className="w-3.5 h-3.5 text-sky-400" />;
    }
  };

  const levelColor = (level: string) => {
    switch (level?.toUpperCase()) {
      case "ERROR": return "text-rose-400";
      case "WARN": case "WARNING": return "text-amber-400";
      default: return "text-sky-400";
    }
  };

  return (
    <div className="space-y-6 pb-20" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Terminal className="w-6 h-6 text-indigo-600" />
            سجلات النظام
          </h1>
          <p className="text-sm font-bold text-slate-500 mt-1">مراقبة أحداث النظام لجميع العملاء</p>
        </div>
        <button onClick={loadData} disabled={loading}
          className="flex items-center gap-2 border border-slate-200 bg-white px-5 py-3 rounded-2xl font-bold text-sm text-slate-500 hover:text-indigo-600 hover:border-brand-primary/30 transition-all">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          تحديث
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-2xl px-5 py-3 pr-10 text-sm font-bold text-slate-900 outline-none cursor-pointer min-w-[200px]">
            <option value="">كل الشركات</option>
            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
        <div className="relative">
          <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-2xl px-5 py-3 pr-10 text-sm font-bold text-slate-900 outline-none cursor-pointer">
            <option value="">كل المستويات</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARNING</option>
            <option value="ERROR">ERROR</option>
          </select>
          <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Console View */}
      <div className="bg-[#0d1117] rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
        {/* Console Header */}
        <div className="flex items-center gap-2 px-5 py-3 bg-[#161b22] border-b border-white/5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-white/30 text-xs font-mono font-bold mr-3">system.logs — {logs.length} entries</span>
        </div>

        {/* Console Body */}
        <div className="p-4 max-h-[600px] overflow-y-auto font-mono text-[13px] leading-relaxed space-y-1 scrollbar-hide">
          {loading && (
            <div className="flex items-center justify-center py-16 gap-3">
              <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
              <span className="text-white/40 font-bold">جاري التحميل...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-16 gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 font-bold">{error}</span>
            </div>
          )}

          {!loading && !error && logs.length === 0 && (
            <div className="text-center py-16 text-white/20 font-bold">لا توجد سجلات بعد</div>
          )}

          {!loading && !error && logs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.03] transition-colors group">
              {/* Timestamp */}
              <span className="text-white/20 text-[11px] whitespace-nowrap shrink-0 pt-0.5">
                {new Date(log.createdAt).toLocaleString("ar-EG", { hour: "2-digit", minute: "2-digit", second: "2-digit", day: "2-digit", month: "2-digit" })}
              </span>
              {/* Level Icon */}
              {levelIcon(log.level)}
              {/* Level Tag */}
              <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${levelColor(log.level)} bg-white/5 shrink-0`}>
                {log.level}
              </span>
              {/* Company */}
              {log.company && (
                <span className="text-violet-400/70 text-[11px] font-bold shrink-0">[{log.company.name}]</span>
              )}
              {/* User */}
              {log.user && (
                <span className="text-cyan-400/50 text-[11px] shrink-0">@{log.user.username}</span>
              )}
              {/* Message */}
              <span className="text-white/70 flex-1">{log.message || log.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
