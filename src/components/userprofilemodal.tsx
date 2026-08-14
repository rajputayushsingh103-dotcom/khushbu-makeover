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
}

interface Props {
  user: { name: string; email: string; picture: string };
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const UserProfileModal: React.FC<Props> = ({ user, isOpen, onClose, onLogout }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user.email) {
      setLoading(true);
      fetch(`/api/user/appointments?email=${encodeURIComponent(user.email)}`)
        .then((res) => {
          if (!res.ok) {
            // Fallback: If specific endpoint not available, fetch all and filter
            return fetch('/api/appointments')
              .then((r) => r.json())
              .then((data) => ({
                appointments: (data.appointments || []).filter(
                  (a: any) => a.email && a.email.toLowerCase() === user.email.toLowerCase()
                )
              }));
          }
          return res.json();
        })
        .then((data) => {
          setAppointments(data.appointments || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error loading bookings:", err);
          setLoading(false);
        });
    }
  }, [isOpen, user.email]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#FAF7F5] dark:bg-[#1A1819] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E0A96D]/30 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header with User Info */}
        <div className="p-6 bg-gradient-to-r from-[#E0A96D]/20 via-[#B76E79]/15 to-transparent border-b border-[#E0A96D]/20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={user.picture}
              alt={user.name}
              className="w-14 h-14 rounded-full border-2 border-[#E0A96D] shadow-md object-cover"
            />
            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-[#FBF7F5]">
                {user.name}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400">{user.email}</p>
              <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-semibold bg-[#E0A96D]/20 text-[#8C5E35] dark:text-[#E0A96D] px-2.5 py-0.5 rounded-full border border-[#E0A96D]/30">
                ⭐ Verified VIP Client
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-200/60 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white flex items-center justify-center font-bold text-lg transition-all"
          >
            ✕
          </button>
        </div>

        {/* Bookings List Section */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#8C5E35] dark:text-[#E0A96D]">
              Aapki Booking History ({appointments.length})
            </h4>
          </div>

          {loading ? (
            <div className="py-12 text-center text-stone-400 text-sm animate-pulse">
              Bookings load ho rahi hain...
            </div>
          ) : appointments.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-[#E0A96D]/15 flex items-center justify-center mx-auto mb-3 text-xl">
                📅
              </div>
              <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                Aapne abhi tak koi appointment book nahi kiya hai.
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Apni pasandeeda salon service book karein aur yahan track karein!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((apt) => (
                <div
                  key={apt.id || apt.bookingCode}
                  className="p-4 rounded-2xl bg-white dark:bg-[#232021] border border-stone-200 dark:border-stone-800 hover:border-[#E0A96D]/50 transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-3 shadow-sm"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#B76E79] dark:text-[#E0A96D]">
                        #{apt.bookingCode}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                        apt.status === 'confirmed' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' 
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {apt.status || 'Confirmed'}
                      </span>
                    </div>
                    <h5 className="font-semibold text-stone-900 dark:text-white mt-1 text-sm sm:text-base">
                      {apt.serviceName}
                    </h5>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                      📅 {apt.date} &nbsp;•&nbsp; ⏰ {apt.timeSlot}
                    </p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      Master Artist: {apt.stylist || 'Khushboo Sharma'}
                    </p>
                  </div>

                  <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100 dark:border-stone-800">
                    <div className="text-base font-bold text-stone-900 dark:text-white">
                      ₹{(apt.totalPrice || apt.servicePrice || 0).toLocaleString()}
                    </div>
                    <span className="text-[10px] text-stone-400">
                      {apt.createdAt ? `Booked on: ${new Date(apt.createdAt).toLocaleDateString()}` : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Logout and Close */}
        <div className="p-4 bg-stone-100/60 dark:bg-[#141213] border-t border-stone-200 dark:border-stone-800 flex justify-between items-center">
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="text-xs font-semibold text-red-500 hover:text-red-600 hover:underline"
          >
            Logout Karein
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 text-xs font-semibold bg-stone-900 text-white dark:bg-[#E0A96D] dark:text-[#1A1818] rounded-full hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};