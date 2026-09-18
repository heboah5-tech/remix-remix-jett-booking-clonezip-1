import { BookingData } from '@/lib/booking-data';
import { ShieldAlert, Info, ArrowLeft, CalendarDays, LockKeyhole, Clock, ShieldCheck, ArrowDown, X } from 'lucide-react';
import { motion } from 'framer-motion';

type Props = {
  data: BookingData;
  updateData: (d: Partial<BookingData>) => void;
  onNext: () => void;
};

export function PreStep({ updateData, onNext }: Props) {
  const handleSelect = (type: 'arab' | 'luggage') => {
    updateData({ bookingType: type });
    onNext();
  };

  return (
    <div dir="rtl" className="flex-1 flex flex-col px-[10px] pt-[14px] animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">

      {/* Alerts */}
      <div className="flex flex-col gap-[10px]">
        <div className="min-h-[158px] rounded-[15px] border-2 border-[#144d5a] bg-[#fbfcfc] px-[14px] py-[15px] text-[#143f4a]">
          <div className="relative min-h-[22px]">
            <X className="absolute left-0 top-0.5 h-[16px] w-[16px] text-[#9daeb4]" />
            <div className="absolute right-0 top-0 flex items-center gap-2">
              <span className="text-[20px] leading-none text-[#f1bd00]">⚠</span>
              <ShieldAlert className="h-[19px] w-[19px] text-[#143f4a]" />
            </div>
            <h3 className="pr-[52px] text-right text-[15px] font-extrabold leading-tight">
              تنبيه أمني هام: احذروا المواقع المزيفة
            </h3>
          </div>
          <p className="mt-[13px] text-right text-[12.5px] font-medium leading-[1.7] text-[#3b4d52]">
            لوحظ مؤخراً وجود مواقع إلكترونية مزيفة تحاول الاحتيال وانتحال هوية جت. نود تذكيركم بعدم إدخال أي معلومات شخصية أو مالية إلا عبر موقع جت الرسمي:
            <span dir="ltr" className="mx-1 font-bold text-[#0d6078]">https://www.jett.com.jo</span>
            . حيث جت غير مسؤولة عن أي معاملات تتم خارج هذا الرابط الرسمي.
          </p>
        </div>

        <div className="min-h-[160px] rounded-[15px] border-2 border-[#144d5a] bg-[#fbfcfc] px-[14px] py-[15px] text-[#143f4a]">
          <div className="relative min-h-[22px]">
            <X className="absolute left-0 top-0.5 h-[16px] w-[16px] text-[#9daeb4]" />
            <Info className="absolute right-0 top-0.5 h-[18px] w-[18px]" />
            <h3 className="pr-[28px] text-right text-[15px] font-extrabold leading-tight">
              شراء الأمتعة الإضافية متاح عبر المنصة فقط
            </h3>
          </div>
          <p className="mt-[13px] text-right text-[12.5px] font-medium leading-[1.7] text-[#3b4d52]">
            يرجى العلم بأن خيار شراء الأمتعة الإضافية متاحة حصرياً وفقط عبر موقعنا الإلكتروني الرسمي. ولا تتوفر أي أجهزة دفع إلكتروني (POS) أو مكاتب مبيعات لشراء الأمتعة الإضافية في جسر الملك حسين. يرجى التأكد من إتمام عملية الشراء عبر المنصة قبل الوصول إلى الجسر تجنباً لأي تأخير في رحلتكم.
          </p>
        </div>
      </div>

      <div className="mt-[20px] flex flex-col items-center justify-center text-[#657278]">
        <span className="text-[13px] font-semibold">اسحب للأسفل لبدء الحجز</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="mt-1"
        >
          <ArrowDown className="h-[19px] w-[19px]" />
        </motion.div>
      </div>

      <div className="mt-[22px] text-center">
        <h2 className="text-[24px] font-black tracking-tight text-[#123f4d]">اختر نوع الحجز</h2>
        <p className="mt-2 text-[14px] font-medium text-[#7a7d80]">حدد خيار الحجز الذي يناسب احتياجاتك</p>
      </div>

      <div className="mt-[18px] flex flex-col gap-[14px]">
        <button
          type="button"
          className="group relative h-[310px] w-full overflow-hidden rounded-[22px] border-2 border-[#144d5a] bg-[linear-gradient(180deg,#ffffff_0%,#edf3f5_38%,#acc6d1_100%)] text-[#123f4d] shadow-[0_3px_10px_rgba(16,63,75,0.08)] transition-transform hover:-translate-y-0.5"
          onClick={() => handleSelect('arab')}
        >
          <div className="absolute right-[30px] top-[17px] flex h-[59px] w-[59px] items-center justify-center rounded-full bg-[#e4ebee] text-[#123f4d]">
            <CalendarDays className="h-[31px] w-[31px]" strokeWidth={1.9} />
          </div>
          <span className="absolute inset-x-0 top-[143px] text-center text-[25px] font-extrabold">حجز مغادرين عرب</span>
          <span className="absolute bottom-[17px] left-[17px] right-[17px] flex h-[55px] items-center justify-center gap-3 rounded-[9px] bg-[#104b5a] text-[17px] font-bold text-white shadow-sm">
            <span>اختر</span>
            <ArrowLeft className="h-5 w-5" />
          </span>
        </button>

        <button
          type="button"
          className="group relative h-[310px] w-full overflow-hidden rounded-[22px] border-2 border-[#9caab0] bg-[linear-gradient(180deg,#ffffff_0%,#edf3f5_38%,#acc6d1_100%)] text-[#123f4d] shadow-[0_3px_10px_rgba(16,63,75,0.08)] transition-transform hover:-translate-y-0.5"
          onClick={() => handleSelect('luggage')}
        >
          <div className="absolute right-[30px] top-[17px] flex h-[59px] w-[59px] items-center justify-center rounded-full bg-[#e4ebee] text-[#123f4d]">
            <LockKeyhole className="h-[30px] w-[30px]" strokeWidth={1.9} />
          </div>
          <span className="absolute inset-x-0 top-[143px] text-center text-[25px] font-extrabold">إضافة أمتعة مغادرين</span>
          <span className="absolute bottom-[17px] left-[17px] right-[17px] flex h-[55px] items-center justify-center gap-3 rounded-[9px] bg-[#104b5a] text-[17px] font-bold text-white shadow-sm">
            <span>اختر</span>
            <ArrowLeft className="h-5 w-5" />
          </span>
        </button>
      </div>

      {/* Why book with us */}
      <div className="mt-[29px] rounded-t-[24px] bg-white px-[18px] pb-[24px] pt-[27px] shadow-[0_-2px_14px_rgba(25,63,74,0.04)]">
        <h3 className="border-b border-[#e5e8e9] pb-[14px] text-right text-[20px] font-extrabold text-[#111c20]">لماذا تحجز معنا</h3>
        <div className="divide-y divide-[#e8eaeb]">
          <div className="flex min-h-[91px] items-center justify-between gap-4">
            <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-[#f0f3f4] text-[#123f4d]">
              <CalendarDays className="h-6 w-6" strokeWidth={1.8} />
            </div>
            <div className="flex-1 text-right">
              <h4 className="text-[17px] font-bold text-[#111c20]">حجز إلكتروني</h4>
              <p className="mt-1 text-[13px] text-[#7d8183]">حجز إلكتروني سريع وسهل</p>
            </div>
          </div>
          <div className="flex min-h-[91px] items-center justify-between gap-4">
            <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-[#f0f3f4] text-[#123f4d]">
              <Clock className="h-6 w-6" strokeWidth={1.8} />
            </div>
            <div className="flex-1 text-right">
              <h4 className="text-[17px] font-bold text-[#111c20]">سريع وفعال</h4>
              <p className="mt-1 text-[13px] text-[#7d8183]">وفر وقتك مع خدمة حجز سهلة</p>
            </div>
          </div>
          <div className="flex min-h-[91px] items-center justify-between gap-4">
            <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-[#f0f3f4] text-[#123f4d]">
              <ShieldCheck className="h-6 w-6" strokeWidth={1.8} />
            </div>
            <div className="flex-1 text-right">
              <h4 className="text-[17px] font-bold text-[#111c20]">آمن وموثوق</h4>
              <p className="mt-1 text-[13px] text-[#7d8183]">بياناتك محمية طوال الرحلة</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}