import { Service, Review, GalleryItem, Offer, TeamMember, BlogPost, FAQItem, SalonInfo } from '../types';

export const SALON_INFO: SalonInfo = {
  name: 'Khushboo Makeover',
  tagline: 'Luxury Salon & Bridal Artistry Studio',
  founder: 'Khushboo Singh',
  founderTitle: 'Celebrity Makeup Artist & Creative Director',
  founderBio: 'Over 15+ years perfecting bespoke bridal, HD airbrush, and celebrity red carpet artistry with international diploma from London.',
  founderImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80',
  phone: '+91 98765 43210',
  phoneAlt: '+91 9598538006',
  whatsapp: '+919598538006',
  email: 'appointments@khushboomakeover.com',
  // Address & Location Details
  address: 'Suite 402, 4th Floor, Royal Palms Luxury Arcade, Opp. Grand Hyatt, Linking Road, Bandra West, Mumbai',
  landmark: 'Near City Centre Mall & Bandra Linking Road Crossing',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400050',
  directionsNote: '2 minutes walk from Bandra Station (West) / Linking Road. Valet Parking & VIP Private Elevator available.',
  googleMapsUrl: 'https://maps.google.com/?q=Linking+Road+Bandra+West+Mumbai',
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120638.16781223945!2d72.8258336!3d19.0821978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sBandra%20West%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin',
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
    rating: '4.95',
    awards: '24+',
    stylists: '35+'
  },
  // Hero texts
  hero: {
    badgeText: "India's Award-Winning Bridal Studio 2026",
    headlineLine1: 'Where Every Bride',
    headlineLine2: 'Becomes Royalty',
    subheadline: 'Elevate your wedding & celebration glamour with celebrity master artist Khushboo Sharma. Experience bespoke HD Airbrush makeup, French Balayage, Brazilian Keratin, and HydraFacial MD® in private VIP suites.',
    backgroundImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=2000&q=85',
    primaryCtaText: 'Reserve VIP Appointment',
    secondaryCtaText: 'AI Bridal Stylist'
  },
  // About texts
  about: {
    storyP1: 'At Khushboo Makeover, we believe every woman possesses a distinctive radiance. Our mission is not to mask your features, but to sculpt, illuminate, and celebrate your natural beauty with world-class artistry and supreme dermatological care.',
    storyP2: 'From our private bridal dressing sanctuaries to our clinical HydraFacial suites, every touchpoint is designed to deliver absolute relaxation, hygiene, and imperial luxury.',
    mission: 'To deliver flawless, confidence-boosting bridal artistry and aesthetic therapies with zero-compromise hygiene and top global cosmetic brands.',
    vision: 'To be the globally recognized benchmark for imperial bridal makeovers, luxury hair transformations, and holistic aesthetic wellness.'
  },
  // Payment & Pre-booking config
  payment: {
    tokenPercentage: 10,
    upiId: 'khushboomakeover@okaxis',
    payeeName: 'Khushboo Makeover Studio'
  },
  // Socials
  socials: {
    instagram: 'https://instagram.com/khushboomakeover',
    facebook: 'https://facebook.com/khushboomakeover',
    youtube: 'https://youtube.com/@khushboomakeover'
  }
};

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'bridal-makeup-royal',
    title: 'Signature Royal Bridal Makeup',
    category: 'bridal',
    categoryLabel: 'Bridal Artistry',
    description: 'Bespoke HD & Airbrush bridal makeover tailored to your wedding lehenga, jewelry, and skin undertone with 24-hour long stay.',
    longDescription: 'Our hallmark bridal experience curated personally by Master Artist Khushboo Sharma. Includes skin prep hydration therapy, 3D contouring, water-resistant HD airbrush foundation, 3D mink eyelashes, custom floral hair styling, luxury jewelry setting, and dupatta draping with emergency touch-up kit.',
    duration: '180 mins',
    price: 24999,
    originalPrice: 30000,
    image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=80',
    benefits: ['24-Hour Sweat & Waterproof Stay', 'Airbrush HD Flawless Base', 'Complete Hair Styling & Dupatta Draping', 'Complimentary Pre-Bridal Skin Consultation'],
    productsUsed: ['Dior Backstage', 'Huda Beauty', 'MAC Studio Fix', 'Charlotte Tilbury', 'NARS', 'Estée Lauder'],
    isPopular: true,
    isFeatured: true,
    tag: 'Bestseller'
  },
  {
    id: 'hd-glam-makeup',
    title: 'HD Ultra Glow Celebrity Makeup',
    category: 'hd-makeup',
    categoryLabel: 'HD Makeup',
    description: 'High-definition photo-ready makeup delivering radiant skin finish without flashback, perfect for red carpets and grand receptions.',
    longDescription: 'Engineered specifically for 4K and 8K photography. Employs micro-fine HD pigments and light-refracting primers that blur imperfections while preserving natural skin texture. Includes customized smoky or shimmer eye artistry and premium silk lashes.',
    duration: '120 mins',
    price: 11999,
    originalPrice: 15000,
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1000&q=80',
    benefits: ['Zero Flashback Under Flashlights', 'Glass Skin Dewy Finish', 'Custom Lip Liner & Hydrating Gloss', '3D Silk Lashes Included'],
    productsUsed: ['Make Up For Ever HD', 'Anastasia Beverly Hills', 'Fenty Beauty', 'Tom Ford'],
    isPopular: true,
    isFeatured: true,
    tag: 'Trending'
  },
  {
    id: 'engagement-makeup',
    title: 'Luxury Engagement & Sangeet Makeup',
    category: 'bridal',
    categoryLabel: 'Bridal Artistry',
    description: 'Subtle yet glamorous styling for cocktail nights, ring ceremonies, and sangeet celebrations with long-lasting dance-proof stay.',
    longDescription: 'Designed for pre-wedding functions. Features luminous skin base, mesmerizing glitter or halo eye makeup matching your evening gown or saree, intricate braided or textured wave hair styling, and saree/gown draping.',
    duration: '120 mins',
    price: 14999,
    originalPrice: 18000,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=80',
    benefits: ['Smudge & Sweat Resistant for Dancing', 'Intricate Half-up or Textured Curls', 'Precision Brow Sculpting', 'Complimentary Saree/Gown Draping'],
    productsUsed: ['Charlotte Tilbury', 'Too Faced', 'MAC', 'Urban Decay'],
    isFeatured: true
  },
  {
    id: 'party-makeup-deluxe',
    title: 'Deluxe Party & Reception Makeup',
    category: 'hd-makeup',
    categoryLabel: 'Party & Glam',
    description: 'Chic, modern makeup with soft contouring and eye aesthetics for bridesmaids, birthday galas, and festive gatherings.',
    longDescription: 'Elevate your party presence with luminous foundation, tailored winged liner or cut-crease eyeshadow, sculpting highlighter, and sophisticated blowout or tong styling.',
    duration: '90 mins',
    price: 6999,
    originalPrice: 8500,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80',
    benefits: ['12-Hour Fresh Hold', 'Customized Eye Styling', 'Blowdry & Curls Styling', 'Lightweight Feel'],
    productsUsed: ['Kryolan Professional', 'MAC', 'Benefit Cosmetics', 'Rare Beauty'],
    isPopular: true
  },
  {
    id: 'keratin-treatment-brazilian',
    title: 'Brazilian Keratin Gold Smoothing Treatment',
    category: 'hair',
    categoryLabel: 'Hair Therapy',
    description: 'Intense protein infusion that eliminates 95% frizz, restores mirror shine, and leaves hair silky smooth for up to 6 months.',
    longDescription: 'Our salon-grade hydrolyzed keratin formulation penetrates deep into hair cuticles, repairing heat damage and chemical dryness. Delivers silky, manageable, and mirror-gloss locks with zero harsh formaldehyde fumes.',
    duration: '180 mins',
    price: 8999,
    originalPrice: 12000,
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1000&q=80',
    benefits: ['Eliminates 95% Frizz & Flyaways', 'Deep Cuticle Repair & Luster', 'Cuts Styling Time in Half', 'Long Lasting 4-6 Months Results'],
    productsUsed: ['Global Keratin (GK Hair)', 'Olaplex No. 1 & 2', 'L\'Oréal Professionnel Serie Expert', 'Schwarzkopf Bonacure'],
    isPopular: true,
    isFeatured: true,
    tag: 'Salon Favorite'
  },
  {
    id: 'hair-smoothening-botox',
    title: 'Hair Botox & Deep Reconstruction',
    category: 'hair',
    categoryLabel: 'Hair Therapy',
    description: 'Non-chemical deep conditioning treatment packed with caviar oil, vitamins B5 and E, and collagen for instant bounce and softness.',
    longDescription: 'Revitalizes dry, brittle, and over-processed hair. Fills in broken fiber gaps, restores elasticity, and imparts diamond-like glass shine while maintaining your natural hair volume.',
    duration: '150 mins',
    price: 7499,
    originalPrice: 9500,
    image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=1000&q=80',
    benefits: ['Zero Formaldehyde Safe Treatment', 'Revitalizes Colored & Bleached Hair', 'Intense Moisture & Elasticity', 'Mirror Finish Gloss'],
    productsUsed: ['Inoar Hair Botox', 'Kérastase Nutritive', 'Moroccanoil Treatment'],
    isFeatured: false
  },
  {
    id: 'luxury-hair-spa',
    title: 'Kérastase Chronologiste Caviar Hair Spa',
    category: 'hair',
    categoryLabel: 'Hair Therapy',
    description: 'The pinnacle of hair pampering with micronized caviar pearls, scalp detoxification, and 20-minute relaxing neck massage.',
    longDescription: 'An ultra-luxurious hair and scalp rejuvenation ritual. Cleanses pollutants, stimulates microcirculation, and nourishes each strand from root to tip. Includes ultrasonic micro-mist steam infusion.',
    duration: '75 mins',
    price: 3999,
    originalPrice: 5000,
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1000&q=80',
    benefits: ['Scalp Detox & Anti-Pollution Shield', 'Deep Relaxation Massage', 'Micro-Mist Thermal Infusion', 'Velvety Soft Hair Texture'],
    productsUsed: ['Kérastase Paris', 'L\'Oréal Mythic Oil', 'Davines Natural Tech'],
    isPopular: true
  },
  {
    id: 'balayage-hair-color',
    title: 'French Balayage & Ombre Couture',
    category: 'hair',
    categoryLabel: 'Hair Color',
    description: 'Custom hand-painted multidimensional highlights and seamless color melts using ammonia-free bond-protecting formulas.',
    longDescription: 'Our certified master colorists craft personalized caramel, mocha, champagne blonde, or rose gold tones that harmonize with your skin tone. Includes bond-multiplying Olaplex treatment to preserve hair integrity.',
    duration: '210 mins',
    price: 10999,
    originalPrice: 14000,
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1000&q=80',
    benefits: ['Seamless Natural Grow-Out Blend', 'Bond Protection with Olaplex Included', 'Custom Gloss & Toner Lock', 'Zero Harsh Demarcation Lines'],
    productsUsed: ['Wella Professionals Koleston', 'L\'Oréal Inoa Ammonia-Free', 'Olaplex', 'Schwarzkopf Igora Royal'],
    isFeatured: true
  },
  {
    id: 'hydrafacial-diamond-glow',
    title: 'HydraFacial MD® Diamond Glow Infusion',
    category: 'skin',
    categoryLabel: 'Skin & Aesthetics',
    description: 'Medical-grade vortex exfoliation, painless blackhead extraction, and hyaluronic acid peptide serum infusion for instant glass skin.',
    longDescription: 'The international gold standard in skin rejuvenation. Gently sloughs dead skin cells, cleanses clogged pores using gentle vacuum suction, and saturates the epidermis with antioxidants, peptides, and collagen stimulants. Zero downtime.',
    duration: '60 mins',
    price: 6499,
    originalPrice: 8500,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80',
    benefits: ['Instant Pore Tightening & Glow', 'Zero Redness or Downtime', 'Deep Blackhead/Whitehead Extraction', 'Custom Vitamin & Peptide Infusion'],
    productsUsed: ['HydraFacial MD Serums', 'Dermalogica Pro', 'SkinCeuticals C E Ferulic', 'Casmara Algae Mask'],
    isPopular: true,
    isFeatured: true,
    tag: 'Celebrity Choice'
  },
  {
    id: 'gold-facial-bridal-glow',
    title: '24K Pure Gold Luxury Bridal Facial',
    category: 'skin',
    categoryLabel: 'Skin & Aesthetics',
    description: 'Imperial ritual with 24K gold foil sheets, gold-infused serums, lymphatic drainage, and cryogenic firming mask.',
    longDescription: 'An opulent treatment designed for brides-to-be. Pure 24K gold particles accelerate cellular renewal, reduce melanin deposition, boost collagen production, and impart an otherworldly bridal radiance.',
    duration: '90 mins',
    price: 5499,
    originalPrice: 7000,
    image: 'https://images.unsplash.com/photo-1512290900672-1f02a0a0e363?auto=format&fit=crop&w=1000&q=80',
    benefits: ['24 Karat Pure Bio-Gold Infusion', 'Lymphatic Jade Roller Massage', 'Brightens Dark Spots & Pigmentation', 'Deep Cellular Hydration'],
    productsUsed: ['Casmara 24K Gold Mask', 'O3+ Bridal Pro Matrix', 'Thalgo Marine Cosmetics'],
    isFeatured: false
  },
  {
    id: 'deep-cleanup-detox',
    title: 'Oxygen Radiance Skin Cleanup',
    category: 'skin',
    categoryLabel: 'Skin & Aesthetics',
    description: 'Fast, refreshing skin detox with micro-peel, steam, comedone extraction, high-frequency antibacterial care, and algae pack.',
    longDescription: 'Ideal maintenance session for busy individuals. Purifies skin, clears sebum buildup, kills acne-causing bacteria, and locks in moisture with pure oxygen spray.',
    duration: '45 mins',
    price: 2499,
    originalPrice: 3200,
    image: 'https://images.unsplash.com/photo-1519735777090-ec97162dc266?auto=format&fit=crop&w=1000&q=80',
    benefits: ['Removes Stubborn Impurities & Tanning', 'High-Frequency Acne Protection', 'Oxygen Infusion for Dull Skin', 'Refreshing Botanical Cool Mask'],
    productsUsed: ['Dermalogica Active Cleanser', 'Forest Essentials Herbal Steam', 'O3+ Whitening Pack']
  },
  {
    id: 'luxury-nail-art-extensions',
    title: 'Bridal Crystal & Gel Acrylic Extensions',
    category: 'nails',
    categoryLabel: 'Nail Art Studio',
    description: 'Custom sculpted gel or acrylic nail extensions embellished with Swarovski crystals, ombre chrome, 3D florals, and French tips.',
    longDescription: 'Pamper your hands with precision cuticle care, length sculpting, and bespoke nail artistry curated to complement your bridal rings and lehenga embroidery. Includes long-wear chip-resistant top coat lasting 4+ weeks.',
    duration: '90 mins',
    price: 3499,
    originalPrice: 4500,
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1000&q=80',
    benefits: ['Long-Lasting 4+ Weeks Gel Formulation', 'Authentic Swarovski Crystal Placement', 'Sculpted to Flatter Finger Shape', 'High Gloss Mirror Finish'],
    productsUsed: ['OPI GelColor', 'Gelish Harmony', 'Swarovski Elements', 'CND Shellac'],
    isPopular: true
  },
  {
    id: 'bridal-mehendi-artistry',
    title: 'Grand Royal Rajasthani & Arabic Mehendi',
    category: 'mehendi',
    categoryLabel: 'Mehendi Studio',
    description: 'Intricate figures of Radha-Krishna, bride-groom portraiture, temple architecture, and Arabic lace detailing with dark organic stain.',
    longDescription: 'Created using 100% natural organic Sojat Henna infused with eucalyptus and clove essential oils for a deep mahogany dark stain. Available for full arms (elbow to fingertips) and feet (mid-calf to toes).',
    duration: '240 mins',
    price: 12999,
    originalPrice: 16000,
    image: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&w=1000&q=80',
    benefits: ['100% Organic Pure Henna (No Chemicals)', 'Guaranteed Deep Rich Mahogany Stain', 'Custom Bride & Groom Portrait Stories', 'Complimentary Sealant & Aftercare Oil'],
    productsUsed: ['Sojat Organic Henna', 'Nilgiri Eucalyptus Extract', 'Cold-Pressed Clove Essential Oil'],
    isFeatured: true
  },
  {
    id: 'complete-pre-bridal-package',
    title: 'Maharani 7-Day Pre-Bridal Transformation Package',
    category: 'packages',
    categoryLabel: 'Bridal Packages',
    description: 'Comprehensive head-to-toe beauty package spanning 7 days prior to the wedding for the complete bridal glow.',
    longDescription: 'The ultimate royal indulgence: includes 2x HydraFacials, Full Body Polishing with Moroccan scrub, Kérastase Caviar Hair Spa, Brazilian Keratin/Smoothening, Full Body waxing, 24K Gold Manicure & Pedicure, Gel Extensions, and Trial Makeup session.',
    duration: 'Multiple Sessions (7 Days)',
    price: 39999,
    originalPrice: 55000,
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1000&q=80',
    benefits: ['Complete Head-to-Toe 7-Day Program', 'Full Body Organic Polishing & De-tan', 'Hair Spa + Keratin/Smoothening', 'Complimentary Bridal Trial & Consult'],
    productsUsed: ['Kérastase', 'Casmaran 24K Gold', 'Olaplex', 'Dermalogica Pro', 'OPI'],
    isPopular: true,
    isFeatured: true,
    tag: 'Best Value'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Radhika Singhania',
    city: 'Mumbai',
    rating: 5,
    date: 'February 2, 2026',
    service: 'Signature Royal Bridal Makeup',
    comment: 'Khushboo Ma\'am and her team made me feel like an absolute queen on my wedding day! The makeup stayed flawless from the 4 PM photoshoot till 5 AM morning pheras with zero creases. Everyone at the wedding kept asking who did my makeup!',
    verified: true,
    isFeatured: true,
    likes: 48
  },
  {
    id: 'rev-2',
    name: 'Dr. Meera Kapoor',
    city: 'Pune',
    rating: 5,
    date: 'January 18, 2026',
    service: 'HydraFacial MD® & Hair Botox',
    comment: 'I booked the HydraFacial and Hair Botox before my reception. The results were unreal! My skin had that coveted glass-skin dewiness, and my frizzy curls became super silky. The VIP private suite is so relaxing and hygienic.',
    verified: true,
    isFeatured: true,
    likes: 35
  },
  {
    id: 'rev-3',
    name: 'Tanvi Deshmukh',
    city: 'Mumbai',
    rating: 5,
    date: 'January 28, 2026',
    service: 'HD Ultra Glow Celebrity Makeup',
    comment: 'The HD makeup for my cocktail party was perfection. No cakey feeling at all! Khushboo listened to every small detail of what I wanted and curated the exact smoky eye I had envisioned. 100% recommended!',
    verified: true,
    isFeatured: true,
    likes: 29
  },
  {
    id: 'rev-4',
    name: 'Pooja Agarwal',
    city: 'Delhi / Destination Bride',
    rating: 5,
    date: 'December 20, 2025',
    service: 'Maharani 7-Day Pre-Bridal Package',
    comment: 'Worth every single rupee! The 7-day pre-bridal rituals completely transformed my skin and hair texture. Khushboo Sharma is a true artist who knows how to enhance natural beauty without masking it.',
    verified: true,
    isFeatured: true,
    likes: 62
  },
  {
    id: 'rev-5',
    name: 'Simran Jolly',
    city: 'Mumbai',
    rating: 5,
    date: 'February 8, 2026',
    service: 'Grand Royal Rajasthani Mehendi',
    comment: 'The henna artists created our real love story portraits on my arms! The stain turned out into the deepest rich maroon color. Truly luxury service with so much warmth and hospitality.',
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
    description: '3D Airbrush Base with traditional Mathapatti and Kundan jewelry styling for bride Avani.',
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
    tag: 'HD Artistry'
  },
  {
    id: 'gal-3',
    title: 'French Caramel Balayage & Hollywood Waves',
    category: 'hair',
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1000&q=80',
    beforeImage: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1000&q=80',
    afterImage: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1000&q=80',
    description: 'Multi-tonal caramel balayage with Olaplex bond repair and bouncy voluminous waves.',
    tag: 'Hair Couture'
  },
  {
    id: 'gal-4',
    title: 'HydraFacial Glow & Skin Detox',
    category: 'skin',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80',
    beforeImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1000&q=80',
    afterImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80',
    description: 'Instant pore refinement, hydration infusion, and brightened skin tone.',
    tag: 'Skin Glow'
  },
  {
    id: 'gal-5',
    title: 'Swarovski Crystal Rose Gold Nail Extensions',
    category: 'nail-art',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1000&q=80',
    description: 'French ombre tips with authentic Swarovski crystal accents and high-gloss gel top coat.',
    tag: 'Nail Studio'
  },
  {
    id: 'gal-6',
    title: 'Intricate Radha Krishna Bridal Mehendi',
    category: 'mehendi',
    image: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&w=1000&q=80',
    description: 'Pure organic henna with traditional architectural domes, lotuses, and couple figures.',
    tag: 'Henna Art'
  },
  {
    id: 'gal-7',
    title: 'Luxury Salon Ambiance & VIP Suites',
    category: 'salon',
    image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1000&q=80',
    description: 'Private bridal dressing suites with gold accents, soft ambient lighting, and champagne bar.',
    tag: 'Salon Tour'
  },
  {
    id: 'gal-8',
    title: 'Smoky Emerald Glitter Sangeet Look',
    category: 'hd-makeup',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=80',
    description: 'Custom emerald duochrome pigment with dramatic wing lashes and nude gloss.',
    tag: 'Sangeet Glam'
  }
];

export const INITIAL_OFFERS: Offer[] = [
  {
    id: 'offer-1',
    code: 'ROYALBRIDAL2026',
    title: 'Royal Bridal Extravaganza',
    subtitle: 'Flat 20% OFF on all 2026-2027 Wedding Season Bookings',
    discountPercentage: 20,
    minBookingValue: 20000,
    validTill: 'March 31, 2026',
    badge: 'Limited Time Deal',
    image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80',
    servicesIncluded: ['Signature Bridal Makeup', 'Dupatta Draping', 'Jewelry Setting', 'Emergency Touch-up Kit'],
    terms: ['Applicable on wedding dates booked at least 15 days in advance', 'Cannot be combined with other festive coupons'],
    isActive: true
  },
  {
    id: 'offer-2',
    code: 'GLOW500',
    title: 'HydraFacial + Hair Spa Combo',
    subtitle: 'Get ₹1,500 OFF when you book HydraFacial & Kérastase Hair Spa together',
    discountAmount: 1500,
    minBookingValue: 8000,
    validTill: 'April 15, 2026',
    badge: 'Popular Combo',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    servicesIncluded: ['HydraFacial MD', 'Kérastase Caviar Hair Spa', 'Complimentary Back Massage'],
    terms: ['Valid from Monday to Thursday bookings', 'One coupon per client'],
    isActive: true
  },
  {
    id: 'offer-3',
    code: 'KERATIN30',
    title: 'Keratin & Botox Shine Fest',
    subtitle: 'Up to 30% OFF on Hair Smoothing & Botox Treatments',
    discountPercentage: 30,
    minBookingValue: 7000,
    validTill: 'April 30, 2026',
    badge: 'Hair Special',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
    servicesIncluded: ['Brazilian Keratin Gold', 'Post-Keratin Hair Wash', 'Serum Infusion'],
    terms: ['Subject to hair length and density assessment'],
    isActive: true
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Khushboo Sharma',
    role: 'Founder & Celebrity Bridal Stylist',
    experience: '15+ Years',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    bio: 'Alumna of London School of Makeup and CIDESCO Zurich. Known across India for signature royal bridal transformations and flawless HD skin textures.',
    specialties: ['Royal Bridal Makeup', 'Airbrush Artistry', 'Celebrity Red Carpet Glam', 'Facial Architecture'],
    rating: 4.98,
    reviewsCount: 640,
    instagram: '@khushboo.makeover'
  },
  {
    id: 'team-2',
    name: 'Priya Mehra',
    role: 'Senior Hair Director & Colorist',
    experience: '11+ Years',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
    bio: 'Trained at Toni&Guy Singapore. Master of French Balayage, Keratin reconstruction, and intricate bridal textured updos.',
    specialties: ['French Balayage', 'Keratin & Botox', 'Bridal Textured Buns', 'Damage Hair Repair'],
    rating: 4.92,
    reviewsCount: 380,
    instagram: '@priyamehra_hair'
  },
  {
    id: 'team-3',
    name: 'Aisha Khan',
    role: 'Lead Aesthetician & Skin Specialist',
    experience: '9+ Years',
    image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=800&q=80',
    bio: 'Certified Medical Aesthetician specializing in non-invasive skin therapies, HydraFacial MD protocols, and gold radiance treatments.',
    specialties: ['HydraFacial MD', '24K Gold Therapy', 'Acne Scar Care', 'Pigmentation Correction'],
    rating: 4.95,
    reviewsCount: 290,
    instagram: '@aisha_skin_glow'
  },
  {
    id: 'team-4',
    name: 'Riya Sen',
    role: 'Master Nail Artist & Lash Specialist',
    experience: '7+ Years',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    bio: 'Renowned for intricate 3D floral nail extensions, Swarovski crystal embellishments, and Russian volume lash extensions.',
    specialties: ['3D Nail Sculpting', 'Swarovski Art', 'Russian Lash Volume', 'Gel Chrome Effects'],
    rating: 4.90,
    reviewsCount: 210,
    instagram: '@riyasen_nails'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'The Ultimate 3-Month Pre-Bridal Skin Care Timeline',
    slug: 'pre-bridal-skin-care-timeline',
    excerpt: 'Step-by-step aesthetician guide on when to start facials, hair treatments, and hydration rituals for the luminous bridal glow.',
    content: `Preparing for your wedding day requires a strategic approach to skincare. Starting 3 to 6 months prior gives your skin cells time to renew and respond to treatments without risk of irritation right before the big day.

Month 3: Deep consultation, patch tests, and initial HydraFacial sessions to unclog deep pores and regulate sebum production.
Month 2: Targeted treatments like 24K Gold infusion or mild micro-peels for uneven pigmentation and dark spots.
Month 1: Intensive hair spa nourishment and Keratin smoothing to eliminate frizzy flyaways for your bridal hairstyles.
Week of the Wedding: Ultra-gentle oxygen hydration mask, full body polish, and organic soothing packs. Avoid starting any new unfamiliar cosmetic products!`,
    author: 'Khushboo Sharma',
    authorRole: 'Founder & Chief Artist',
    date: 'February 5, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80',
    category: 'Bridal Care',
    tags: ['Bridal', 'Skincare', 'HydraFacial', 'Glow Tips']
  },
  {
    id: 'blog-2',
    title: 'HD Makeup vs. Airbrush Makeup: Which is Best for You?',
    slug: 'hd-makeup-vs-airbrush-makeup',
    excerpt: 'Demystifying the pros, longevity, and finish of HD and Airbrush bridal makeup so you can choose the perfect fit.',
    content: `Many brides wonder whether to choose HD Makeup or Airbrush Makeup. Both deliver extraordinary results, but suit different preferences and skin types.

HD Makeup:
- Applied using micro-blending brushes and beauty sponges.
- Uses light-diffusing pigments that reflect light softly, preventing white flashback in photography.
- Ideal for normal to dry skin types and brides who love a soft, seamless satin or glass-skin finish.

Airbrush Makeup:
- Sprayed via a micro-compressor stylus as an ultra-fine mist.
- Forms an ultra-light, waterproof, silicon-based film that lasts up to 24 hours through tears, sweat, and warm wedding lights.
- Phenomenal for oily or combination skin and warm humid weather weddings.

At Khushboo Makeover, we often combine the two: using Airbrush for an untouchable foundation shield, paired with HD cream contouring and eye aesthetics!`,
    author: 'Khushboo Sharma',
    authorRole: 'Celebrity Makeup Artist',
    date: 'January 22, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1000&q=80',
    category: 'Makeup Guide',
    tags: ['Makeup', 'Airbrush', 'HD Makeup', 'Bridal Guide']
  },
  {
    id: 'blog-3',
    title: 'How to Protect and Maintain Your Keratin Treatment',
    slug: 'protect-maintain-keratin-treatment',
    excerpt: 'Expert salon secrets to make your Keratin gold smoothing last up to 6 whole months with zero frizz.',
    content: `Keratin treatments are an investment in effortless morning styling. To maximize longevity:

1. Use strictly Sulfate-Free and Sodium-Chloride Free Shampoos. Sulfates strip the keratin protein layer rapidly.
2. Wait the full 48-72 hours before your first wash and avoid tying hair with tight rubber bands during the initial settling period.
3. Always apply a heat-protectant serum before blow-drying.
4. Sleep on a silk or satin pillowcase to minimize friction and prevent frizz.`,
    author: 'Priya Mehra',
    authorRole: 'Senior Hair Director',
    date: 'January 10, 2026',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1000&q=80',
    category: 'Hair Care',
    tags: ['Hair Spa', 'Keratin', 'Hair Care', 'Salon Tips']
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How far in advance should I book my bridal makeup?',
    answer: 'We recommend reserving your wedding date at least 3 to 6 months in advance, especially during the peak wedding season (October to March). We accept only a limited number of brides per day to ensure personalized attention and perfection.',
    category: 'bridal'
  },
  {
    id: 'faq-2',
    question: 'Do you offer bridal makeup trials before booking?',
    answer: 'Yes! We offer full bridal trial sessions where Master Artist Khushboo Sharma will test the foundation shade, eye makeup style, and hair texture to match your outfit and jewelry. If you confirm your booking on the same day, a portion of the trial fee is adjusted against your package.',
    category: 'bridal'
  },
  {
    id: 'faq-3',
    question: 'What luxury brands and hygiene standards do you use?',
    answer: 'We use 100% authentic international luxury brands including Dior Backstage, Charlotte Tilbury, MAC, Huda Beauty, Kérastase, and HydraFacial MD. All brushes and tools undergo medical-grade UV sterilization and alcohol sanitation before every client.',
    category: 'general'
  },
  {
    id: 'faq-4',
    question: 'Do you travel to wedding venues or destination weddings?',
    answer: 'Yes, Khushboo Sharma and her senior bridal team travel across India and internationally for destination weddings. Travel and accommodation charges apply as per location.',
    category: 'booking'
  },
  {
    id: 'faq-5',
    question: 'How does the online appointment booking work?',
    answer: 'You can easily select your desired service, date, and preferred time slot through our instant booking portal. You will receive an immediate booking code and WhatsApp confirmation with stylist details.',
    category: 'booking'
  },
  {
    id: 'faq-6',
    question: 'Is the HydraFacial suitable for sensitive or acne-prone skin?',
    answer: 'Absolutely. HydraFacial MD uses customizable suction and botanical soothing serums specifically formulated to calm redness, clear congested pores, and treat acne without harsh scrubbing.',
    category: 'hair-skin'
  }
];
