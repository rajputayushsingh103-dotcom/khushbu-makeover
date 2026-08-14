import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';
import { SALON_INFO } from '../data/initialData';

interface LegalModalProps {
  type: 'terms' | 'privacy' | null;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-[#FAF7F5] dark:bg-[#1A1818] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E0A96D]/30 text-stone-900 dark:text-stone-100 my-8 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-stone-900 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-[#E0A96D]/15 flex items-center justify-center text-[#E0A96D]">
            {type === 'terms' ? <FileText className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">
              {type === 'terms' ? 'Terms & Conditions of Service' : 'Privacy & Client Data Policy'}
            </h3>
            <p className="text-xs text-stone-500">Khushboo Makeover • Updated 2026</p>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto pr-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed space-y-4 border-t border-b border-stone-200 dark:border-stone-800 py-4">
          {type === 'terms' ? (
            <>
              <p><strong>1. Appointment & Booking Policy:</strong> Bridal appointments must be booked in advance with a standard confirmation deposit. Slots for wedding dates are reserved on a first-come basis.</p>
              <p><strong>2. Punctuality & Studio Etiquette:</strong> Please arrive 15 minutes prior to scheduled session. For on-location destination bridal services, hospitality and well-lit vanity setup should be arranged as agreed.</p>
              <p><strong>3. Rescheduling & Cancellations:</strong> Free cancellations are allowed up to 72 hours prior to non-bridal salon visits. Wedding makeover reschedules depend on slot availability.</p>
              <p><strong>4. Skin & Allergy Disclosures:</strong> Clients are encouraged to disclose any dermatological allergies or sensitivities during consultation. We strictly utilize dermatologist-tested, hypoallergenic luxury products.</p>
              <p><strong>5. Photography Rights:</strong> Portfolio pictures taken during makeover sessions may be showcased in our gallery with client consent.</p>
            </>
          ) : (
            <>
              <p><strong>1. Information Collection:</strong> We collect client contact details (name, phone, email) solely for appointment scheduling, booking reminders, and personalized beauty recommendations.</p>
              <p><strong>2. Data Confidentiality:</strong> Your personal information is treated with highest confidentiality and is never sold or distributed to third-party marketing companies.</p>
              <p><strong>3. Communications:</strong> We send booking confirmation SMS/WhatsApp and occasional seasonal bridal privilege offers. You may opt out anytime by replying STOP.</p>
              <p><strong>4. Security:</strong> Our digital salon management systems maintain industry-standard SSL encryption and strict access protocols.</p>
            </>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#E0A96D] text-stone-950 font-bold text-xs"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
