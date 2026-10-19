# Impeccable Shape Brief: Manzoma ERP Landing Page
**Surface:** `src/pages/LandingPage.tsx` & `src/lib/translations.ts`  
**Mode:** Persuade (B2B SaaS / Retail ERP)  
**Tone Reference:** Daftra (دفترة) — Authoritative, professional, dignified, retail-practical. Zero cringe slogans, zero raw engineering jargon.

---

## 1. Job and Audience
- **Target Audience:** Egyptian and Arab retail merchants (Fashion & Apparel, Shoes, Homeware, Supermarkets, Multi-Branch Specialty Retailers).
- **Merchant Mindset:** Stressed during rush hours, burned by unstable software crashing during internet cuts, tired of drawer cash shortages, frustrated with complicated inventory stocktaking.
- **Visitor Success Outcome:** Recognizes Manzoma as a complete, stable, enterprise-grade command center for their store; requests a demo or starts a free 14-day trial without friction.

---

## 2. Voice & Tone Contract (The Daftra Standard)
- **Eliminated Forever:**
  - Hyperbolic/cringe claims: *"أسرع كاشير في مصر"*, *"البرنامج رقم 1"*, *"وداعاً للورق للأبد"*.
  - Technical engineering jargon: *"نظام هجين"*, *"Hybrid SQLite PostgreSQL synchronization layer"*.
- **Adopted Standard:**
  - Clear, operational B2B clarity: *"نظام متكامل لإدارة نقاط البيع والمخازن والحسابات"*, *"كاشير سريع ومستقر يعمل محلياً دون توقف"*, *"مصفوفة متطورة للمقاسات والألوان"*, *"تقفيل دقيق للورديات ومطابقة الخزائن (Z-Report)"*.

---

## 3. Structural Flow & Topology

```
1. Hero Container
   ├── Dignified H1: "نظام متكامل لإدارة نقاط البيع — والمخازن والمبيعات بدون تعقيد."
   ├── Subtitle: Retail-focused value proposition.
   ├── Single Primary CTA: Profit Emerald (#10B981) "ابدأ تجربتك المجانية"
   ├── Secondary Actions: "طلب ديمو توضيحي" + "تواصل مع المبيعات (WhatsApp)"
   └── Micro-Proof Bar: Local stability + Cloud Sync + Hardware integration (printers/scanners)

2. Trusted Ecosystem & Payments Managed
   └── Vodafone Cash, Fawry, Aman, Meeza, Visa/Mastercard, Cash.

3. Live Highlights Ticker (Marquee)
   └── Professional feature ticker covering inventory, POS, WhatsApp, Gemini AI, multi-cart.

4. "لماذا منظومة؟" — 3 Concrete Business Outcomes
   ├── 01: استقرار وسرعة فائقة لنقاط البيع (POS محلي سريع دون توقف).
   ├── 02: إدارة دقيقة للمخزون ومصفوفة المقاسات والألوان والجرد المرن.
   └── 03: رقابة مالية دقيقة ومساعد ذكاء اصطناعي عبر تليجرام.

5. "هل يناسب نشاطك؟" — Interactive Sector Fit
   ├── محلات الملابس والأحذية (الألوان والمقاسات، باركود، مرتجعات).
   ├── محلات المستلزمات المنزلية (آلاف الأصناف، تنبيهات النواقص، جرد المخزون).
   └── متاجر التجزئة العامة (كاشير محلي، الخصومات باسم الكاشير، تقفيل الخزينة).

6. Interactive Feature Bento Matrix (The Core Proof Engine)
   ├── Card 1 (Span 7): كاشير سريع ومستقر يعمل محلياً دون توقف (محاكي المبيعات أوفلاين/أونلاين).
   ├── Card 2 (Span 5): فواتير ورسائل الواتساب التسويقية (إرسال رقمي مباشر للعميل).
   ├── Card 3 (Span 5): مصفوفة المقاسات والألوان وطباعة الباركود (توليد الملصقات لحظياً).
   ├── Card 4 (Span 7): تقفيل الوردية ومطابقة الخزينة (كشف الفروقات والعجز والزيادة).
   ├── Card 5 (Span 6): مساعد الذكاء الاصطناعي (Gemini AI Telegram) — تقارير أرباح ومبيعات فورية.
   ├── Card 6 (Span 6): مصمم الفواتير والباركود المرئي + محرك الجرد السريع (بالإكسيل والسكانر).
   └── Card 7 (Span 12): تعدد الفواتير السريع (Multi-Cart Hold) للتعامل مع طوابير الكاشير.

7. Architecture & Data Integrity
   └── توضيح أمان ومزامنة البيانات بين الأجهزة المحلية والخادم السحابي دون تعقيد تقني.

8. Strategic Comparison Matrix
   └── مقارنة دقيقة بين منظومة والبدائل (الدفاتر الورقية، البرامج القديمة، الأنظمة السحابية فقط).

9. Calculator: Shift & Time Savings
   └── حاسبة تقديرية تفاعلية مع إخلاء مسؤولية تنظيمي واضح.

10. Transparent Pricing
    └── 3 باقات واضحة مع إصلاح تباين الألوان (WCAG AA) على الباقة الأكثر طلباً.

11. Practical FAQ Accordion
    └── إجابات مباشرة ومطمئنة لأسئلة التجار (انقطاع النت، الطابعات، الواتساب، الأمان).

12. Final Action CTA
    └── تجربة مجانية 14 يوماً وتواصل مباشر مع المبيعات.
```

---

## 4. Technical Craft & Quality Floor (impeccable standards)
- **Typography Floor:** No Arabic text rendered below `12px` (`text-xs`) to prevent broken letterforms and dot blurring.
- **Color Contrast:** Eliminating low-contrast text on dark backgrounds (`text-[#1F41AD]` on `bg-slate-900` replaced with `text-white` or `text-[#00E5FF]`).
- **Brand Fidelity:** Dot background using DESIGN.md `#3B5BFF` (`rgba(59, 91, 255, 0.07)`).
- **Mobile Comfort:** Safe offset between `FloatingWhatsApp` and `BottomNav`.
