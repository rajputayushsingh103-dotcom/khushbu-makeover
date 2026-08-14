export type ServiceCategory = 'bridal' | 'hd-makeup' | 'hair' | 'skin' | 'nails' | 'mehendi' | 'packages';

export interface Service {
  id: string;
  title: string;
  category: ServiceCategory;
  categoryLabel: string;
  description: string;
  longDescription?: string;
  duration: string;
  price: number;
  originalPrice?: number;
  image: string;
  benefits: string[];
  productsUsed: string[];
  isPopular?: boolean;
  isFeatured?: boolean;
  tag?: string;
}

export interface Appointment {
  id: string;
  bookingCode: string;
  name: string;
  phone: string;
  email: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  date: string;
  timeSlot: string;
  stylist?: string;
  addons?: string[];
  totalPrice: number;
  paymentOption?: 'token_10_percent' | 'full_payment' | 'pay_at_salon';
  advancePaid?: number;
  remainingDue?: number;
  paymentRef?: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Review {
  id: string;
  name: string;
  avatar?: string;
  city?: string;
  rating: number;
  date: string;
  service: string;
  comment: string;
  verified: boolean;
  isFeatured?: boolean;
  likes: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'all' | 'bridal' | 'hd-makeup' | 'hair' | 'skin' | 'nail-art' | 'mehendi' | 'salon';
  image: string;
  beforeImage?: string;
  afterImage?: string;
  isVideo?: boolean;
  videoUrl?: string;
  description?: string;
  tag?: string;
}

export interface Offer {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  discountPercentage?: number;
  discountAmount?: number;
  minBookingValue?: number;
  validTill: string;
  badge: string;
  image: string;
  servicesIncluded: string[];
  terms: string[];
  isActive: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  experience: string;
  image: string;
  bio: string;
  specialties: string[];
  rating: number;
  reviewsCount: number;
  instagram?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
  tags: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'bridal' | 'hair-skin' | 'booking';
}

export interface SalonAddress {
  street?: string;
  landmark?: string;
  city?: string;
  state?: string;
  pincode?: string;
  timings?: string;
  googleMapsUrl?: string;
  mapEmbedUrl?: string;
}

export interface SalonInfo {
  name: string;
  tagline?: string;
  founder: string;
  founderTitle?: string;
  founderBio?: string;
  founderImage?: string;
  phone: string;
  phoneAlt?: string;
  whatsapp: string;
  email?: string;
  // Address & Location Details (supports structured object or flat string)
  address: SalonAddress & any;
  landmark?: string;
  city?: string;
  state?: string;
  pincode?: string;
  directionsNote?: string;
  googleMapsUrl?: string;
  googleMapsEmbedUrl?: string;
  // Quick payment / prebooking fields
  upiId?: string;
  depositPercentage?: number;
  qrCodeUrl?: string;
  // Operating Hours
  hours?: {
    weekdays?: string;
    weekends?: string;
    bridal?: string;
  };
  // Stats
  stats?: {
    bridesCount?: string;
    yearsExperience?: string;
    rating?: string;
    awards?: string;
    stylists?: string;
  };
  // Hero texts
  hero?: {
    badgeText?: string;
    headlineLine1?: string;
    headlineLine2?: string;
    subheadline?: string;
    backgroundImage?: string;
    primaryCtaText?: string;
    secondaryCtaText?: string;
  };
  // About texts
  about?: {
    storyP1?: string;
    storyP2?: string;
    mission?: string;
    vision?: string;
  };
  // Payment & Pre-booking config
  payment?: {
    tokenPercentage?: number;
    upiId?: string;
    payeeName?: string;
    qrCodeUrl?: string;
  };
  // Socials
  socials?: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photoUrl?: string;
  provider: 'google' | 'email';
  createdAt: string;
  vipStatus?: 'VIP Member' | 'Gold VIP' | 'Royal Platinum';
}

export type PageView = 'home' | 'about' | 'services' | 'gallery' | 'reviews' | 'offers' | 'blog' | 'contact' | 'admin' | 'login' | 'profile';
