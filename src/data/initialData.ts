import { Service, Review, GalleryItem, Offer, TeamMember, BlogPost, FAQItem, SalonInfo } from '../types';

export const SALON_INFO: SalonInfo = {
  name: "Khushbu's Makeover",
  tagline: 'Luxury Salon & Bridal Artistry Studio',
  founder: 'Khushboo Singh',
  founderTitle: 'Celebrity Makeup Artist & Creative Director',
  founderBio: 'Over 15+ years perfecting bespoke bridal, HD airbrush, and celebrity red carpet artistry.',
  founderImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80',
  phone: '+91 8382088707',
  phoneAlt: '+91 8382088707',
  whatsapp: '+91 8382088707',
  email: 'appointments@khushboomakeover.com',
  // 📍 Updated Official Studio Address
  address: 'Near Dolphin Public School, VILLAGE CHHEETPUR, POST, Dileeppur, Cheetpur, Uttar Pradesh 230127, India',
  landmark: 'Near Dolphin Public School',
  city: 'Cheetpur, Dileeppur',
  state: 'Uttar Pradesh',
  pincode: '230127',
  directionsNote: 'Located near Dolphin Public School, Village Chheetpur, Dileeppur, Uttar Pradesh.',
  googleMapsUrl: 'https://maps.google.com/?q=Dileeppur+Cheetpur+Uttar+Pradesh+230127',
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115000.0!2d81.9!3d25.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDU0JzAwLjAiTiA4McKwNTQnMDAuMCJF!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin',
  // Operating Hours
  hours: {
    weekdays: '9:30 AM – 8:30 PM (Mon – Sat)',
    weekends: '9:00 AM – 9:00 PM (Sun)',
    bridal: '24/7 By Prior VIP Booking'
  },
  // Key Stats
  stats: {
    bridesCount: '12,500+',
    yearsExperience: '15+',
    rating: '4.98',
    awards: '24+',
    stylists: '20+'
  },
  // Hero texts
  hero: {
    badgeText: "Uttar Pradesh's Award-Winning Bridal Studio 2026",
    headlineLine1: 'Where Every Bride',
    headlineLine2: 'Becomes Royalty',
    subheadline: "Elevate your wedding & celebration glamour with master artist Khushboo. Experience bespoke HD Airbrush makeup, HydraFacial, Kaveri Mehendi, and luxury hair transformations in private VIP suites.",
    backgroundImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=2000&q=85',
    primaryCtaText: 'Reserve Appointment',
    secondaryCtaText: 'AI Bridal Stylist'
  },
  // About texts
  about: {
    storyP1: "At Khushbu's Makeover, we believe every woman possesses a distinctive radiance. Our mission is not to mask your features, but to sculpt, illuminate, and celebrate your natural beauty with world-class artistry and supreme dermatological care.",
    storyP2: 'From our private bridal dressing sanctuaries to our clinical HydraFacial suites, every touchpoint is designed to deliver absolute relaxation, hygiene, and imperial luxury.',
    mission: 'To deliver flawless, confidence-boosting bridal artistry and aesthetic therapies with zero-compromise hygiene and top global cosmetic brands.',
    vision: 'To be the recognized benchmark for imperial bridal makeovers, luxury hair transformations, and holistic aesthetic wellness.'
  },
  // Payment & Pre-booking config
  payment: {
    tokenPercentage: 10,
    upiId: 'ayush6242@ptyes',
    payeeName: "Khushbu's Makeover Studio"
  },
  // Socials
  socials: {
    instagram: 'https://instagram.com/khushboomakeover',
    facebook: 'https://facebook.com/khushboomakeover',
    youtube: 'https://youtube.com/@khushboomakeover'
  }
};

// 🌸 ALL 14 SERVICES FULLY CONFIGURED
export const INITIAL_SERVICES: Service[] = [
  {
    id: 'bridal-makeup',
    title: 'Bridal Makeup',
    category: 'bridal',
    categoryLabel: 'Bridal Artistry',
    description: 'Complete royal bridal makeover with HD Airbrush, lashes, jewelry setting, and bridal dupatta drapery.',
    longDescription: "Our signature bridal package. Includes pre-makeup skin prep, waterproof 24-hour HD base, 3D mink eyelashes, customized bridal hair styling, jewelry placement, and premium dupatta draping.",
    duration: '180 mins',
    price: 14999,
    originalPrice: 18000,
    image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=80',
    benefits: ['24-Hour Waterproof Stay', 'Airbrush HD Flawless Base', 'Complete Hair Styling & Dupatta Draping', 'Complimentary Touch-up Kit'],
    productsUsed: ['Huda Beauty', 'MAC', 'Charlotte Tilbury', 'Dior Backstage', 'NARS', 'Estée Lauder'],
    isPopular: true,
    isFeatured: true,
    tag: 'Bestseller'
  },
  {
    id: 'party-makeup',
    title: 'Party Makeup',
    category: 'hd-makeup',
    categoryLabel: 'Party & Glam',
    description: 'Glamorous party, engagement & reception makeup with HD finish, hairstyling, and eye aesthetics.',
    longDescription: 'Look stunning at any celebration with luminous foundation, tailored smoky or shimmer eye makeup, brow sculpting, and elegant curls or blowout styling.',
    duration: '90 mins',
    price: 2499,
    originalPrice: 3500,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=80',
    benefits: ['12-Hour Fresh Hold', 'Customized Eye Styling', 'Blowdry & Curls Styling', 'Lightweight Feel'],
    productsUsed: ['Kryolan Professional', 'MAC', 'Benefit Cosmetics', 'Rare Beauty'],
    isPopular: true,
    isFeatured: true,
    tag: 'Trending'
  },
  {
    id: 'hydra-facial',
    title: 'Hydra Facial',
    category: 'skin',
    categoryLabel: 'Skin & Aesthetics',
    description: 'Medical-grade vortex exfoliation, painless blackhead extraction, and hyaluronic acid peptide serum infusion.',
    longDescription: 'The ultimate skin rejuvenation therapy. Cleanses clogged pores, removes dead skin cells, extracts deep blackheads, and deeply infuses antioxidants and collagen serums for instant glass skin.',
    duration: '60 mins',
    price: 2999,
    originalPrice: 4500,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80',
    benefits: ['Instant Pore Tightening & Glow', 'Zero Redness or Downtime', 'Deep Blackhead/Whitehead Extraction', 'Custom Vitamin & Peptide Infusion'],
    productsUsed: ['HydraFacial MD Serums', 'Dermalogica Pro', 'SkinCeuticals', 'Casmara Algae Mask'],
    isPopular: true,
    isFeatured: true,
    tag: 'Celebrity Choice'
  },
 {
    id: 'customized-facial',
    title: 'Customized Facial',
    category: 'skin',
    categoryLabel: 'Skin Care',
    description: 'Tailored skin rejuvenation treatment based on your skin type for anti-tan, acne control, or radiant glow.',
    longDescription: 'Customized deep cleansing facial addressing your specific skin concerns—acne, tanning, dark spots, or dryness. Includes face massage, herbal steam, gentle exfoliation, and custom soothing face pack.',
    duration: '60 mins',
    price: 1499,
    originalPrice: 2000,
    // 🌟 100% Verified, Instant Loading Facial Treatment Image
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
    benefits: ['Personalized to Your Skin Type', 'Removes Tanning & Dullness', 'Soothing Lymphatic Massage', 'Deep Hydration & Glow'],
    productsUsed: ['O3+ Bridal Pro Matrix', 'Lotus Professional', 'VLCC Gold', 'Cheryls Cosmeceuticals'],
    isFeatured: true
  },
  {
    id: 'hair-cut-styling',
    title: 'Hair Cut & Styling',
    category: 'hair',
    categoryLabel: 'Hair Styling',
    description: 'Trendsetting modern haircuts (Layer, Feather, Bob, Advance Styling) with professional blow-dry.',
    longDescription: 'Transform your look with precision haircutting tailored to your face shape. Includes refreshing hair wash, conditioning, advance cutting, and bouncy blow-dry styling.',
    duration: '45 mins',
    price: 499,
    originalPrice: 800,
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1000&q=80',
    benefits: ['Personalized Face-Framing Cut', 'Includes Wash & Conditioning', 'Professional Volume Blow-dry', 'Split-ends Removal'],
    productsUsed: ['L\'Oréal Professionnel', 'Schwarzkopf', 'Moroccanoil'],
    isPopular: true
  },
  {
    id: 'hair-spa-treatment',
    title: 'Hair Spa & Treatment',
    category: 'hair',
    categoryLabel: 'Hair Therapy',
    description: 'Deep nourishing hair spa with scalp massage, steam, and intense damage & dandruff repair therapy.',
    longDescription: 'Revitalize dull, frizzy, and damaged hair with deep conditioning cream baths, scalp stimulation, ozone steam infusion, and relaxing neck & shoulder massage.',
    duration: '60 mins',
    price: 1299,
    originalPrice: 1800,
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1000&q=80',
    benefits: ['Scalp Detox & Dandruff Control', 'Deep Relaxation Massage', 'Micro-Mist Steam Infusion', 'Silky Smooth Hair Texture'],
    productsUsed: ['L\'Oréal Mythic Oil', 'Matrix Biolage', 'Schwarzkopf Bonacure', 'Kérastase'],
    isPopular: true
  },
  {
    id: 'hair-colour',
    title: 'Hair Colour',
    category: 'hair',
    categoryLabel: 'Hair Color',
    description: 'Global hair color, Balayage, Highlights, and root touch-up with ammonia-free premium shades.',
    longDescription: 'Expert hair coloring customized to your skin tone. From rich chocolate brown, burgundy, and caramel balayage to full gray coverage using bond-protecting safe formulas.',
    duration: '120 mins',
    price: 1999,
    originalPrice: 3000,
    image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=1000&q=80',
    benefits: ['100% Gray Coverage', 'Ammonia-Free Safe Colors', 'Rich Long-Lasting Gloss', 'Bond Protection Included'],
    productsUsed: ['L\'Oréal Inoa Ammonia-Free', 'Matrix Socolor', 'Wella Koleston', 'Schwarzkopf Igora'],
    isFeatured: true
  },
  {
    id: 'manicure-pedicure',
    title: 'Manicure + Pedicure',
    category: 'spa',
    categoryLabel: 'Hand & Foot Spa',
    description: 'Luxury hand & foot spa with exfoliating scrub, cuticle care, relaxing massage, and nail polish.',
    longDescription: 'Pamper your hands and feet with warm soothing soak, dead skin removal, heel smoothening, exfoliating scrub, deeply moisturizing massage cream, and fresh nail enamel.',
    duration: '75 mins',
    price: 999,
    originalPrice: 1500,
    image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1000&q=80',
    benefits: ['Cracked Heel Softening', 'Dead Skin Exfoliation', 'Relaxes Tired Feet & Hands', 'Clean Cuticles & Shiny Nails'],
    productsUsed: ['OPI Professional', 'VLCC Pediglow', 'Sara Beauty', 'Colorbar Polish']
  },
  {
    id: 'nail-art',
    title: 'Nail Art',
    category: 'spa',
    categoryLabel: 'Nail Studio',
    description: 'Gel nail extensions, chrome nails, 3D bridal nail art, glitter ombré, and French tips.',
    longDescription: 'Custom sculpted gel or acrylic nail extensions embellished with stones, glitter ombré, French tips, and stylish nail designs lasting up to 4 weeks.',
    duration: '45 mins',
    price: 799,
    originalPrice: 1200,
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1000&q=80',
    benefits: ['Long-Lasting Chip-Resistant Gel', 'Custom Stone & Glitter Designs', 'High Gloss Mirror Finish', 'Strengthens Natural Nails'],
    productsUsed: ['OPI GelColor', 'Gelish Harmony', 'Bluesky Gel', 'CND Shellac']
  },
  {
    id: 'bleach-dtan',
    title: 'Bleach + D-Tan',
    category: 'skin',
    categoryLabel: 'Skin Brightening',
    description: 'Instant sun-tan removal and skin brightening with mild herbal bleach & d-tan pack.',
    longDescription: 'Effectively clears stubborn outdoor sun tanning, lightens facial hair to match skin tone, and deeply refreshes face and neck with active de-tan clay packs.',
    duration: '40 mins',
    price: 699,
    originalPrice: 1000,
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1000&q=80',
    benefits: ['Instant Tan Removal', 'Skin Brightening & Glow', 'Herbal & Safe Formula', 'Evens Out Skin Tone'],
    productsUsed: ['O3+ D-Tan Pack', 'OxyGlow Herbal Bleach', 'Cheryls Tan Clear']
  },
  {
    id: 'waxing',
    title: 'Waxing',
    category: 'skin',
    categoryLabel: 'Body Care',
    description: 'Hygienic Full Body / Arms / Legs waxing with premium Rica & Honey wax for smooth, silky skin.',
    longDescription: 'Gentle, pain-minimized waxing using disposable strips and nourishing pre/post-wax oils. Removes unwanted hair from roots, leaving skin hair-free for 3 to 4 weeks.',
    duration: '45 mins',
    price: 599,
    originalPrice: 900,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
    benefits: ['Hygienic Disposable Strips', 'Smooth Hair-Free Skin for 3-4 Weeks', 'Less Pain with Premium Wax', 'Post-Wax Soothing Oil'],
    productsUsed: ['Rica Liposoluble Wax', 'Honey Herbal Wax', 'Aloe Vera Soothing Gel']
  },
  {
    id: 'threading',
    title: 'Threading',
    category: 'skin',
    categoryLabel: 'Facial Grooming',
    description: 'Precision eyebrow shaping, upper lip, forehead, and full-face threading with minimal pain.',
    longDescription: 'Expert eyebrow architecture and facial hair removal using 100% sanitized cotton thread and cooling astringent soothing lotion.',
    duration: '15 mins',
    price: 99,
    originalPrice: 150,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80',
    benefits: ['Sharp Precision Brow Arch', 'Fast & Minimal Pain', '100% Hygienic Cotton Thread', 'Includes Soothing Gel'],
    productsUsed: ['Organic Cotton Thread', 'Ayur Astringent', 'Rose Water Toner']
  },
  {
    id: 'mehendi-kaveri',
    title: 'Mehendi (Kaveri)',
    category: 'mehendi',
    categoryLabel: 'Mehendi Studio',
    description: 'Exquisite bridal & festive Kaveri organic henna designs with dark, long-lasting rich stain.',
    longDescription: 'Handcrafted floral, Arabic, bridal figures, and traditional Indian mehendi patterns applied with fresh organic Kaveri henna cones with guaranteed dark mahogany color.',
    duration: '90 mins',
    price: 1499,
    originalPrice: 2000,
    image: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&w=1000&q=80',
    benefits: ['100% Pure Kaveri Organic Henna', 'Guaranteed Dark Rich Stain', 'Intricate Arabic & Traditional Designs', 'Chemical Free & Skin Safe'],
    productsUsed: ['Kaveri Organic Henna Cone', 'Eucalyptus Essential Oil', 'Lemon-Sugar Sealant'],
    isPopular: true,
    isFeatured: true
  },
  {
    id: 'ear-lobe-piercing',
    title: 'Ear Lobe Piercing',
    category: 'spa',
    categoryLabel: 'Piercing Studio',
    description: 'Safe, 100% hygienic, painless earlobe and nose piercing with sterilized gold/silver studs.',
    longDescription: 'Painless and accurate earlobe/nose piercing done with modern sterilized piercing apparatus. Includes skin antiseptic prep and choice of hypoallergenic medical-grade starter studs.',
    duration: '20 mins',
    price: 399,
    originalPrice: 600,
    image: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=1000&q=80',
    benefits: ['Painless & Fast Procedure', '100% Sterilized Equipment', 'Medical-grade Hypoallergenic Studs', 'Aftercare Antiseptic Solution'],
    productsUsed: ['Sterilized Piercing Studs', 'Antiseptic Solution', 'Healing Cream']
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Radhika Singhania',
    city: 'Dileeppur',
    rating: 5,
    date: 'February 2, 2026',
    service: 'Bridal Makeup',
    comment: 'Khushboo Ma\'am and her team made me feel like an absolute queen on my wedding day! The makeup stayed flawless with zero creases. Everyone at the wedding kept asking who did my makeup!',
    verified: true,
    isFeatured: true,
    likes: 48
  },
  {
    id: 'rev-2',
    name: 'Dr. Meera Kapoor',
    city: 'Pratapgarh',
    rating: 5,
    date: 'January 18, 2026',
    service: 'Hydra Facial & Hair Spa',
    comment: 'I booked the Hydra Facial and Hair Spa before my party. The results were unreal! My skin had that glass-skin dewiness, and my frizzy hair became super silky.',
    verified: true,
    isFeatured: true,
    likes: 35
  },
  {
    id: 'rev-3',
    name: 'Tanvi Deshmukh',
    city: 'Cheetpur',
    rating: 5,
    date: 'January 28, 2026',
    service: 'Party Makeup',
    comment: 'The party makeup was perfection. No cakey feeling at all! Khushboo listened to every small detail and curated the exact smoky eye I wanted. 100% recommended!',
    verified: true,
    isFeatured: true,
    likes: 29
  },
  {
    id: 'rev-4',
    name: 'Pooja Agarwal',
    city: 'Uttar Pradesh',
    rating: 5,
    date: 'December 20, 2025',
    service: 'Bridal Makeup & Kaveri Mehendi',
    comment: 'Worth every single rupee! The bridal makeup and mehendi were stunning. Khushboo is a true artist who knows how to enhance natural beauty without masking it.',
    verified: true,
    isFeatured: true,
    likes: 62
  },
  {
    id: 'rev-5',
    name: 'Simran Jolly',
    city: 'Dileeppur',
    rating: 5,
    date: 'February 8, 2026',
    service: 'Mehendi (Kaveri)',
    comment: 'The Kaveri henna stain turned out into the deepest rich maroon color. Truly luxury service with so much warmth and hospitality.',
    verified: true,
    isFeatured: false,
    likes: 19
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Traditional Royal Bride in Crimson Lehenga',
    category: 'bridal',
    image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=80',
    beforeImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80',
    afterImage: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=80',
    description: '3D Airbrush Base with traditional Mathapatti and Kundan jewelry styling for bride.',
    tag: 'Royal Bridal'
  },
  {
    id: 'gal-2',
    title: 'Glass Skin Dewy HD Reception Look',
    category: 'hd-makeup',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1000&q=80',
    beforeImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
    afterImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1000&q=80',
    description: 'Radiant champagne highlighter and soft contoured nude lips for evening reception.',
    tag: 'Party Glam'
  },
  {
    id: 'gal-3',
    title: 'HydraFacial Glow & Skin Detox',
    category: 'skin',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80',
    beforeImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1000&q=80',
    afterImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80',
    description: 'Instant pore refinement, hydration infusion, and brightened skin tone.',
    tag: 'Hydra Facial'
  },
  {
    id: 'gal-4',
    title: 'Intricate Kaveri Bridal Mehendi',
    category: 'mehendi',
    image: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&w=1000&q=80',
    description: 'Pure organic henna with traditional architectural domes, lotuses, and couple figures.',
    tag: 'Henna Art'
  }
];

export const INITIAL_OFFERS: Offer[] = [
  {
    id: 'offer-1',
    code: 'ROYALBRIDAL2026',
    title: 'Royal Bridal Extravaganza',
    subtitle: 'Flat 20% OFF on all 2026-2027 Wedding Season Bookings',
    discountPercentage: 20,
    minBookingValue: 10000,
    validTill: 'December 31, 2026',
    badge: 'Limited Time Deal',
    image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80',
    servicesIncluded: ['Bridal Makeup', 'Dupatta Draping', 'Jewelry Setting', 'Emergency Touch-up Kit'],
    terms: ['Applicable on wedding dates booked in advance', 'Cannot be combined with other festive coupons'],
    isActive: true
  },
  {
    id: 'offer-2',
    code: 'GLOW500',
    title: 'Hydra Facial + Hair Spa Combo',
    subtitle: 'Get ₹500 OFF when you book Hydra Facial & Hair Spa together',
    discountAmount: 500,
    minBookingValue: 4000,
    validTill: 'December 31, 2026',
    badge: 'Popular Combo',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    servicesIncluded: ['Hydra Facial', 'Hair Spa & Treatment', 'Complimentary Head Massage'],
    terms: ['Valid on all days', 'One coupon per client'],
    isActive: true
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Khushboo Singh',
    role: 'Founder & Celebrity Bridal Stylist',
    experience: '15+ Years',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    bio: 'Renowned artist known across Uttar Pradesh for signature royal bridal transformations and flawless HD skin textures.',
    specialties: ['Royal Bridal Makeup', 'Airbrush Artistry', 'Celebrity Red Carpet Glam', 'HydraFacial Specialist'],
    rating: 4.98,
    reviewsCount: 640,
    instagram: '@khushboo.makeover'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'The Ultimate Pre-Bridal Skin Care Timeline',
    slug: 'pre-bridal-skin-care-timeline',
    excerpt: 'Step-by-step aesthetician guide on when to start facials, hair treatments, and hydration rituals for the luminous bridal glow.',
    content: `Preparing for your wedding day requires a strategic approach to skincare:
    
1. Month 2: Deep consultation, patch tests, and initial Hydra Facial sessions to unclog deep pores.
2. Month 1: Customized facial and Hair Spa treatments to eliminate frizzy flyaways.
3. Week of Wedding: Kaveri Mehendi, Bleach + D-Tan, and Manicure + Pedicure session.`,
    author: 'Khushboo Singh',
    authorRole: 'Founder & Chief Artist',
    date: 'February 5, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80',
    category: 'Bridal Care',
    tags: ['Bridal', 'Skincare', 'HydraFacial', 'Glow Tips']
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How far in advance should I book my bridal makeup?',
    answer: 'We recommend reserving your wedding date as early as possible to ensure availability for your date.',
    category: 'bridal'
  },
  {
    id: 'faq-2',
    question: 'Do you offer bridal makeup trials before booking?',
    answer: 'Yes! We offer bridal trial sessions to test the foundation shade and makeup style to match your outfit.',
    category: 'bridal'
  },
  {
    id: 'faq-3',
    question: 'Where is your studio located?',
    answer: 'Our studio is conveniently located near Dolphin Public School, Village Chheetpur, Dileeppur, Uttar Pradesh 230127.',
    category: 'general'
  }
];