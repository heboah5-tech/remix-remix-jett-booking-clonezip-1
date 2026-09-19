import { useState, useEffect } from 'react';
import { BookingData, defaultBookingData, FARES } from '@/lib/booking-data';
import { Globe, Check, MessageCircle, ShieldCheck } from 'lucide-react';
import jettLogo from '@assets/jett_header_1789397361449.png';
import { Footer } from '@/components/footer';
import { PreStep } from './steps/pre-step';
import { Step2 } from './steps/step2';
import { Step3 } from './steps/step3';
import { StepPassengers } from './steps/step-passengers';
import { Step4 } from './steps/step4';
import { Step5 } from './steps/step5';
import { Button } from '@/components/ui/button';
import { useTracking } from '@/hooks/use-tracking';
import { apiFetch, createBooking } from '@workspace/api-client-react';

const STEPS = [
  { num: 1, label: 'الرحلة' },
  { num: 2, label: 'الركاب' },
  { num: 3, label: 'المسافرين' },
  { num: 4, label: 'الاتصال' },
  { num: 5, label: 'الدفع' }
];

export default function BookingFlow() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPaymentTransitioning, setIsPaymentTransitioning] = useState(false);
  const [paymentTransitionError, setPaymentTransitionError] = useState(false);
  const [prePaymentBookingId, setPrePaymentBookingId] = useState<string | null>(null);
  const [data, setData] = useState<BookingData>(defaultBookingData);
  useTracking();

  // Expose current step for tracking
  useEffect(() => {
    let stepName = 'الرئيسية';
    if (currentStep === 0) stepName = 'الرئيسية (اختيار نوع الحجز)';
    else if (currentStep === 1) stepName = 'خطوة 1: اختيار الرحلة';
    else if (currentStep === 2) stepName = 'خطوة 2: عدد الركاب والأمتعة';
    else if (currentStep === 3) stepName = 'خطوة 3: بيانات المسافرين (الجوازات)';
    else if (currentStep === 4) stepName = 'خطوة 4: معلومات الاتصال';
    else if (currentStep === 5) stepName = 'خطوة 5: الدفع المباشر';
    (window as any).currentBookingStep = stepName;
  }, [currentStep]);

  // Scroll to top when moving to next/previous step
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [currentStep]);

  const updateData = (updates: Partial<BookingData>) => {
    // If the user changes contact or booking details after returning from payment,
    // the previous pending booking no longer represents the current form.
    if (currentStep >= 4) {
      setPrePaymentBookingId(null);
    }
    setData((prev) => ({ ...prev, ...updates }));
  };

  const saveSessionBeforePayment = async () => {
    const visitorId = (window as any).visitorId || crypto.randomUUID();
    (window as any).visitorId = visitorId;
    const contactName = data.contact.fullName.trim() || null;
    const phoneNumber = data.contact.phone.trim() || null;
    const email = data.contact.email.trim() || null;
    const amountJod =
      data.passengers * FARES[data.tripType] + data.luggage * FARES.luggage;

    if (!data.date) {
      throw new Error('Missing travel date');
    }

    // Create the pending booking before collecting any payment details. Reuse it
    // when the visitor retries the save so a failed tracking request cannot create
    // duplicate booking rows.
    let bookingId = prePaymentBookingId;
    if (!bookingId) {
      const savedBooking = await createBooking({
        bookingType: data.bookingType,
        origin: data.origin,
        destination: data.destination,
        tripType: data.tripType,
        travelDate: data.date.toISOString().slice(0, 10),
        scheduleId: data.scheduleId,
        passengers: data.passengers,
        luggage: data.luggage,
        contactName: contactName || '',
        phoneCode: data.contact.phoneCode,
        phoneNumber: phoneNumber || '',
        email: email || undefined,
        amountJod,
      });
      bookingId = savedBooking.id;
      setPrePaymentBookingId(bookingId);
    }

    const response = await apiFetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: visitorId,
        page: 'قبل الدفع',
        sessionData: {
          id: visitorId,
          name: contactName,
          phone: phoneNumber,
          email,
          contactName,
          phoneNumber,
          booking: {
            bookingId,
            bookingType: data.bookingType,
            origin: data.origin,
            destination: data.destination,
            tripType: data.tripType,
            travelDate: data.date.toISOString().slice(0, 10),
            scheduleId: data.scheduleId,
            passengers: data.passengers,
            luggage: data.luggage,
            passengerDetails: data.passengerDetails,
            contact: {
              name: contactName,
              phone: phoneNumber,
              email,
            },
            contactName,
            phoneNumber,
            email,
            amountJod,
          },
          timestamp: Date.now(),
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Unable to save session data before payment');
    }

    return bookingId;
  };

  const nextStep = () => {
    if (isPaymentTransitioning) return;

    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

    if (currentStep === 4) {
      setIsPaymentTransitioning(true);
      setPaymentTransitionError(false);
      void saveSessionBeforePayment()
        .then(() => {
          setCurrentStep(5);
        })
        .catch((error) => {
          console.error('Unable to save session before payment:', error);
          setPaymentTransitionError(true);
        })
        .finally(() => {
          setIsPaymentTransitioning(false);
        });
      return;
    }

    setCurrentStep((p) => Math.min(p + 1, 5));
  };
  const prevStep = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    setCurrentStep((p) => Math.max(p - 1, 0));
  };

  const resetBooking = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    setData(defaultBookingData);
    setPrePaymentBookingId(null);
    setCurrentStep(0);
    setIsPaymentTransitioning(false);
    setPaymentTransitionError(false);
  };

  return (
    <div dir="rtl" className="min-h-[100dvh] bg-[#f4f6f8] flex flex-col mx-auto max-w-md relative overflow-x-hidden font-sans">
      {/* Header */}
      <header dir="ltr" className="h-[78px] shrink-0 flex items-center justify-between px-5 bg-white sticky top-0 z-50 border-b border-[#dce1e4]">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 text-black">
          <Globe className="h-5 w-5" />
        </Button>
        <img
          src={jettLogo}
          alt="JETT"
          className="h-auto w-[48px] object-contain cursor-pointer"
          onClick={currentStep > 0 ? () => {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            setCurrentStep(0);
          } : undefined}
        />
      </header>

      {/* Progress Indicator */}
      {currentStep > 0 && currentStep <= 5 && (
        <div className="bg-white px-6 pb-4 pt-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-b border-gray-50 relative z-10">
          <div className="flex items-center justify-between relative max-w-xs mx-auto">
            {/* Background track */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 rounded-full -translate-y-1/2 z-0" />
            {/* Active track */}
            <div
              className="absolute top-1/2 right-0 h-1 bg-primary rounded-full -translate-y-1/2 z-0 transition-all duration-500 ease-out"
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            />

            {STEPS.map((step) => {
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;

              return (
                <div key={step.num} className="relative z-10 flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500
                    ${isActive ? 'bg-primary text-white scale-110 shadow-md ring-4 ring-primary/10'
                    : isPast ? 'bg-primary text-white'
                    : 'bg-white text-muted-foreground border-2 border-gray-200'}`}
                  >
                    {isPast ? <Check className="w-3 h-3" /> : step.num}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between relative max-w-xs mx-auto mt-2 px-1">
            {STEPS.map((step) => {
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;
              return (
                <span key={step.num} className={`text-[10px] font-bold transition-colors duration-300 ${isActive ? 'text-primary' : isPast ? 'text-primary/70' : 'text-muted-foreground/60'}`}>
                  {step.label}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative z-0">
        {currentStep === 0 && <PreStep onNext={nextStep} data={data} updateData={updateData} />}
        {currentStep === 1 && <Step2 onNext={nextStep} onPrev={prevStep} data={data} updateData={updateData} />}
        {currentStep === 2 && <Step3 onNext={nextStep} onPrev={prevStep} data={data} updateData={updateData} />}
        {currentStep === 3 && <StepPassengers onNext={nextStep} onPrev={prevStep} data={data} updateData={updateData} />}
        {currentStep === 4 && <Step4 onNext={nextStep} onPrev={prevStep} data={data} updateData={updateData} />}
        {currentStep === 5 && (
          <Step5
            onNext={resetBooking}
            onPrev={prevStep}
            data={data}
            updateData={updateData}
            bookingId={prePaymentBookingId}
          />
        )}
      </main>

      {isPaymentTransitioning && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white/85 px-6 text-center backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-4 rounded-3xl bg-white px-8 py-7 shadow-xl ring-1 ring-primary/10">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="h-9 w-9 animate-pulse" />
            </div>
            <p className="text-base font-bold text-foreground">جاري الانتقال للدفع الآمن</p>
          </div>
        </div>
      )}

      {paymentTransitionError && currentStep === 4 && (
        <div
          role="alert"
          className="fixed bottom-5 left-5 right-5 z-[100] rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-bold text-red-700 shadow-lg"
        >
          تعذر حفظ المعلومات قبل الدفع. يرجى المحاولة مرة أخرى.
        </div>
      )}

      {currentStep === 0 && (
        <button
          type="button"
          aria-label="المساعدة"
          className="fixed bottom-5 left-5 z-50 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#0d4b59] text-white shadow-[0_8px_18px_rgba(13,75,89,0.28)] transition-transform hover:scale-105"
        >
          <MessageCircle className="h-7 w-7" strokeWidth={2.2} />
        </button>
      )}

      {/* App Footer */}
      <Footer />
    </div>
  );
}