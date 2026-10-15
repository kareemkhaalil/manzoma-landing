import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ExternalLink, 
  AlertTriangle, 
  Bell, 
  Sparkles, 
  ShieldAlert 
} from 'lucide-react';

interface NotificationStyleConfig {
  width?: string;
  height?: string;
  fontFamily?: string;
  theme?: 'dark' | 'indigo' | 'emerald' | 'amber' | 'crimson' | 'light' | 'custom';
  bgColor?: string;
  bgGradient?: string;
  textColor?: string;
  accentColor?: string;
  borderRadius?: string;
  closable?: boolean;
}

interface PublicNotification {
  id: string;
  title: string;
  message: string;
  type: 'BANNER' | 'MODAL';
  targetPlatform?: 'ALL' | 'WEB' | 'DESKTOP';
  styleConfig?: NotificationStyleConfig;
  imageUrl?: string | null;
  imagePlacement?: 'TOP' | 'SIDE' | 'IMAGE_ONLY' | 'OVERLAY' | 'BACKGROUND';
  actionLabel?: string | null;
  actionUrl?: string | null;
  priority?: 'NORMAL' | 'HIGH' | 'URGENT';
  createdBy?: string | null;
  createdAt?: string;
}

const STORAGE_KEY = 'manzoma_site_dismissed_notifs';

export default function SiteNotificationReceiver() {
  const [notifications, setNotifications] = useState<PublicNotification[]>([]);
  const [activeModal, setActiveModal] = useState<PublicNotification | null>(null);
  const [activeBanner, setActiveBanner] = useState<PublicNotification | null>(null);

  // Fetch public notifications from API
  useEffect(() => {
    const fetchPublicNotifications = async () => {
      try {
        const res = await fetch('https://api.manzoma.online/api/notifications/public');
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data)) {
          // Read dismissed IDs from localStorage
          let dismissedIds: string[] = [];
          try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) dismissedIds = JSON.parse(raw);
          } catch (_) {}

          const parsed: PublicNotification[] = data
            .filter((n: any) => !dismissedIds.includes(n.id))
            .map((n: any) => {
              let style: NotificationStyleConfig = {};
              try {
                style = typeof n.styleConfig === 'string' ? JSON.parse(n.styleConfig) : (n.styleConfig || {});
              } catch (_) {}
              return { ...n, styleConfig: style };
            });

          setNotifications(parsed);
        }
      } catch (err) {
        // Silently catch network errors for marketing site
      }
    };

    fetchPublicNotifications();
  }, []);

  // Update active modal & banner
  useEffect(() => {
    const banners = notifications.filter(n => n.type === 'BANNER');
    const modals = notifications.filter(n => n.type === 'MODAL');

    setActiveBanner(banners.length > 0 ? banners[0] : null);
    setActiveModal(modals.length > 0 ? modals[0] : null);
  }, [notifications]);

  // Dismiss notification
  const handleDismiss = (id: string) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: string[] = raw ? JSON.parse(raw) : [];
      if (!list.includes(id)) {
        list.push(id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      }
    } catch (_) {}

    setNotifications(prev => prev.filter(n => n.id !== id));
    if (activeModal?.id === id) setActiveModal(null);
    if (activeBanner?.id === id) setActiveBanner(null);
  };

  // Action Click Handler
  const handleActionClick = (notif: PublicNotification) => {
    if (notif.actionUrl) {
      if (notif.actionUrl.startsWith('http://') || notif.actionUrl.startsWith('https://')) {
        window.open(notif.actionUrl, '_blank');
      } else {
        window.location.href = notif.actionUrl;
      }
    }
    handleDismiss(notif.id);
  };

  // Theme helper
  const getThemeStyles = (styleConfig?: NotificationStyleConfig) => {
    const theme = styleConfig?.theme || 'dark';
    switch (theme) {
      case 'indigo':
        return {
          containerClass: 'bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#1e1b4b] border-indigo-500/40 text-white shadow-indigo-500/20',
          badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
          btnClass: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30',
          subTextClass: 'text-indigo-200/90'
        };
      case 'emerald':
        return {
          containerClass: 'bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#022c22] border-emerald-500/40 text-white shadow-emerald-500/20',
          badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          btnClass: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30',
          subTextClass: 'text-emerald-200/90'
        };
      case 'amber':
        return {
          containerClass: 'bg-gradient-to-br from-[#451a03] via-[#78350f] to-[#291002] border-amber-500/40 text-white shadow-amber-500/20',
          badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          btnClass: 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30',
          subTextClass: 'text-amber-200/90'
        };
      case 'crimson':
        return {
          containerClass: 'bg-gradient-to-br from-[#4c0519] via-[#881337] to-[#2e020d] border-rose-500/40 text-white shadow-rose-500/20',
          badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          btnClass: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30',
          subTextClass: 'text-rose-200/90'
        };
      case 'light':
        return {
          containerClass: 'bg-white border-slate-200 text-slate-900 shadow-2xl',
          badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          btnClass: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md',
          subTextClass: 'text-slate-600'
        };
      case 'dark':
      default:
        return {
          containerClass: 'bg-[#0f172a] border-slate-700/80 text-white shadow-2xl',
          badgeClass: 'bg-slate-800 text-indigo-400 border-slate-700',
          btnClass: 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-lg shadow-indigo-600/20',
          subTextClass: 'text-slate-300'
        };
    }
  };

  return (
    <>
      {/* ── TOP BANNER ── */}
      <AnimatePresence>
        {activeBanner && (() => {
          const style = activeBanner.styleConfig || {};
          const theme = getThemeStyles(style);
          const isUrgent = activeBanner.priority === 'URGENT';
          const isHigh = activeBanner.priority === 'HIGH';

          return (
            <motion.div
              key={`site-banner-${activeBanner.id}`}
              initial={{ y: -70, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -70, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="fixed top-4 inset-x-4 z-[999999] max-w-4xl mx-auto pointer-events-auto"
              dir="rtl"
            >
              <div 
                className={`relative flex items-center justify-between gap-4 px-5 py-3.5 rounded-2xl border shadow-2xl backdrop-blur-md overflow-hidden ${theme.containerClass}`}
                style={{
                  background: style.bgGradient || style.bgColor,
                  color: style.textColor,
                  borderRadius: style.borderRadius
                }}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    isUrgent ? 'bg-rose-500/20 border-rose-500/30 text-rose-400 animate-pulse' :
                    isHigh ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' :
                    'bg-indigo-500/20 border-indigo-500/30 text-indigo-400'
                  }`}>
                    {isUrgent ? <ShieldAlert className="w-5 h-5" /> :
                     isHigh ? <AlertTriangle className="w-5 h-5" /> :
                     <Bell className="w-5 h-5" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${theme.badgeClass}`}>
                        {isUrgent ? '🚨 عاجل' : isHigh ? '⚠️ تنبيه' : '📢 إعلان'}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold truncate">{activeBanner.title}</h4>
                    </div>
                    <p className={`text-xs mt-0.5 truncate ${theme.subTextClass}`}>
                      {activeBanner.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {activeBanner.actionLabel && (
                    <button
                      onClick={() => handleActionClick(activeBanner)}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${theme.btnClass}`}
                      style={{ backgroundColor: style.accentColor }}
                    >
                      {activeBanner.actionLabel}
                      {activeBanner.actionUrl && <ExternalLink className="w-3.5 h-3.5" />}
                    </button>
                  )}

                  {style.closable !== false && (
                    <button
                      onClick={() => handleDismiss(activeBanner.id)}
                      className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                      title="إغلاق"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ── MODAL POPUP ── */}
      <AnimatePresence>
        {activeModal && (() => {
          const style = activeModal.styleConfig || {};
          const theme = getThemeStyles(style);
          const isUrgent = activeModal.priority === 'URGENT';
          const isHigh = activeModal.priority === 'HIGH';
          const placement = activeModal.imagePlacement || 'TOP';
          const modalWidth = style.width || '560px';
          const modalHeight = style.height && style.height !== 'auto' ? style.height : 'auto';
          const borderRadius = style.borderRadius || '24px';

          return (
            <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto" dir="rtl">
              <motion.div
                key={`site-modal-${activeModal.id}`}
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                style={{
                  width: modalWidth,
                  height: modalHeight,
                  maxWidth: '94vw',
                  maxHeight: '90vh',
                  borderRadius: borderRadius,
                  background: style.bgGradient || style.bgColor,
                  color: style.textColor
                }}
                className={`relative flex flex-col border shadow-2xl overflow-hidden ${theme.containerClass}`}
              >
                {/* TEMPLATE 1: IMAGE_ONLY */}
                {activeModal.imageUrl && placement === 'IMAGE_ONLY' ? (
                  <div className="relative w-full flex-1 flex flex-col group overflow-hidden">
                    {style.closable !== false && (
                      <button
                        onClick={() => handleDismiss(activeModal.id)}
                        className="absolute top-4 left-4 z-30 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 flex items-center justify-center text-white transition-all backdrop-blur-md shadow-lg"
                        title="إغلاق النافذة"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}

                    <div 
                      onClick={() => activeModal.actionUrl && handleActionClick(activeModal)}
                      className={`relative w-full flex-1 min-h-[280px] max-h-[78vh] bg-slate-950 overflow-hidden flex items-center justify-center ${activeModal.actionUrl ? 'cursor-pointer' : ''}`}
                    >
                      <img 
                        src={activeModal.imageUrl} 
                        alt={activeModal.title || 'Announcement'} 
                        className="w-full h-full object-contain max-h-[76vh]"
                      />
                    </div>

                    <div className="p-4 bg-slate-900/95 border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
                      <button
                        onClick={() => handleDismiss(activeModal.id)}
                        className="text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        عدم الإظهار مرة أخرى
                      </button>

                      {activeModal.actionLabel && (
                        <button
                          onClick={() => handleActionClick(activeModal)}
                          className={`px-6 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 ${theme.btnClass}`}
                          style={{ backgroundColor: style.accentColor }}
                        >
                          {activeModal.actionLabel}
                          {activeModal.actionUrl && <ExternalLink className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>
                ) : activeModal.imageUrl && placement === 'OVERLAY' ? (
                  /* TEMPLATE 2: OVERLAY */
                  <div className="relative w-full flex-1 flex flex-col overflow-hidden min-h-[320px]">
                    {style.closable !== false && (
                      <button
                        onClick={() => handleDismiss(activeModal.id)}
                        className="absolute top-4 left-4 z-30 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 flex items-center justify-center text-white/90 transition-all backdrop-blur-md"
                        title="إغلاق النافذة"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}

                    <img 
                      src={activeModal.imageUrl} 
                      alt="Background" 
                      className="absolute inset-0 w-full h-full object-cover object-center" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/40" />

                    <div className="relative z-10 flex-1 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${theme.badgeClass}`}>
                            {isUrgent ? <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> :
                             isHigh ? <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> :
                             <Sparkles className="w-3.5 h-3.5" />}
                            {isUrgent ? 'تنبيه عاجل' : isHigh ? 'إشعار هام' : 'إعلان'}
                          </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-black mb-4 leading-snug tracking-tight text-white drop-shadow-md">
                          {activeModal.title}
                        </h3>

                        <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap text-slate-100/90 drop-shadow">
                          {activeModal.message}
                        </div>
                      </div>

                      <div className="mt-8 pt-5 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <button
                          onClick={() => handleDismiss(activeModal.id)}
                          className="text-xs font-bold text-slate-300 hover:text-white transition-colors order-2 sm:order-1"
                        >
                          عدم الإظهار مرة أخرى
                        </button>

                        <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
                          {activeModal.actionLabel ? (
                            <button
                              onClick={() => handleActionClick(activeModal)}
                              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${theme.btnClass}`}
                              style={{ backgroundColor: style.accentColor }}
                            >
                              {activeModal.actionLabel}
                              {activeModal.actionUrl && <ExternalLink className="w-4 h-4" />}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDismiss(activeModal.id)}
                              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-black text-sm transition-all ${theme.btnClass}`}
                              style={{ backgroundColor: style.accentColor }}
                            >
                              حسناً، فهمت
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* TEMPLATE 3 & 4: TOP OR SIDE */
                  <>
                    {style.closable !== false && (
                      <button
                        onClick={() => handleDismiss(activeModal.id)}
                        className="absolute top-4 left-4 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-all backdrop-blur-sm"
                        title="إغلاق النافذة"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}

                    {activeModal.imageUrl && placement === 'TOP' && (
                      <div className="relative w-full h-44 sm:h-52 bg-slate-900 overflow-hidden shrink-0 border-b border-white/10">
                        <img 
                          src={activeModal.imageUrl} 
                          alt="Banner" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      </div>
                    )}

                    <div className="relative z-10 flex-1 p-6 sm:p-8 flex flex-col overflow-y-auto">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${theme.badgeClass}`}>
                          {isUrgent ? <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> :
                           isHigh ? <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> :
                           <Sparkles className="w-3.5 h-3.5" />}
                          {isUrgent ? 'تنبيه عاجل' : isHigh ? 'إشعار هام' : 'إعلان'}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black mb-4 leading-snug tracking-tight">
                        {activeModal.title}
                      </h3>

                      <div className={`flex-1 flex gap-5 ${placement === 'SIDE' ? 'flex-col sm:flex-row' : 'flex-col'}`}>
                        {activeModal.imageUrl && placement === 'SIDE' && (
                          <div className="w-full sm:w-44 h-36 sm:h-auto rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-md">
                            <img 
                              src={activeModal.imageUrl} 
                              alt="Thumbnail" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <div className={`flex-1 text-sm sm:text-base leading-relaxed whitespace-pre-wrap ${theme.subTextClass}`}>
                          {activeModal.message}
                        </div>
                      </div>

                      <div className="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <button
                          onClick={() => handleDismiss(activeModal.id)}
                          className="text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors order-2 sm:order-1"
                        >
                          عدم الإظهار مرة أخرى
                        </button>

                        <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
                          {activeModal.actionLabel ? (
                            <button
                              onClick={() => handleActionClick(activeModal)}
                              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${theme.btnClass}`}
                              style={{ backgroundColor: style.accentColor }}
                            >
                              {activeModal.actionLabel}
                              {activeModal.actionUrl && <ExternalLink className="w-4 h-4" />}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDismiss(activeModal.id)}
                              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-black text-sm transition-all ${theme.btnClass}`}
                              style={{ backgroundColor: style.accentColor }}
                            >
                              حسناً، فهمت
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  </>
                )}
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </>
  );
}
