import React, { useEffect, useState } from 'react';

interface Appointment {
  id: string;
  bookingCode: string;
  serviceName: string;
  servicePrice: number;
  totalPrice: number;
  date: string;
  timeSlot: string;
  stylist: string;
  status: string;
  createdAt: string;
  advancePaid?: number;
  remainingDue?: number;
  paymentOption?: string;
  email?: string;
  phone?: string;
  name?: string;
  userId?: string;
}

interface Props {
  user: { name: string; email: string; picture?: string; phone?: string; id?: string };
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const UserProfileModal: React.FC<Props> = ({ user, isOpen, onClose, onLogout }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // 🌟 Function to load bookings from LocalStorage and API
  const loadUserAppointments = async () => {
    setLoading(true);

    try {
      // 1. LocalStorage se saari bookings nikaalein
      const localBookings: any[] = JSON.parse(
        localStorage.getItem('km_bookings') ||
        localStorage.getItem('salon_appointments') ||
        '[]'
      );

      // 2. User Specific bookings bhi check karein
      const userKey = user.id ? `km_bookings_${user.id}` : '';
      const userSpecificBookings: any[] = userKey
        ? JSON.parse(localStorage.getItem(userKey) || '[]')
        : [];

      // Combine local bookings
      let allCombined = [...userSpecificBookings, ...localBookings];

      // 3. Backend API se bhi fetch karein (agar backend chal raha ho)
      try {
        if (user.email) {
          const res = await fetch(`/api/user/appointments?email=${encodeURIComponent(user.email)}`);
          if (res.ok) {
            const apiData = await res.json();
            if (apiData.appointments && Array.isArray(apiData.appointments)) {
              allCombined = [...apiData.appointments, ...allCombined];
            }
          }
        }
      } catch (apiErr) {
        // Backend API offline hai toh local data chalega
        console.log("Using offline local bookings data");
      }

      // 4. Duplicate bookings remove karein (by ID or bookingCode)
      const uniqueBookingsMap = new Map();
      allCombined.forEach((item) => {
        const key = item.bookingCode || item.id;
        if (key && !uniqueBookingsMap.has(key)) {
          uniqueBookingsMap.set(key, item);
        }
      });
      const uniqueList = Array.from(uniqueBookingsMap.values());

      // 5. Logged-in User ke sath Match karein (Email, Phone, Name ya UserID)
      const matched = uniqueList.filter((apt: any) => {
        // Email match
        const matchEmail = user.email && apt.email && 
          apt.email.trim().toLowerCase() === user.email.trim().toLowerCase();
        
        // Phone match
        const cleanUserPhone = (user.phone || '').replace(/\D/g, '');
        const cleanAptPhone = (apt.phone || '').replace(/\D/g, '');
        const matchPhone = cleanUserPhone && cleanAptPhone && 
          (cleanUserPhone.includes(cleanAptPhone) || cleanAptPhone.includes(cleanUserPhone));

        // Name match (fallback)
        const matchName = user.name && apt.name && 
          apt.name.trim().toLowerCase() === user.name.trim().toLowerCase();

        // User ID match
        const matchId = user.id && apt.userId && apt.userId === user.id;

        return matchEmail || matchPhone || matchName || matchId;
      });

      // Agar filter match ho toh wo dikhayein, varna device ki saari recent bookings dikhayein
      setAppointments(matched.length > 0 ? matched : uniqueList);
    } catch (error) {
      console.error("Error loading appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadUserAppointments();
    }

    // Real-time listener for instant update on new booking
    const handleStorageChange = () => {
      loadUserAppointments();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('bookingUpdated', handleStorageChange);
    window.addEventListener('appointmentCreated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bookingUpdated', handleStorageChange);
      window.removeEventListener('appointmentCreated', handleStorageChange);
    };
  }, [isOpen, user.email, user.phone, user.name]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-[#FAF7F5] dark:bg-[#1A1819] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E0A96D]/30 overflow-hidden flex flex-col max-h-[90vh] text-stone-900 dark:text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header with User Info */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#241B1C] via-[#332224] to-[#1F1819] text-white border-b border-[#E0A96D]/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {user.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-full border-2 border-[#E0A96D] shadow-md object-cover"
              />
            ) : (
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#E0A96D]/20 border-2 border-[#E0A96D] flex items-center justify-center font-bold text-xl text-[#E0A96D] font-serif">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-serif">
                {user.name || 'VIP Client'}
              </h3>
              <p className="text-xs text-stone-300">{user.email || user.phone || 'Verified Account'}</p>
              <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-semibold bg-[#E0A96D]/20 text-[#E0A96D] px-2.5 py-0.5 rounded-full border border-[#E0A96D]/30">
                ⭐ Verified VIP Member
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center font-bold text-base transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Bookings List Section */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#8C5E35] dark:text-[#E0A96D]">
              Aapki Booked Appointments ({appointments.length})
            </h4>
          </div>

          {loading ? (
            <div className="py-12 text-center text-stone-400 text-xs sm:text-sm animate-pulse">
              Bookings load ho rahi hain...
            </div>
          ) : appointments.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-[#E0A96D]/15 flex items-center justify-center mx-auto text-2xl">
                📅
              </div>
              <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                Abhi tak koi appointment book nahi hui hai.
              </p>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Apni pasandeeda service book karein, booking confirm hote hi uski receipt yahan dikhai degi!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((apt) => (
                <div
                  key={apt.id || apt.bookingCode}
                  className="p-4 rounded-2xl bg-white dark:bg-[#232021] border border-stone-200 dark:border-stone-800 hover:border-[#E0A96D]/50 transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-3 shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-[#8C5E35] dark:text-[#E0A96D] px-2 py-0.5 rounded bg-[#E0A96D]/15">
                        #{apt.bookingCode || apt.id?.slice(-6)}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        {apt.status || 'Confirmed'}
                      </span>
                    </div>

                    <h5 className="font-serif font-bold text-stone-900 dark:text-white text-base">
                      {apt.serviceName}
                    </h5>

                    <p className="text-xs text-stone-600 dark:text-stone-300">
                      📅 <strong>Date:</strong> {apt.date} &nbsp;•&nbsp; ⏰ <strong>Time:</strong> {apt.timeSlot}
                    </p>

                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Artist: {apt.stylist || "Khushbu's Makeover"}
                    </p>
                  </div>

                  <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100 dark:border-stone-800">
                    <span className="text-[10px] text-stone-400 block uppercase">
                      {apt.paymentOption === 'token_10_percent' ? '10% Advance Token Paid' : 'Total Amount'}
                    </span>
                    <div className="text-base font-serif font-bold text-[#8C5E35] dark:text-[#E0A96D]">
                      ₹{(apt.advancePaid || apt.totalPrice || apt.servicePrice || 0).toLocaleString()}
                    </div>
                    {apt.paymentOption === 'token_10_percent' && apt.remainingDue && (
                      <span className="text-[10px] text-stone-500 block">
                        Due at Studio: ₹{apt.remainingDue.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Logout and Close */}
        <div className="p-4 bg-stone-100 dark:bg-[#141213] border-t border-stone-200 dark:border-stone-800 flex justify-between items-center">
          <button
            type="button"
            onClick={() => {
              onLogout();
              onClose();
              window.location.reload(); 
            }}
            className="text-xs font-semibold text-red-500 hover:text-red-600 hover:underline cursor-pointer"
          >
            Logout Karein
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-xs font-bold bg-stone-900 text-white dark:bg-[#E0A96D] dark:text-[#1A1818] rounded-full hover:opacity-90 transition-opacity cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};