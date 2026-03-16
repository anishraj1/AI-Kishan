import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { jsPDF } from "jspdf";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Page =
  | "Home"
  | "Price Prediction"
  | "Crop Planning"
  | "Live Mandi"
  | "Weather"
  | "Dashboard"
  | "Knowledge Hub"
  | "About"
  | "Contact";

type Toast = { id: number; message: string };
type Lang = "en" | "hi" | "kn";

type CropPrice = {
  crop: string;
  market: string;
  district: string;
  current_price: number;
  predicted_price_30d: number;
  change_percent: string;
  trend: "rising" | "falling" | "stable";
  confidence: number;
  unit: string;
  last_updated: string;
};

type CropEconomics = {
  crop: string;
  costPerAcre: number;
  expectedMargin: number;
  seasonFit: Array<"Kharif" | "Rabi" | "Zaid">;
  note: string;
};

const pages: Page[] = [
  "Home",
  "Price Prediction",
  "Crop Planning",
  "Live Mandi",
  "Weather",
  "Dashboard",
  "Knowledge Hub",
  "About",
  "Contact",
];

const karnatakaPrices: CropPrice[] = [
  { crop: "Rice", market: "Bengaluru", district: "Bengaluru Urban", current_price: 3120, predicted_price_30d: 3265, change_percent: "+4.6%", trend: "rising", confidence: 94, unit: "INR/quintal", last_updated: "2026-03-10" },
  { crop: "Wheat", market: "Hubballi", district: "Dharwad", current_price: 2525, predicted_price_30d: 2612, change_percent: "+3.4%", trend: "rising", confidence: 93, unit: "INR/quintal", last_updated: "2026-03-10" },
  { crop: "Maize", market: "Davanagere", district: "Davanagere", current_price: 2280, predicted_price_30d: 2325, change_percent: "+2.0%", trend: "stable", confidence: 91, unit: "INR/quintal", last_updated: "2026-03-10" },
  { crop: "Soybean", market: "Kalaburagi", district: "Kalaburagi", current_price: 4890, predicted_price_30d: 5010, change_percent: "+2.5%", trend: "rising", confidence: 90, unit: "INR/quintal", last_updated: "2026-03-10" },
  { crop: "Cotton", market: "Raichur", district: "Raichur", current_price: 7850, predicted_price_30d: 7720, change_percent: "-1.7%", trend: "falling", confidence: 89, unit: "INR/quintal", last_updated: "2026-03-10" },
  { crop: "Sugarcane", market: "Mandya", district: "Mandya", current_price: 348, predicted_price_30d: 362, change_percent: "+4.0%", trend: "rising", confidence: 94, unit: "INR/quintal", last_updated: "2026-03-10" },
  { crop: "Onion", market: "Mysuru", district: "Mysuru", current_price: 2150, predicted_price_30d: 2430, change_percent: "+13.0%", trend: "rising", confidence: 92, unit: "INR/quintal", last_updated: "2026-03-10" },
  { crop: "Tomato", market: "Kolar", district: "Kolar", current_price: 1720, predicted_price_30d: 1940, change_percent: "+12.8%", trend: "rising", confidence: 90, unit: "INR/quintal", last_updated: "2026-03-10" },
  { crop: "Potato", market: "Belagavi", district: "Belagavi", current_price: 1990, predicted_price_30d: 2065, change_percent: "+3.8%", trend: "stable", confidence: 90, unit: "INR/quintal", last_updated: "2026-03-10" },
  { crop: "Groundnut", market: "Ballari", district: "Ballari", current_price: 6120, predicted_price_30d: 6260, change_percent: "+2.3%", trend: "rising", confidence: 92, unit: "INR/quintal", last_updated: "2026-03-10" },
  { crop: "Mustard", market: "Vijayapura", district: "Vijayapura", current_price: 5610, predicted_price_30d: 5485, change_percent: "-2.2%", trend: "falling", confidence: 88, unit: "INR/quintal", last_updated: "2026-03-10" },
  { crop: "Chana", market: "Shivamogga", district: "Shivamogga", current_price: 5270, predicted_price_30d: 5380, change_percent: "+2.1%", trend: "rising", confidence: 91, unit: "INR/quintal", last_updated: "2026-03-10" },
  { crop: "Tur Dal", market: "Bidar", district: "Bidar", current_price: 8520, predicted_price_30d: 8695, change_percent: "+2.0%", trend: "rising", confidence: 92, unit: "INR/quintal", last_updated: "2026-03-10" },
  { crop: "Jowar", market: "Bagalkot", district: "Bagalkot", current_price: 3390, predicted_price_30d: 3482, change_percent: "+2.7%", trend: "rising", confidence: 90, unit: "INR/quintal", last_updated: "2026-03-10" },
  { crop: "Bajra", market: "Chitradurga", district: "Chitradurga", current_price: 2840, predicted_price_30d: 2792, change_percent: "-1.6%", trend: "falling", confidence: 89, unit: "INR/quintal", last_updated: "2026-03-10" },
  { crop: "Sunflower", market: "Haveri", district: "Haveri", current_price: 5750, predicted_price_30d: 5890, change_percent: "+2.4%", trend: "rising", confidence: 91, unit: "INR/quintal", last_updated: "2026-03-10" },
  { crop: "Turmeric", market: "Hassan", district: "Hassan", current_price: 8610, predicted_price_30d: 9030, change_percent: "+4.9%", trend: "rising", confidence: 93, unit: "INR/quintal", last_updated: "2026-03-10" },
  { crop: "Chilli", market: "Koppal", district: "Koppal", current_price: 9240, predicted_price_30d: 8995, change_percent: "-2.7%", trend: "falling", confidence: 88, unit: "INR/quintal", last_updated: "2026-03-10" },
];

const historicalSeries = [
  { month: "Apr", current: 2050, low: 1920, high: 2140 },
  { month: "May", current: 2120, low: 1985, high: 2240 },
  { month: "Jun", current: 2260, low: 2130, high: 2390 },
  { month: "Jul", current: 2310, low: 2180, high: 2455 },
  { month: "Aug", current: 2280, low: 2150, high: 2420 },
  { month: "Sep", current: 2360, low: 2200, high: 2495 },
  { month: "Oct", current: 2450, low: 2310, high: 2610 },
  { month: "Nov", current: 2510, low: 2375, high: 2680 },
  { month: "Dec", current: 2470, low: 2330, high: 2640 },
  { month: "Jan", current: 2540, low: 2395, high: 2720 },
  { month: "Feb", current: 2580, low: 2455, high: 2750 },
  { month: "Mar", current: 2630, low: 2495, high: 2820 },
];

const weatherForecast = [
  { day: "Mon", temp: 31, rain: 30 },
  { day: "Tue", temp: 32, rain: 20 },
  { day: "Wed", temp: 30, rain: 55 },
  { day: "Thu", temp: 28, rain: 70 },
  { day: "Fri", temp: 29, rain: 45 },
  { day: "Sat", temp: 31, rain: 35 },
  { day: "Sun", temp: 32, rain: 20 },
];

const cropEconomics: CropEconomics[] = [
  { crop: "Rice", costPerAcre: 34000, expectedMargin: 22, seasonFit: ["Kharif", "Rabi"], note: "Stable demand and procurement support." },
  { crop: "Wheat", costPerAcre: 30000, expectedMargin: 19, seasonFit: ["Rabi"], note: "Good option in irrigated Rabi pockets." },
  { crop: "Maize", costPerAcre: 24000, expectedMargin: 26, seasonFit: ["Kharif", "Rabi"], note: "Lower input load with steady feed demand." },
  { crop: "Soybean", costPerAcre: 26000, expectedMargin: 24, seasonFit: ["Kharif"], note: "Profitable where rainfall is timely." },
  { crop: "Cotton", costPerAcre: 42000, expectedMargin: 18, seasonFit: ["Kharif"], note: "High input crop with stronger downside risk." },
  { crop: "Sugarcane", costPerAcre: 52000, expectedMargin: 21, seasonFit: ["Kharif", "Rabi"], note: "Requires sustained water and longer cycle." },
  { crop: "Onion", costPerAcre: 46000, expectedMargin: 35, seasonFit: ["Kharif", "Rabi", "Zaid"], note: "Strong upside with timing-based selling." },
  { crop: "Tomato", costPerAcre: 44000, expectedMargin: 32, seasonFit: ["Kharif", "Rabi", "Zaid"], note: "Fast cash crop with price volatility." },
  { crop: "Potato", costPerAcre: 38000, expectedMargin: 23, seasonFit: ["Rabi"], note: "Good returns with storage planning." },
  { crop: "Groundnut", costPerAcre: 28000, expectedMargin: 27, seasonFit: ["Kharif", "Rabi"], note: "Balanced risk and oilseed demand." },
  { crop: "Mustard", costPerAcre: 23000, expectedMargin: 16, seasonFit: ["Rabi"], note: "Lower margin under current trend." },
  { crop: "Chana", costPerAcre: 22000, expectedMargin: 25, seasonFit: ["Rabi"], note: "Reliable pulse demand and moderate costs." },
  { crop: "Tur Dal", costPerAcre: 27000, expectedMargin: 29, seasonFit: ["Kharif"], note: "High-value pulse for rainfed belts." },
  { crop: "Jowar", costPerAcre: 18000, expectedMargin: 21, seasonFit: ["Kharif", "Rabi"], note: "Budget-friendly for dryland areas." },
  { crop: "Bajra", costPerAcre: 17000, expectedMargin: 17, seasonFit: ["Kharif"], note: "Low cost but limited market upside now." },
  { crop: "Sunflower", costPerAcre: 25000, expectedMargin: 24, seasonFit: ["Kharif", "Rabi"], note: "Decent oilseed margins with irrigation." },
  { crop: "Turmeric", costPerAcre: 60000, expectedMargin: 34, seasonFit: ["Kharif"], note: "Premium return crop for higher budgets." },
  { crop: "Chilli", costPerAcre: 56000, expectedMargin: 20, seasonFit: ["Kharif", "Rabi"], note: "High input and weather-sensitive crop." },
];

const t = {
  en: {
    hero: "Grow Smarter. Earn Better. Plan with AI.",
    search: "Enter your location or crop name to get started",
  },
  hi: {
    hero: "Samajhdari se ugao. Behtar kamao. AI ke saath yojana banao.",
    search: "Shuru karne ke liye apna location ya fasal ka naam daalein",
  },
  kn: {
    hero: "ಚಾತುರ್ಯದಿಂದ ಬೆಳೆಸಿ. ಹೆಚ್ಚು ಸಂಪಾದಿಸಿ. AI ಜೊತೆ ಯೋಜಿಸಿ.",
    search: "ಪ್ರಾರಂಭಿಸಲು ನಿಮ್ಮ ಸ್ಥಳ ಅಥವಾ ಬೆಳೆ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
  },
};

export function App() {
  const [activePage, setActivePage] = useState<Page>("Home");
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const [toastList, setToastList] = useState<Toast[]>([]);
  const [showTop, setShowTop] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("Karnataka");
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem("agri-token")));
  const [priceLoading, setPriceLoading] = useState(false);
  const [predictionCrop, setPredictionCrop] = useState("Onion");
  const [selectedMarket, setSelectedMarket] = useState<CropPrice | null>(null);
  const [blogSearch, setBlogSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [budgetInput, setBudgetInput] = useState("200000");
  const [landInput, setLandInput] = useState("5");
  const [seasonInput, setSeasonInput] = useState<"Kharif" | "Rabi" | "Zaid">("Kharif");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowTop(window.scrollY > 480);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const desc = document.querySelector("meta[name='description']") ?? document.createElement("meta");
    desc.setAttribute("name", "description");
    desc.setAttribute("content", `AI Kishan Karnataka - ${activePage} for AI crop planning, mandi prices, and price prediction.`);
    document.head.appendChild(desc);
    document.title = `AI Kishan Karnataka | ${activePage}`;
    const canonical = document.querySelector("link[rel='canonical']") ?? document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    canonical.setAttribute("href", `https://aikishan.example/${activePage.toLowerCase().replace(/\s+/g, "-")}`);
    document.head.appendChild(canonical);
  }, [activePage]);

  useEffect(() => {
    const schemaTagId = "aikishan-schema";
    const existing = document.getElementById(schemaTagId);
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.id = schemaTagId;
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "AI Kishan - Smart Price Prediction & Crop Planning",
      url: "https://aikishan.example",
      description: "AI-powered agricultural intelligence platform for Karnataka farmers.",
      inLanguage: ["en", "hi", "kn"],
    });
    document.head.appendChild(script);
  }, []);

  const addToast = (message: string) => {
    const id = Date.now();
    setToastList((prev) => [...prev, { id, message }]);
    setTimeout(() => setToastList((prev) => prev.filter((toast) => toast.id !== id)), 2500);
  };

  const prediction = useMemo(() => {
    return karnatakaPrices.find((crop) => crop.crop === predictionCrop) ?? karnatakaPrices[0];
  }, [predictionCrop]);

  const comparisonMandis = useMemo(
    () => [
      { mandi: prediction.market, current: prediction.current_price, predicted: prediction.predicted_price_30d },
      { mandi: "Yeshwanthpur", current: prediction.current_price - 60, predicted: prediction.predicted_price_30d - 35 },
      { mandi: "APMC Mysuru", current: prediction.current_price + 45, predicted: prediction.predicted_price_30d + 30 },
    ],
    [prediction],
  );

  const budgetValue = useMemo(() => Number(budgetInput) || 0, [budgetInput]);
  const landValue = useMemo(() => Number(landInput) || 1, [landInput]);

  const budgetRecommendations = useMemo(() => {
    const byCrop = new Map(cropEconomics.map((item) => [item.crop, item]));
    return karnatakaPrices
      .map((priceRow) => {
        const econ = byCrop.get(priceRow.crop);
        if (!econ) return null;
        const requiredInvestment = Math.round(econ.costPerAcre * landValue);
        const projectedRevenue = Math.round(requiredInvestment * (1 + econ.expectedMargin / 100));
        const projectedProfit = projectedRevenue - requiredInvestment;
        const priceGrowth = ((priceRow.predicted_price_30d - priceRow.current_price) / priceRow.current_price) * 100;
        const seasonBonus = econ.seasonFit.includes(seasonInput) ? 14 : 0;
        const trendBonus = priceRow.trend === "rising" ? 18 : priceRow.trend === "stable" ? 10 : 2;
        const budgetScore = Math.min(24, (budgetValue / Math.max(requiredInvestment, 1)) * 24);
        const benefitScore = Math.round(
          Math.max(
            1,
            econ.expectedMargin * 1.1 + seasonBonus + trendBonus + budgetScore + priceGrowth * 1.6 + priceRow.confidence * 0.15,
          ),
        );
        return {
          crop: priceRow.crop,
          requiredInvestment,
          projectedProfit,
          projectedRevenue,
          benefitScore,
          confidence: priceRow.confidence,
          trend: priceRow.trend,
          fitsBudget: budgetValue >= requiredInvestment,
          note: econ.note,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .sort((a, b) => {
        if (a.fitsBudget !== b.fitsBudget) return a.fitsBudget ? -1 : 1;
        return b.benefitScore - a.benefitScore;
      })
      .slice(0, 5);
  }, [budgetValue, landValue, seasonInput]);

  const formatInr = (value: number) => `INR ${value.toLocaleString("en-IN")}`;

  const filteredBlog = useMemo(
    () =>
      [
        { title: "Kharif 2026 in Karnataka: Sowing Strategy by Rain Zone", category: "Market Tips" },
        { title: "PM-KISAN and Crop Insurance deadlines farmers should not miss", category: "Govt Schemes" },
        { title: "How precision soil testing improves tomato profits near Kolar", category: "Technology" },
        { title: "Organic jaggery success model from Mandya cooperatives", category: "Organic Farming" },
      ].filter((item) => item.title.toLowerCase().includes(blogSearch.toLowerCase()) || item.category.toLowerCase().includes(blogSearch.toLowerCase())),
    [blogSearch],
  );

  const exportPredictionPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("AI Kishan Karnataka - Price Prediction Report", 14, 18);
    doc.setFontSize(11);
    doc.text(`Crop: ${prediction.crop}`, 14, 32);
    doc.text(`Current Price: INR ${prediction.current_price}/${prediction.unit}`, 14, 40);
    doc.text(`30-day Prediction: INR ${prediction.predicted_price_30d}/${prediction.unit}`, 14, 48);
    doc.text(`Trend: ${prediction.trend.toUpperCase()} | Confidence: ${prediction.confidence}%`, 14, 56);
    doc.text("Recommendation: Sell in staggered lots across Bengaluru, Mysuru, and Kolar mandis.", 14, 66);
    doc.save(`ai-kishan-${prediction.crop.toLowerCase()}-prediction.pdf`);
    addToast("Prediction report downloaded as PDF");
  };

  const sharePrediction = async () => {
    const text = `${prediction.crop} in Karnataka: current INR ${prediction.current_price}, predicted INR ${prediction.predicted_price_30d} in 30 days.`;
    if (navigator.share) {
      await navigator.share({ title: "AI Kishan Prediction", text });
    } else {
      await navigator.clipboard.writeText(text);
      addToast("Prediction copied for sharing");
    }
  };

  const exportCropPlanPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("AI Kishan Karnataka - Crop Plan", 14, 20);
    doc.setFontSize(11);
    doc.text("Top recommendations: Turmeric, Onion, Maize, Chana, Groundnut", 14, 34);
    doc.text("Expected margin range: 24% to 38% based on input constraints.", 14, 42);
    doc.text("Water advisory: prioritize drip irrigation for tomato and chilli plots.", 14, 50);
    doc.save("ai-kishan-crop-plan.pdf");
    addToast("Crop plan downloaded as PDF");
  };

  const handleAuth = () => {
    if (isLoggedIn) {
      localStorage.removeItem("agri-token");
      setIsLoggedIn(false);
      addToast("Logged out");
      return;
    }
    localStorage.setItem("agri-token", "demo-token");
    setIsLoggedIn(true);
    addToast("Login successful");
  };

  const runPrediction = () => {
    setPriceLoading(true);
    setTimeout(() => {
      setPriceLoading(false);
      addToast(`Prediction updated for ${predictionCrop}`);
    }, 900);
  };

  const renderPage = () => {
    const sectionClass = "mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8";
    if (activePage === "Home") {
      return (
        <main>
          <section className="relative overflow-hidden border-b border-emerald-200 bg-gradient-to-br from-emerald-950 via-green-800 to-lime-700 text-white">
            <div className="absolute inset-0 opacity-20 [background:repeating-linear-gradient(160deg,transparent_0_18px,rgba(187,247,208,0.3)_18px_22px),radial-gradient(circle_at_20%_30%,#ffffff_0%,transparent_35%),radial-gradient(circle_at_80%_70%,#4ade80_0%,transparent_35%)]" />
            <div className={`${sectionClass} relative py-20`}>
              <p className="font-mono text-sm uppercase tracking-[0.22em] text-emerald-200">AI Kishan Karnataka</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">{t[lang].hero}</h1>
              <p className="mt-4 max-w-2xl text-emerald-100">AI-driven crop price prediction and planning for farmers, FPOs, and agribusiness stakeholders across Karnataka.</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t[lang].search}
                  className="w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white placeholder:text-emerald-100 focus:outline-none"
                />
                <button onClick={() => addToast(`Loaded intelligence for ${query}`)} className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-400">
                  Predict Prices Now
                </button>
                <button onClick={() => setActivePage("Crop Planning")} className="rounded-xl border border-white/40 px-5 py-3 font-semibold transition hover:bg-white/10">
                  Plan My Crop
                </button>
              </div>
            </div>
          </section>

          <section className={sectionClass}>
            <div className="grid gap-4 md:grid-cols-4">
              {[
                ["Farmers Helped", "1.2M+"],
                ["Crops Tracked", "18"],
                ["Prediction Accuracy", "94.5%"],
                ["Karnataka Districts", "31"],
              ].map(([label, value]) => (
                 <motion.div whileHover={{ y: -4 }} key={label} className="rounded-2xl border border-emerald-300 bg-emerald-50 p-5 shadow-sm">
                  <p className="text-sm text-slate-600">{label}</p>
                  <p className="mt-2 font-mono text-3xl font-bold text-emerald-800">{value}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-2xl font-semibold text-emerald-900">How It Works</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-4">
              {[
                "Enter your location and soil type",
                "AI analyzes weather, mandi and demand data",
                "Get crop recommendations and price forecasts",
                "Plan sowing and sell at high-value windows",
              ].map((item, index) => (
                 <motion.div key={item} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
                  <p className="font-mono text-sm text-emerald-700">Step {index + 1}</p>
                  <p className="mt-2 font-medium text-slate-800">{item}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="border-y border-emerald-200 bg-white py-4">
            <div className="marquee whitespace-nowrap text-sm font-medium text-emerald-900">
              {karnatakaPrices.map((crop) => `${crop.crop} ${crop.market}: INR ${crop.current_price} | Pred 30D: ${crop.predicted_price_30d} | `).join(" ")}
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-2xl font-semibold text-emerald-900">Farmer Testimonials</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                "AI Kishan helped me shift from single-crop risk to mixed cropping in Ballari.",
                "I sold onion two weeks later based on alerts and got 11% better price.",
                "The weather advisories reduced spray losses during unseasonal rain.",
              ].map((item) => (
                 <div key={item} className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <p className="text-slate-700">{item}</p>
                  <p className="mt-3 text-sm font-semibold text-emerald-700">Karnataka Farmer Network</p>
                </div>
              ))}
            </div>
          </section>

          <section className={`${sectionClass} pt-0`}>
            <h2 className="text-2xl font-semibold text-emerald-900">Trusted By</h2>
            <div className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Karnataka State Agriculture Department",
                "University of Agricultural Sciences Bengaluru",
                "FPO Network Karnataka",
                "Digital eNAM Integration Cell",
              ].map((partner) => (
                 <div key={partner} className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">{partner}</div>
              ))}
            </div>
          </section>
        </main>
      );
    }

    if (activePage === "Price Prediction") {
      return (
        <main className={sectionClass}>
          <p className="text-sm text-slate-500">Home / Price Prediction</p>
          <h2 className="mt-2 text-3xl font-bold text-emerald-900">AI Price Prediction Dashboard</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <h3 className="text-lg font-semibold">Prediction Inputs</h3>
              <label className="mt-4 block text-sm text-slate-700">State</label>
              <select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
                <option>Karnataka</option>
              </select>
              <label className="mt-4 block text-sm text-slate-700">District</label>
              <select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
                <option>Bengaluru Urban</option>
                <option>Mysuru</option>
                <option>Mandya</option>
                <option>Dharwad</option>
              </select>
              <label className="mt-4 block text-sm text-slate-700">Crop</label>
              <select value={predictionCrop} onChange={(event) => setPredictionCrop(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
                {karnatakaPrices.map((crop) => (
                  <option key={crop.crop}>{crop.crop}</option>
                ))}
              </select>
              <label className="mt-4 block text-sm text-slate-700">Timeframe</label>
              <select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
                <option>Next 7 days</option>
                <option>Next 30 days</option>
                <option>Next 3 months</option>
                <option>Next 6 months</option>
              </select>
              <label className="mt-4 block text-sm text-slate-700">Farm Area (acres)</label>
              <input
                value={landInput}
                onChange={(event) => setLandInput(event.target.value.replace(/[^\d.]/g, ""))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                placeholder="5"
              />
              <label className="mt-4 block text-sm text-slate-700">Available Budget (INR)</label>
              <input
                value={budgetInput}
                onChange={(event) => setBudgetInput(event.target.value.replace(/[^\d]/g, ""))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                placeholder="200000"
              />
              <label className="mt-4 block text-sm text-slate-700">Season</label>
              <select value={seasonInput} onChange={(event) => setSeasonInput(event.target.value as "Kharif" | "Rabi" | "Zaid")} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
                <option>Kharif</option>
                <option>Rabi</option>
                <option>Zaid</option>
              </select>
              <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-100 p-3 text-sm text-emerald-900">
                <p className="font-semibold">Budget Insight</p>
                <p className="mt-1">Top fit now: {budgetRecommendations[0]?.crop ?? "N/A"} ({budgetRecommendations[0]?.benefitScore ?? 0}/100 benefit score)</p>
              </div>
              <button onClick={runPrediction} className="mt-5 w-full rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-600">Run Prediction</button>
              <button onClick={exportPredictionPdf} className="mt-3 w-full rounded-lg border border-emerald-700 px-4 py-2 font-semibold text-emerald-700 hover:bg-emerald-50">Export Report as PDF</button>
              <button onClick={() => void sharePrediction()} className="mt-3 w-full rounded-lg border border-emerald-300 px-4 py-2 font-semibold text-emerald-900 hover:bg-emerald-100">Share Prediction</button>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <h3 className="text-lg font-semibold">Price Forecast with Confidence Interval</h3>
                {priceLoading ? (
                  <div className="mt-5 h-72 animate-pulse rounded-xl bg-slate-100" />
                ) : (
                  <div className="mt-5 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={historicalSeries}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="high" fill="#bbf7d0" stroke="#16a34a" fillOpacity={0.3} />
                        <Area type="monotone" dataKey="low" fill="#bbf7d0" stroke="#15803d" fillOpacity={0.15} />
                         <Line type="monotone" dataKey="current" stroke="#15803d" strokeWidth={3} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                 <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-sm text-slate-600">Current Price</p>
                  <p className="mt-1 font-mono text-2xl font-bold text-emerald-900">INR {prediction.current_price}</p>
                </div>
                 <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-sm text-slate-600">Predicted 30D</p>
                  <p className="mt-1 font-mono text-2xl font-bold text-emerald-700">INR {prediction.predicted_price_30d}</p>
                </div>
                 <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-sm text-slate-600">Trend Analysis</p>
                  <p className="mt-1 text-2xl font-bold capitalize text-emerald-700">{prediction.trend}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <h3 className="text-lg font-semibold">Crop Recommendation for Benefit and Budget</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Personalized for {landValue} acre(s), {seasonInput} season, and budget {formatInr(budgetValue)}.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-slate-600">
                        <th className="py-2">Crop</th>
                        <th className="py-2">Required Investment</th>
                        <th className="py-2">Expected Profit</th>
                        <th className="py-2">Benefit Score</th>
                        <th className="py-2">Budget Fit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {budgetRecommendations.map((row) => (
                        <tr key={row.crop} className="border-b border-slate-100">
                          <td className="py-2 font-medium text-emerald-900">{row.crop}</td>
                          <td className="py-2">{formatInr(row.requiredInvestment)}</td>
                          <td className="py-2">{formatInr(row.projectedProfit)}</td>
                          <td className="py-2 font-semibold">{row.benefitScore}/100</td>
                          <td className="py-2">
                            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${row.fitsBudget ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                              {row.fitsBudget ? "Within Budget" : "Budget Gap"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-sm text-slate-600">Why #1 recommendation: {budgetRecommendations[0]?.note ?? "Adjust budget or area for stronger recommendations."}</p>
              </div>

               <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <h3 className="text-lg font-semibold">Historical Price Data (Karnataka, last 1 year)</h3>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-slate-600">
                        <th className="py-2">Month</th>
                        <th className="py-2">Price (INR)</th>
                        <th className="py-2">Low</th>
                        <th className="py-2">High</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historicalSeries.map((row) => (
                        <tr key={row.month} className="border-b border-slate-100">
                          <td className="py-2">{row.month}</td>
                          <td className="py-2">{row.current}</td>
                          <td className="py-2">{row.low}</td>
                          <td className="py-2">{row.high}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-sm text-slate-600">Best time to sell: split sale window between week 2 and week 4 of next month.</p>
              </div>

               <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <h3 className="text-lg font-semibold">Price Alerts and Mandi Comparison</h3>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <input placeholder="Email" className="rounded-lg border border-slate-300 px-3 py-2" />
                  <input placeholder="SMS number" className="rounded-lg border border-slate-300 px-3 py-2" />
                  <button onClick={() => addToast("Price alerts subscribed")} className="rounded-lg bg-emerald-700 px-3 py-2 font-semibold text-white">Subscribe</button>
                </div>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-slate-600">
                        <th className="py-2">Mandi</th>
                        <th className="py-2">Current</th>
                        <th className="py-2">Predicted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonMandis.map((row) => (
                        <tr key={row.mandi} className="border-b border-slate-100">
                          <td className="py-2">{row.mandi}</td>
                          <td className="py-2">{row.current}</td>
                          <td className="py-2">{row.predicted}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      );
    }

    if (activePage === "Crop Planning") {
      return (
        <main className={sectionClass}>
          <p className="text-sm text-slate-500">Home / Crop Planning</p>
          <h2 className="mt-2 text-3xl font-bold text-emerald-900">Smart Crop Recommendation</h2>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-2/3 bg-emerald-700" />
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
            <form className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <h3 className="text-lg font-semibold">Farm Inputs</h3>
              <div className="mt-3 grid gap-3">
                {[
                  ["Location", "Mandya, Karnataka"],
                  ["Land area", "5 acres"],
                  ["Soil type", "Alluvial"],
                  ["Water availability", "Irrigated"],
                  ["Season", "Kharif"],
                  ["Budget", "INR 2,00,000"],
                  ["Previous crop", "Sugarcane"],
                ].map(([label, value]) => (
                  <label key={label} className="text-sm text-slate-700">
                    {label}
                    <input defaultValue={value} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
                  </label>
                ))}
              </div>
              <button type="button" onClick={() => addToast("AI crop recommendations updated")} className="mt-4 w-full rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white">Generate Plan</button>
              <button type="button" onClick={exportCropPlanPdf} className="mt-3 w-full rounded-lg border border-emerald-700 px-4 py-2 font-semibold text-emerald-700">Download Crop Plan PDF</button>
            </form>

            <div className="space-y-6">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <h3 className="text-lg font-semibold">Top 5 Recommended Crops</h3>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-slate-600">
                        <th className="py-2">Crop</th>
                        <th className="py-2">Profitability</th>
                        <th className="py-2">Yield/acre</th>
                        <th className="py-2">Risk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Turmeric", "92/100", "30 quintal", "Low"],
                        ["Onion", "89/100", "95 quintal", "Medium"],
                        ["Maize", "84/100", "28 quintal", "Low"],
                        ["Groundnut", "82/100", "14 quintal", "Medium"],
                        ["Chana", "80/100", "11 quintal", "Low"],
                      ].map((row) => (
                        <tr key={row[0]} className="border-b border-slate-100">
                          {row.map((item) => (
                            <td key={item} className="py-2">{item}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-sm text-slate-600">Includes crop calendar, fertilizer kit, seed treatment plan, and supplier suggestions within 30 km.</p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <h3 className="text-lg font-semibold">Crop Comparison Tool</h3>
                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { crop: "Turmeric", margin: 38, cost: 62 },
                        { crop: "Onion", margin: 33, cost: 58 },
                        { crop: "Maize", margin: 28, cost: 44 },
                        { crop: "Groundnut", margin: 26, cost: 48 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="crop" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="margin" stroke="#16a34a" strokeWidth={2} />
                      <Line type="monotone" dataKey="cost" stroke="#65a30d" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </main>
      );
    }

    if (activePage === "Live Mandi") {
      return (
        <main className={sectionClass}>
          <p className="text-sm text-slate-500">Home / Live Mandi</p>
          <h2 className="mt-2 text-3xl font-bold text-emerald-900">Live Karnataka Mandi Prices</h2>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600">
                  <th className="py-2">Crop</th>
                  <th className="py-2">Mandi</th>
                  <th className="py-2">District</th>
                  <th className="py-2">Current</th>
                  <th className="py-2">30D Pred</th>
                  <th className="py-2">Trend</th>
                </tr>
              </thead>
              <tbody>
                {karnatakaPrices.map((item) => (
                  <tr key={item.crop} className="cursor-pointer border-b border-slate-100 hover:bg-emerald-50" onClick={() => setSelectedMarket(item)}>
                    <td className="py-2">{item.crop}</td>
                    <td className="py-2">{item.market}</td>
                    <td className="py-2">{item.district}</td>
                    <td className="py-2 font-mono">{item.current_price}</td>
                    <td className="py-2 font-mono">{item.predicted_price_30d}</td>
                    <td className="py-2 capitalize">{item.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-slate-500">Source: Agmarknet, eNAM mock feed refreshed at 08:30 IST.</p>
          </div>
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <h3 className="font-semibold">Nearby Mandi Locator</h3>
            <iframe
              title="Karnataka mandi map"
              className="mt-3 h-72 w-full rounded-xl"
              loading="lazy"
              src="https://maps.google.com/maps?q=Karnataka%20Mandi&t=&z=6&ie=UTF8&iwloc=&output=embed"
            />
          </div>
        </main>
      );
    }

    if (activePage === "Weather") {
      return (
        <main className={sectionClass}>
          <p className="text-sm text-slate-500">Home / Weather</p>
          <h2 className="mt-2 text-3xl font-bold text-emerald-900">Weather and Advisory</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <h3 className="font-semibold">7-Day Forecast (Mandya)</h3>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={weatherForecast}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line yAxisId="left" dataKey="temp" stroke="#15803d" strokeWidth={2} />
                    <Area yAxisId="right" dataKey="rain" stroke="#166534" fill="#bbf7d0" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <h3 className="font-semibold">Advisories</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="rounded-lg bg-emerald-50 p-3">Heavy rain expected Thursday: delay pesticide spraying by 48 hours.</li>
                <li className="rounded-lg bg-green-50 p-3">Night temperature dip expected in north Karnataka: use light mulching in vegetable belts.</li>
                <li className="rounded-lg bg-amber-50 p-3">Pest alert: leaf miner risk high in tomato due to humidity spike.</li>
              </ul>
              <p className="mt-4 text-xs text-slate-500">Data pipeline: IMD + OpenWeather + local station interpolation.</p>
              <p className="mt-2 text-xs text-slate-500">15-day outlook: above-normal showers expected in coastal and Malnad belts.</p>
            </div>
          </div>
        </main>
      );
    }

    if (activePage === "Dashboard") {
      return (
        <main className={sectionClass}>
          <p className="text-sm text-slate-500">Home / Dashboard</p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-3xl font-bold text-emerald-900">Farmer Dashboard</h2>
             <button onClick={handleAuth} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">{isLoggedIn ? "Logout" : "Signup / Login"}</button>
          </div>
          {!isLoggedIn ? (
             <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
              <p className="text-slate-700">Login to view your crop plans, watchlist, alerts, and profit tracker.</p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                ["My Crops", "Onion, Maize, Tur Dal"],
                ["Profit/Loss", "+INR 1,28,000"],
                ["Alerts", "4 active"],
              ].map(([title, value]) => (
                 <div key={title} className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <p className="text-sm text-slate-500">{title}</p>
                  <p className="mt-2 font-semibold text-emerald-900">{value}</p>
                </div>
              ))}
               <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 md:col-span-3">
                <h3 className="font-semibold">Admin Content Console</h3>
                <p className="mt-2 text-sm text-slate-600">Publish scheme updates, verify mandi feed quality, and manage farmer advisories.</p>
              </div>
            </div>
          )}
        </main>
      );
    }

    if (activePage === "Knowledge Hub") {
      return (
        <main className={sectionClass}>
          <p className="text-sm text-slate-500">Home / Knowledge Hub</p>
          <h2 className="mt-2 text-3xl font-bold text-emerald-900">Knowledge Hub</h2>
          <input value={blogSearch} onChange={(event) => setBlogSearch(event.target.value)} className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-2" placeholder="Search articles, reports, government schemes" />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {filteredBlog.map((article) => (
               <article key={article.title} className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="text-xs uppercase tracking-wider text-emerald-700">{article.category}</p>
                <h3 className="mt-2 font-semibold text-slate-900">{article.title}</h3>
                <button className="mt-4 text-sm font-semibold text-emerald-700">Read more</button>
              </article>
            ))}
          </div>
        </main>
      );
    }

    if (activePage === "About") {
      return (
        <main className={sectionClass}>
          <p className="text-sm text-slate-500">Home / About</p>
          <h2 className="mt-2 text-3xl font-bold text-emerald-900">About AI Kishan</h2>
          <p className="mt-4 max-w-3xl text-slate-700">Our mission is to make Karnataka farming more resilient through transparent market intelligence, explainable AI models, and region-specific advisories.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ["AI/ML Stack", "Prophet + LSTM hybrid forecasting and tree-based recommendation models"],
              ["Data Sources", "Agmarknet, eNAM, IMD, soil cards, policy updates"],
              ["Impact", "Reduced distress sales in pilot clusters by 18%"],
            ].map(([title, value]) => (
               <div key={title} className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <h3 className="font-semibold text-emerald-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-700">{value}</p>
              </div>
            ))}
          </div>
        </main>
      );
    }

    return (
      <main className={sectionClass}>
        <p className="text-sm text-slate-500">Home / Contact</p>
        <h2 className="mt-2 text-3xl font-bold text-emerald-900">Contact Us</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <form className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <label className="block text-sm text-slate-700">
              Name
              <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
            </label>
            <label className="mt-3 block text-sm text-slate-700">
              Email
              <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
            </label>
            <label className="mt-3 block text-sm text-slate-700">
              Message
              <textarea className="mt-1 h-28 w-full rounded-lg border border-slate-300 px-3 py-2" />
            </label>
            <button type="button" onClick={() => addToast("Message submitted") } className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white">Send</button>
          </form>
          <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-sm text-slate-700">Phone: +91-80000-AIKISHAN</p>
            <p className="text-sm text-slate-700">Email: support@aikishan.ai</p>
            <iframe title="Office map" className="h-56 w-full rounded-xl" loading="lazy" src="https://maps.google.com/maps?q=Bengaluru&t=&z=12&ie=UTF8&iwloc=&output=embed" />
            <details className="rounded-lg bg-slate-50 p-3">
              <summary className="cursor-pointer font-medium">FAQ: How do alerts work?</summary>
              <p className="mt-2 text-sm text-slate-600">You can subscribe by SMS or email from Price Prediction page and choose crop + threshold.</p>
            </details>
          </div>
        </div>
      </main>
    );
  };

  return (
    <div className={darkMode ? "min-h-screen bg-emerald-950 text-emerald-50" : "min-h-screen bg-gradient-to-b from-lime-50 via-emerald-50 to-green-100 text-slate-900"}>
      <header className={`sticky top-0 z-40 transition ${scrolled ? "bg-emerald-50/95 shadow-sm backdrop-blur" : "bg-transparent"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <button className="text-left" onClick={() => setActivePage("Home")}>
            <p className="text-xl font-bold text-emerald-800">AI Kishan</p>
            <p className="text-xs text-emerald-700">Smart Price Prediction & Crop Planning</p>
          </button>
          <div className="relative hidden items-center gap-4 lg:flex">
            {pages.map((page) => (
               <button key={page} onClick={() => setActivePage(page)} className={`text-sm ${activePage === page ? "font-semibold text-emerald-700" : "text-emerald-900"}`}>
                {page}
              </button>
            ))}
             <button onClick={() => setMegaOpen((prev) => !prev)} className="rounded-lg border border-emerald-300 bg-emerald-100 px-3 py-1 text-sm">Explore</button>
            {megaOpen && (
               <div className="absolute right-0 top-10 w-[520px] rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-lg">
                <p className="text-sm font-semibold text-emerald-800">Platform Modules</p>
                 <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-700">
                   <button onClick={() => setActivePage("Price Prediction")} className="rounded-lg bg-emerald-100 p-2 text-left">Forecasting Engine</button>
                   <button onClick={() => setActivePage("Crop Planning")} className="rounded-lg bg-emerald-100 p-2 text-left">Planning Assistant</button>
                   <button onClick={() => setActivePage("Live Mandi")} className="rounded-lg bg-emerald-100 p-2 text-left">Mandi Intelligence</button>
                   <button onClick={() => setActivePage("Dashboard")} className="rounded-lg bg-emerald-100 p-2 text-left">Farmer Command Center</button>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
             <button onClick={() => setShowMenu((prev) => !prev)} className="rounded-lg border border-emerald-300 bg-emerald-100 px-3 py-1 text-sm lg:hidden">Menu</button>
             <button onClick={() => setDarkMode((prev) => !prev)} className="rounded-lg border border-emerald-300 bg-emerald-100 px-3 py-1 text-sm">Theme</button>
             <select value={lang} onChange={(event) => setLang(event.target.value as Lang)} className="rounded-lg border border-emerald-300 bg-emerald-100 px-2 py-1 text-sm">
               <option value="en">English</option>
               <option value="hi">Hindi</option>
               <option value="kn">Kannada</option>
             </select>
          </div>
        </div>
        {showMenu && (
          <div className="border-t border-emerald-200 bg-emerald-50 px-4 py-3 lg:hidden">
            <div className="grid grid-cols-2 gap-2">
              {pages.map((page) => (
                <button key={page} onClick={() => { setActivePage(page); setShowMenu(false); }} className="rounded-lg border border-emerald-200 bg-emerald-100 px-3 py-2 text-left text-sm">
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <AnimatePresence mode="wait">
        <motion.div key={activePage} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
          {renderPage()}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {selectedMarket && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-black/35 p-4">
            <div className="w-full max-w-md rounded-2xl bg-emerald-50 p-5">
              <h3 className="text-lg font-semibold">{selectedMarket.crop} - {selectedMarket.market}</h3>
              <p className="mt-2 text-sm text-slate-600">Current: INR {selectedMarket.current_price}</p>
              <p className="text-sm text-slate-600">Prediction 30D: INR {selectedMarket.predicted_price_30d}</p>
              <p className="text-sm text-slate-600">Confidence: {selectedMarket.confidence}%</p>
              <button onClick={() => setSelectedMarket(null)} className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">Close</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-4 right-4 rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">
          Top
        </button>
      )}

      <div className="fixed right-4 top-20 z-50 space-y-2">
        {toastList.map((toast) => (
          <div key={toast.id} className="rounded-lg bg-emerald-900 px-3 py-2 text-sm text-white shadow">{toast.message}</div>
        ))}
      </div>
    </div>
  );
}
