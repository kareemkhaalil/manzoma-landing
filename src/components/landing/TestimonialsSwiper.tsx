import React from "react";
import { Star, Quote } from "lucide-react";
import { useAdminStore } from "../../store/adminStore";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  initials: string;
  avatarColor: string;
}

interface TestimonialsSwiperProps {
  isAr?: boolean;
}

export default function TestimonialsSwiper({ isAr = true }: TestimonialsSwiperProps) {
  const { language } = useAdminStore();
  const isArLang = isAr || language === "ar";

  const testimonials: Testimonial[] = isArLang
    ? [
        {
          quote: "منظومة حل لنا مشكلة انقطاع الإنترنت تماماً. كنا نتوقف عن البيع لساعات، الآن كاشير الملابس يعمل أوفلاين ويتم إرسال الفواتير فوراً على الواتساب.",
          author: "م. أحمد الشناوي",
          role: "مالك محلات الرائد للأزياء",
          initials: "أش",
          avatarColor: "from-indigo-500 to-blue-600",
        },
        {
          quote: "تقارير الـ Z-Report والعد الأعمى حمت أرباحنا. أصبحت مراجعة الخزينة اليومية مسألة دقائق ومضمونة دون أي عجز مالي.",
          author: "أ. محمود الكردي",
          role: "مدير سلسلة أسواق النخبة",
          initials: "مك",
          avatarColor: "from-emerald-500 to-teal-600",
        },
        {
          quote: "التكويد الذكي للمقاسات والألوان وفّر علينا أياماً من العمل. نقوم بطباعة ملصقات الباركود وتكويد الموديلات في ثوانٍ معدودة.",
          author: "أ. سارة عبد الرحمن",
          role: "مديرة ورشة إنتاج ملابس رياضية",
          initials: "سع",
          avatarColor: "from-rose-500 to-pink-600",
        },
        {
          quote: "ميزة المزامنة الهجينة جعلت إدارة 3 فروع سهلة جداً. كل فرع عنده قاعدة بيانات محلية SQLite وبترفع على البوستجرس السحابي لوحدها.",
          author: "م. طارق منصور",
          role: "صاحب سلسلة مخابز الأصالة",
          initials: "طم",
          avatarColor: "from-amber-500 to-orange-600",
        },
        {
          quote: "فواتير الواتساب التفاعلية وفرت علينا آلاف الجنيهات من ورق الطباعة الحرارية، والعملاء سعداء بالفاتورة الرقمية ولينك المعاينة السريع.",
          author: "أ. تامر عبد العزيز",
          role: "صاحب سوبر ماركت النور",
          initials: "تع",
          avatarColor: "from-purple-500 to-violet-600",
        },
        {
          quote: "دعم الكاشير للموازين الإلكترونية ممتاز وسريع جداً. البيع بالوزن يتم آلياً مع قراءة باركود الميزان المدمج بدقة بالغة.",
          author: "أ. خالد الشيمي",
          role: "مدير أسواق المدينة",
          initials: "خش",
          avatarColor: "from-cyan-500 to-sky-600",
        },
        {
          quote: "محرك العمولات التلقائي للمندوبين والمسوقين سهّل حساب رواتب ومستحقات المبيعات. السيستم يحسب عمولة كل فاتورة لحظياً.",
          author: "أ. يحيى زكريا",
          role: "المدير المالي للشركة المتحدة",
          initials: "يز",
          avatarColor: "from-teal-500 to-emerald-600",
        },
        {
          quote: "الدعم الفني متواجد 24/7 لمتابعة وردياتنا الليلية. النظام مستقر جداً وقاعدة البيانات المحلية آمنة من الفقد والخلل بالكامل.",
          author: "أ. شريف الهواري",
          role: "رئيس قطاع العمليات",
          initials: "شه",
          avatarColor: "from-fuchsia-500 to-pink-600",
        },
      ]
    : [
        {
          quote: "Manzoma solved our internet outage problems completely. Our cashier keeps selling offline and receipts go straight to the client's WhatsApp.",
          author: "Ahmed El-Shanawi",
          role: "Owner, Al-Raid Textiles",
          initials: "AE",
          avatarColor: "from-indigo-500 to-blue-600",
        },
        {
          quote: "Shift audits and Z-reports protected our store profits. Daily cash checks take minutes now — zero register leaks since we switched.",
          author: "Mahmoud El-Kurdi",
          role: "Manager, Al-Nokhba Markets",
          initials: "MK",
          avatarColor: "from-emerald-500 to-teal-600",
        },
        {
          quote: "The auto matrix coding for sizes and colors saves us hours daily. Barcodes print themselves in seconds — it's magic.",
          author: "Sara Abd El-Rahman",
          role: "Manager, Sports Fashion Workshop",
          initials: "SA",
          avatarColor: "from-rose-500 to-pink-600",
        },
        {
          quote: "Hybrid sync made managing 3 branches trivial. Each branch has its own local SQLite DB and syncs to cloud Postgres automatically.",
          author: "Tarek Mansour",
          role: "Owner, Al-Asala Bakeries",
          initials: "TM",
          avatarColor: "from-amber-500 to-orange-600",
        },
        {
          quote: "WhatsApp digital receipts saved us thousands in paper costs, and customers love having a modern interactive link.",
          author: "Tamer Abdel-Aziz",
          role: "Owner, Al-Noor Supermarket",
          initials: "TA",
          avatarColor: "from-purple-500 to-violet-600",
        },
        {
          quote: "Cashier scale support is fast and accurate. Selling weighed goods happens automatically with precision barcode decoding.",
          author: "Khaled El-Shimi",
          role: "Manager, City Markets",
          initials: "KE",
          avatarColor: "from-cyan-500 to-sky-600",
        },
        {
          quote: "Auto-commission tracking for salesmen simplified accounting. The system calculates everyone's share in real-time.",
          author: "Yehia Zakaria",
          role: "CFO, United Group",
          initials: "YZ",
          avatarColor: "from-teal-500 to-emerald-600",
        },
        {
          quote: "Support is active 24/7 for night shifts. The system database is fully secure locally and syncs perfectly.",
          author: "Sherif El-Hawari",
          role: "Director of Operations",
          initials: "SH",
          avatarColor: "from-fuchsia-500 to-pink-600",
        },
      ];

  // Split testimonials into 2 rows for variety (4 cards per row)
  const row1 = testimonials.slice(0, 4);
  const row2 = testimonials.slice(4, 8);

  const renderCard = (t: Testimonial, idx: number) => (
    <div
      key={idx}
      className="w-[340px] md:w-[380px] shrink-0 bg-white dark:bg-[#0E0C15] border border-slate-100 dark:border-slate-850 p-6 rounded-[1.8rem] shadow-sm dark:shadow-none text-right flex flex-col justify-between h-[210px] select-none hover:-translate-y-1.5 transition-all duration-300 relative"
      dir={isArLang ? "rtl" : "ltr"}
    >
      {/* Quote decoration */}
      <div className="absolute top-5 left-5 rtl:left-auto rtl:right-5 opacity-[0.05] pointer-events-none">
        <Quote className="w-10 h-10 text-[#1F41AD]" strokeWidth={3} />
      </div>

      <p className="text-slate-650 dark:text-slate-350 text-xs sm:text-sm font-medium leading-relaxed line-clamp-4">
        {t.quote}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.avatarColor} flex items-center justify-center font-black text-white text-xs shrink-0 shadow-inner`}>
            {t.initials}
          </div>
          <div className={isArLang ? "text-right" : "text-left"}>
            <h4 className="text-xs font-black text-slate-800 dark:text-white leading-tight">{t.author}</h4>
            <p className="text-[9px] text-slate-400 font-bold mt-0.5 leading-none">{t.role}</p>
          </div>
        </div>
        <div className="flex gap-0.5 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-current" />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full overflow-hidden flex flex-col gap-6" dir="ltr">
      
      {/* Row 1: Scrolls Left (Direction: RTL flow) */}
      <div className="marquee-row flex overflow-hidden relative w-full py-2">
        <div className="marquee-row__track-wrapper">
          <div className="marquee-row__track gap-6 pr-6">
            {[...Array(6)].flatMap(() => row1).map((item, idx) => renderCard(item, idx))}
          </div>
          <div className="marquee-row__track gap-6 pr-6" aria-hidden="true">
            {[...Array(6)].flatMap(() => row1).map((item, idx) => renderCard(item, `dup1-${idx}`))}
          </div>
        </div>
      </div>

      {/* Row 2: Scrolls Right (Direction: LTR flow) */}
      <div className="marquee-row flex overflow-hidden relative w-full py-2">
        <div className="marquee-row__track-wrapper marquee-row__track-wrapper--reverse">
          <div className="marquee-row__track gap-6 pr-6">
            {[...Array(6)].flatMap(() => row2).map((item, idx) => renderCard(item, idx))}
          </div>
          <div className="marquee-row__track gap-6 pr-6" aria-hidden="true">
            {[...Array(6)].flatMap(() => row2).map((item, idx) => renderCard(item, `dup2-${idx}`))}
          </div>
        </div>
      </div>
    </div>
  );
}
