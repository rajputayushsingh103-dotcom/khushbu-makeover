import { Service, Appointment, Review, GalleryItem, Offer, BlogPost, SalonInfo, AuthUser } from '../types';
import { INITIAL_SERVICES, INITIAL_REVIEWS, INITIAL_GALLERY, INITIAL_OFFERS, BLOG_POSTS, SALON_INFO } from '../data/initialData';

const APPOINTMENTS_KEY = 'km_appointments_storage';
const SERVICES_KEY = 'km_services_storage';
const REVIEWS_KEY = 'km_reviews_storage';
const GALLERY_KEY = 'km_gallery_storage';
const OFFERS_KEY = 'km_offers_storage';
const SALON_INFO_KEY = 'km_salon_info_storage';
const AUTH_USER_KEY = 'km_auth_user_session';
const REGISTERED_USERS_KEY = 'km_registered_users_db';

export const salonService = {
  // USER AUTHENTICATION & SESSIONS
  getAuthUser: (): AuthUser | null => {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return null;
  },

  saveAuthUser: (user: AuthUser): void => {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  },

  logoutAuthUser: (): void => {
    localStorage.removeItem(AUTH_USER_KEY);
  },

  loginWithGoogle: async (customProfile?: Partial<AuthUser>): Promise<AuthUser> => {
    // Direct 1-click Google Sign-In with realistic user profile simulation & persist
    const googleUser: AuthUser = {
      id: 'google-user-' + Math.random().toString(36).substring(2, 9),
      name: customProfile?.name || 'Aaradhya Sharma',
      email: customProfile?.email || 'aaradhya.sharma@gmail.com',
      phone: customProfile?.phone || '+91 98201 54321',
      photoUrl: customProfile?.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      provider: 'google',
      vipStatus: 'VIP Member',
      createdAt: new Date().toISOString()
    };
    salonService.saveAuthUser(googleUser);
    return googleUser;
  },

  loginWithEmail: async (email: string, pass: string): Promise<AuthUser> => {
    const trimmedEmail = email.trim().toLowerCase();
    const storedUsersJson = localStorage.getItem(REGISTERED_USERS_KEY);
    const users: Array<AuthUser & { password?: string }> = storedUsersJson ? JSON.parse(storedUsersJson) : [];

    const found = users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (found) {
      if (found.password && found.password !== pass) {
        throw new Error('Incorrect password. Please verify and try again.');
      }
      const authUser: AuthUser = {
        id: found.id,
        name: found.name,
        email: found.email,
        phone: found.phone,
        photoUrl: found.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(found.name)}`,
        provider: 'email',
        vipStatus: found.vipStatus || 'VIP Member',
        createdAt: found.createdAt
      };
      salonService.saveAuthUser(authUser);
      return authUser;
    }

    // If new email login, create automatic seamless profile
    const defaultName = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const newUser: AuthUser = {
      id: 'email-user-' + Date.now(),
      name: defaultName || 'Royal Guest',
      email: trimmedEmail,
      photoUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(defaultName)}`,
      provider: 'email',
      vipStatus: 'VIP Member',
      createdAt: new Date().toISOString()
    };

    users.push({ ...newUser, password: pass });
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    salonService.saveAuthUser(newUser);
    return newUser;
  },

  registerWithEmail: async (name: string, email: string, pass: string, phone?: string): Promise<AuthUser> => {
    const trimmedEmail = email.trim().toLowerCase();
    const storedUsersJson = localStorage.getItem(REGISTERED_USERS_KEY);
    const users: Array<AuthUser & { password?: string }> = storedUsersJson ? JSON.parse(storedUsersJson) : [];

    const existing = users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      throw new Error('An account with this email already exists. Please log in.');
    }

    const newUser: AuthUser = {
      id: 'email-user-' + Date.now(),
      name: name.trim() || 'Royal Guest',
      email: trimmedEmail,
      phone: phone?.trim() || '',
      photoUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      provider: 'email',
      vipStatus: 'VIP Member',
      createdAt: new Date().toISOString()
    };

    users.push({ ...newUser, password: pass });
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    salonService.saveAuthUser(newUser);
    return newUser;
  },
  // SALON INFO & LIVE SITE TEXT CONFIGURATION
  getSalonInfo: (): SalonInfo => {
    try {
      const stored = localStorage.getItem(SALON_INFO_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults in case of any new schema additions
        return {
          ...SALON_INFO,
          ...parsed,
          hours: { ...SALON_INFO.hours, ...(parsed.hours || {}) },
          stats: { ...SALON_INFO.stats, ...(parsed.stats || {}) },
          hero: { ...SALON_INFO.hero, ...(parsed.hero || {}) },
          about: { ...SALON_INFO.about, ...(parsed.about || {}) },
          payment: { ...SALON_INFO.payment, ...(parsed.payment || {}) },
          socials: { ...SALON_INFO.socials, ...(parsed.socials || {}) }
        };
      }
    } catch (e) {
      console.error(e);
    }
    return SALON_INFO;
  },

  saveSalonInfo: (info: SalonInfo): SalonInfo => {
    localStorage.setItem(SALON_INFO_KEY, JSON.stringify(info));
    return info;
  },

  resetSalonInfo: (): SalonInfo => {
    localStorage.removeItem(SALON_INFO_KEY);
    return SALON_INFO;
  },

  // SERVICES
  getServices: (): Service[] => {
    try {
      const stored = localStorage.getItem(SERVICES_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SERVICES;
  },

  saveServices: (services: Service[]) => {
    localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
  },

  addService: (service: Omit<Service, 'id'>): Service => {
    const services = salonService.getServices();
    const newService: Service = {
      ...service,
      id: 'svc-' + Date.now()
    };
    services.unshift(newService);
    salonService.saveServices(services);
    return newService;
  },

  updateService: (updated: Service): Service[] => {
    const services = salonService.getServices().map(s => s.id === updated.id ? updated : s);
    salonService.saveServices(services);
    return services;
  },

  updateServicePrice: (id: string, newPrice: number, originalPrice?: number): Service[] => {
    const services = salonService.getServices().map(s => {
      if (s.id === id) {
        return {
          ...s,
          price: Math.max(0, newPrice),
          originalPrice: originalPrice !== undefined ? originalPrice : s.originalPrice
        };
      }
      return s;
    });
    salonService.saveServices(services);
    return services;
  },

  bulkUpdatePrices: (category: string, percentageDelta: number): Service[] => {
    const services = salonService.getServices().map(s => {
      if (category === 'all' || s.category === category) {
        const currentPrice = s.price;
        const newPrice = Math.round((currentPrice * (1 + percentageDelta / 100)) / 100) * 100; // Round to nearest hundred
        return {
          ...s,
          originalPrice: s.originalPrice || currentPrice,
          price: Math.max(100, newPrice)
        };
      }
      return s;
    });
    salonService.saveServices(services);
    return services;
  },

  deleteService: (id: string): Service[] => {
    const services = salonService.getServices().filter(s => s.id !== id);
    salonService.saveServices(services);
    return services;
  },

  // APPOINTMENTS
  getAppointments: async (): Promise<Appointment[]> => {
    try {
      // First try fetching from API
      const res = await fetch('/api/appointments');
      if (res.ok) {
        const data = await res.json();
        if (data.appointments && data.appointments.length > 0) {
          localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(data.appointments));
          return data.appointments;
        }
      }
    } catch (e) {
      // Fallback to local
    }

    try {
      const stored = localStorage.getItem(APPOINTMENTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }

    // Default sample appointments for immediate demo richness in admin
    const defaultAppointments: Appointment[] = [
      {
        id: 'apt-1',
        bookingCode: 'KM-842109',
        name: 'Ananya Deshpande',
        phone: '+91 98201 12345',
        email: 'ananya.d@gmail.com',
        serviceId: 'bridal-makeup-royal',
        serviceName: 'Signature Royal Bridal Makeup',
        servicePrice: 24999,
        date: '2026-08-20',
        timeSlot: '10:00 AM - 1:00 PM',
        stylist: 'Khushboo Sharma (Lead Master Artist)',
        addons: ['Airbrush Base Shield', '3D Silk Lashes', 'Dupatta Draping'],
        totalPrice: 24999,
        message: 'Wedding ceremony at Taj Lands End. Need early morning start.',
        status: 'confirmed',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      {
        id: 'apt-2',
        bookingCode: 'KM-729401',
        name: 'Ishita Sen',
        phone: '+91 97110 54321',
        email: 'ishita.sen@yahoo.com',
        serviceId: 'hydrafacial-diamond-glow',
        serviceName: 'HydraFacial MD® Diamond Glow Infusion',
        servicePrice: 6499,
        date: '2026-08-16',
        timeSlot: '3:00 PM - 4:00 PM',
        stylist: 'Aisha Khan (Lead Aesthetician)',
        totalPrice: 6499,
        message: 'Pre-event glow facial before friend s engagement.',
        status: 'confirmed',
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
      },
      {
        id: 'apt-3',
        bookingCode: 'KM-615820',
        name: 'Ritika Singhal',
        phone: '+91 98822 99887',
        email: 'ritika.s@outlook.com',
        serviceId: 'keratin-treatment-brazilian',
        serviceName: 'Brazilian Keratin Gold Smoothing Treatment',
        servicePrice: 8999,
        date: '2026-08-18',
        timeSlot: '11:30 AM - 2:30 PM',
        stylist: 'Priya Mehra (Senior Hair Director)',
        totalPrice: 8999,
        message: 'Very frizzy long hair, want long-lasting smoothening.',
        status: 'pending',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
      }
    ];
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(defaultAppointments));
    return defaultAppointments;
  },

  createAppointment: async (appointmentData: Omit<Appointment, 'id' | 'bookingCode' | 'createdAt' | 'status'>): Promise<Appointment> => {
    const bookingCode = 'KM-' + Math.floor(100000 + Math.random() * 900000);
    const newAppointment: Appointment = {
      ...appointmentData,
      id: 'apt-' + Date.now(),
      bookingCode,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    try {
      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppointment)
      });
    } catch (e) {
      console.warn('API post failed, saving locally:', e);
    }

    const current = await salonService.getAppointments();
    const updated = [newAppointment, ...current];
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
    return newAppointment;
  },

  updateAppointmentStatus: async (id: string, status: Appointment['status']): Promise<Appointment[]> => {
    try {
      await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (e) {}

    const appointments = await salonService.getAppointments();
    const updated = appointments.map(a => (a.id === id || a.bookingCode === id) ? { ...a, status } : a);
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
    return updated;
  },

  deleteAppointment: async (id: string): Promise<Appointment[]> => {
    try {
      await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
    } catch (e) {}

    const appointments = await salonService.getAppointments();
    const updated = appointments.filter(a => a.id !== id && a.bookingCode !== id);
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
    return updated;
  },

  // REVIEWS
  getReviews: (): Review[] => {
    try {
      const stored = localStorage.getItem(REVIEWS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_REVIEWS;
  },

  addReview: (review: Omit<Review, 'id' | 'date' | 'likes' | 'verified'>): Review => {
    const reviews = salonService.getReviews();
    const newReview: Review = {
      ...review,
      id: 'rev-' + Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      likes: 1,
      verified: true,
      isFeatured: false
    };
    reviews.unshift(newReview);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    return newReview;
  },

  likeReview: (id: string): Review[] => {
    const reviews = salonService.getReviews().map(r => r.id === id ? { ...r, likes: r.likes + 1 } : r);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    return reviews;
  },

  deleteReview: (id: string): Review[] => {
    const reviews = salonService.getReviews().filter(r => r.id !== id);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    return reviews;
  },

  // GALLERY
  getGallery: (): GalleryItem[] => {
    try {
      const stored = localStorage.getItem(GALLERY_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return INITIAL_GALLERY;
  },

  addGalleryItem: (item: Omit<GalleryItem, 'id'>): GalleryItem => {
    const gallery = salonService.getGallery();
    const newItem: GalleryItem = {
      ...item,
      id: 'gal-' + Date.now()
    };
    gallery.unshift(newItem);
    localStorage.setItem(GALLERY_KEY, JSON.stringify(gallery));
    return newItem;
  },

  deleteGalleryItem: (id: string): GalleryItem[] => {
    const gallery = salonService.getGallery().filter(g => g.id !== id);
    localStorage.setItem(GALLERY_KEY, JSON.stringify(gallery));
    return gallery;
  },

  // OFFERS
  getOffers: (): Offer[] => {
    try {
      const stored = localStorage.getItem(OFFERS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return INITIAL_OFFERS;
  },

  saveOffers: (offers: Offer[]) => {
    localStorage.setItem(OFFERS_KEY, JSON.stringify(offers));
  },

  toggleOfferActive: (id: string): Offer[] => {
    const offers = salonService.getOffers().map(o => o.id === id ? { ...o, isActive: !o.isActive } : o);
    salonService.saveOffers(offers);
    return offers;
  },

  // BLOGS
  getBlogs: (): BlogPost[] => {
    return BLOG_POSTS;
  }
};
