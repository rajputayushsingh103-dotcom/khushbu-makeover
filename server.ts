import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory / persistent file storage path
const DB_FILE = path.join(process.cwd(), "salon-data.json");

// Helper to load or initialize database
function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading salon-data.json:", err);
  }
  return {
    appointments: [],
    customServices: [],
    customReviews: [],
    customGallery: [],
    customOffers: [],
    inquiries: []
  };
}

function saveDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing salon-data.json:", err);
  }
}

// Ensure db exists
let db = loadDb();

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", salon: "Khushboo Makeover", time: new Date().toISOString() });
});

// Admin Authentication endpoint (Updated with your credentials)
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  const ADMIN_USERNAME = "khushbusingh";
  const ADMIN_PASSWORD = "khushbu@6971";

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.json({
      success: true,
      token: "km_admin_session_" + Date.now(),
      user: { username: "Khushboo Singh (Admin)", role: "Director & Lead Artist" }
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: "Galat Username ya Password!" 
    });
  }
});

// Appointments API
app.get("/api/appointments", (req, res) => {
  db = loadDb();
  res.json({ appointments: db.appointments });
});

app.post("/api/appointments", (req, res) => {
  const appointment = req.body;
  if (!appointment.name || !appointment.phone || !appointment.serviceName) {
    return res.status(400).json({ error: "Missing required appointment fields." });
  }

  const newAppointment = {
    id: "apt-" + Date.now(),
    bookingCode: "KM-" + Math.floor(100000 + Math.random() * 900000),
    name: appointment.name,
    phone: appointment.phone,
    email: appointment.email || "",
    serviceId: appointment.serviceId || "",
    serviceName: appointment.serviceName,
    servicePrice: appointment.servicePrice || 0,
    date: appointment.date,
    timeSlot: appointment.timeSlot,
    stylist: appointment.stylist || "Khushboo Sharma (Lead Master Artist)",
    addons: appointment.addons || [],
    totalPrice: appointment.totalPrice || appointment.servicePrice || 0,
    paymentOption: appointment.paymentOption || 'pay_at_salon',
    advancePaid: appointment.advancePaid || 0,
    remainingDue: appointment.remainingDue !== undefined ? appointment.remainingDue : (appointment.totalPrice || appointment.servicePrice || 0),
    paymentRef: appointment.paymentRef || "",
    message: appointment.message || "",
    status: "confirmed",
    createdAt: new Date().toISOString()
  };

  db.appointments.unshift(newAppointment);
  saveDb(db);

  res.status(201).json({ success: true, appointment: newAppointment });
});

app.patch("/api/appointments/:id", (req, res) => {
  const { id } = req.params;
  const { status, stylist, date, timeSlot } = req.body;

  const aptIndex = db.appointments.findIndex((a: any) => a.id === id || a.bookingCode === id);
  if (aptIndex === -1) {
    return res.status(404).json({ error: "Appointment not found" });
  }

  if (status) db.appointments[aptIndex].status = status;
  if (stylist) db.appointments[aptIndex].stylist = stylist;
  if (date) db.appointments[aptIndex].date = date;
  if (timeSlot) db.appointments[aptIndex].timeSlot = timeSlot;

  saveDb(db);
  res.json({ success: true, appointment: db.appointments[aptIndex] });
});

app.delete("/api/appointments/:id", (req, res) => {
  const { id } = req.params;
  db.appointments = db.appointments.filter((a: any) => a.id !== id && a.bookingCode !== id);
  saveDb(db);
  res.json({ success: true, message: "Appointment deleted" });
});

// Contact / Inquiry API
app.post("/api/contact", (req, res) => {
  const inquiry = {
    id: "inq-" + Date.now(),
    ...req.body,
    receivedAt: new Date().toISOString()
  };
  db.inquiries = db.inquiries || [];
  db.inquiries.unshift(inquiry);
  saveDb(db);
  res.json({ success: true, message: "Inquiry received. Our beauty advisor will call you within 2 hours." });
});

// AI Beauty & Bridal Consultant API
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn("Failed to initialize GoogleGenAI", e);
    }
  }
  return aiClient;
}

app.post("/api/ai-consultation", async (req, res) => {
  const { occasion, outfitColor, skinType, hairLength, preferences, concerns } = req.body;

  try {
    const ai = getGeminiClient();
    if (ai) {
      const prompt = `You are Master Stylist and Luxury Bridal Consultant at "Khushboo Makeover", India's top luxury bridal studio.
A client is asking for personalized bridal/event beauty advice.

Client details:
- Occasion: ${occasion || "Wedding"}
- Outfit Color & Style: ${outfitColor || "Red/Maroon Bridal Lehenga"}
- Skin Type/Tone: ${skinType || "Combination with warm undertone"}
- Hair Length: ${hairLength || "Long / Medium"}
- Concerns: ${concerns || "Long-lasting finish, no flashback in photography"}
- Specific Preferences: ${preferences || "Glowing dewy base with royal eye makeup"}

Provide a warm, opulent, highly expert styling prescription covering:
1. Recommended Makeup Style (e.g. Royal HD Airbrush with 3D Contouring, eye aesthetics)
2. Recommended Hairstyle (e.g. Textured bridal bun with fresh baby's breath/roses or Hollywood waves)
3. Pre-Event Skin Prep Schedule (facials and hydration steps 1-2 weeks before)
4. Recommended Salon Services at Khushboo Makeover.

Keep the tone encouraging, luxurious, elegant, and actionable. Limit to 350 words in clean formatted markdown.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });

      if (response && response.text) {
        return res.json({ advice: response.text });
      }
    }
  } catch (error) {
    console.error("Gemini API call failed, falling back to smart luxury beauty engine:", error);
  }

  // Smart fallback recommendation
  const fallbackAdvice = `### ✨ Khushboo Makeover Bespoke Beauty Consultation

**1. Recommended Makeup Look:**
For your **${occasion || "special celebration"}** wearing **${outfitColor || "royal attire"}**, we recommend our **Signature Royal HD Airbrush Makeup**. 
- **Base:** Lightweight silicone airbrush base with soft champagne-gold highlight on high cheekbones, ensuring 24-hour tear and sweat resistance with zero camera flashback.
- **Eyes:** Duo-chrome rose gold & warm terracotta cut-crease with winged liner and 3D silk lashes to complement your outfit.
- **Lips:** Velvet matte berry-rose with subtle gloss center.

**2. Hair Styling Prescription:**
- **Look:** Intricate textured low bridal bun embellished with fresh white baby’s breath and micro pearl pins, or cascading Hollywood waves for cocktail/sangeet.
- **Hair Prep:** Pre-styling Kérastase caviar thermal shield for luminous shine.

**3. Recommended Salon Rituals:**
- **1-2 Weeks Prior:** HydraFacial MD® Diamond Glow + 24K Pure Gold Brightening Facial.
- **3 Days Prior:** Brazilian Keratin Gloss Infusion & Crystal Nail Extensions.

*Our master artists at Khushboo Makeover look forward to pampering you!*`;

  res.json({ advice: fallbackAdvice });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Khushboo Makeover luxury server running on http://localhost:${PORT}`);
  });
}

startServer();