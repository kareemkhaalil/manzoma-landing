import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import { useAdminStore } from "../../store/adminStore";

export default function HeaderPromoBar() {
  const { config } = useAdminStore();
  const promo = config.promoBar;
  const [isVisible, setIsVisible] = React.useState(true);

  if (!promo || !promo.enabled || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full relative z-[150] flex items-center justify-center overflow-hidden shadow-sm"
        style={{ backgroundColor: promo.backgroundColor }}
      >
        <div className="container max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex-1 flex justify-center items-center gap-2">
            <span className="text-sm font-[800] text-white">
              {promo.text}
            </span>
            {promo.linkUrl && (
              <a 
                href={promo.linkUrl} 
                className="text-xs font-bold text-white/80 hover:text-white flex items-center gap-1 bg-black/10 hover:bg-black/20 px-2 py-0.5 rounded transition-all"
              >
                تصفح العرض
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-white/70 hover:text-white transition-colors bg-black/5 hover:bg-black/20 p-1 rounded-full"
            aria-label="إغلاق الشريط"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
