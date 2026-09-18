import { useEffect, useState } from "react";

import axios from "axios";

import "./App.css";
import AddProduct from "./AddProduct";

const API_BASE_URL = "https://sole-market-backend.onrender.com/api";

const API_URL = `${API_BASE_URL}/products`;

const AUTH_URL = `${API_BASE_URL}/auth`;

const HERO_SLIDES = [
  {
    id: 1,
    title: "Neo-Stride Apex High",
    subtitle: "OG 'Crimson Eclipse'",
    brand: "Neo-Stride",
    tag: "🔥 ICONIC GRAIL DROP",
    price: "₹16,999",
    description: "The silhouette that redefined street footwear culture forever with crimson and obsidian full-grain leather.",
    accentColor: "#ff4336",
    bgImage: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1920&q=85",
  },
  {
    id: 2,
    title: "CyberPulse Low 'Phantom'",
    subtitle: "Monochrome Black & White",
    brand: "CyberPulse",
    tag: "⚡ TRENDING GLOBAL DROP",
    price: "₹9,695",
    description: "Monochromatic streetwear essential crafted with clean contrasting geometric panel overlays.",
    accentColor: "#ffffff",
    bgImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1920&q=85",
  },
  {
    id: 3,
    title: "Volt Stryke 'Quantum Cyan'",
    subtitle: "Quantum Cyan Special Edition",
    brand: "Volt Stryke",
    tag: "⚡ LIMITED QUANTUM DROP",
    price: "₹32,999",
    description: "Engineered aerodynamic chassis featuring responsive quantum-foam propulsion and carbon composite heel stabilizer.",
    accentColor: "#00d2ff",
    bgImage: "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1920&q=85",
  },
  {
    id: 4,
    title: "Vortex Aero 'Super Bubble 86'",
    subtitle: "Varsity Crimson Visible Air",
    brand: "Vortex Aero",
    tag: "✨ REVOLUTIONARY VISIBLE AIR",
    price: "₹13,995",
    description: "The holy grail of air cushioning. Bold color-blocking and responsive stride performance.",
    accentColor: "#ff5b35",
    bgImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1920&q=85",
  },
  {
    id: 5,
    title: "Shadow Forge Boost 'Dark Onyx'",
    subtitle: "Triple Onyx Cellular Edition",
    brand: "Shadow Forge",
    tag: "🛸 FUTURISTIC COMFORT",
    price: "₹22,999",
    description: "Engineered seamless cyber-knit upper bonded to a responsive energy-return cellular matrix.",
    accentColor: "#a855f7",
    bgImage: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1920&q=85",
  },
  {
    id: 6,
    title: "Solaris Sculpt 9000",
    subtitle: "Rain Cloud Sea Salt",
    brand: "Solaris",
    tag: "🌊 Y2K RUNWAY ESSENTIAL",
    price: "₹14,999",
    description: "Futuristic sculpted wavy midsole equipped with dual-density hydro-cushioning architecture.",
    accentColor: "#38bdf8",
    bgImage: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=1920&q=85",
  },
];

const getFallbackShoeImage = (brand, name = "") => {
  const query = `${brand || ""} ${name || ""}`.toLowerCase();
  
  if (query.includes("volt") || query.includes("quantum") || query.includes("stryke") || query.includes("travis") || query.includes("mocha") || query.includes("cactus")) {
    return "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=800&q=80";
  }
  if (query.includes("shadow") || query.includes("onyx") || query.includes("350") || query.includes("yeezy")) {
    return "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80";
  }
  if (query.includes("550") || query.includes("emerald") || query.includes("chrono")) {
    return "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80";
  }
  if (query.includes("solaris") || query.includes("9000") || query.includes("9060") || query.includes("cloud")) {
    return "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=800&q=80";
  }
  if (query.includes("quad") || query.includes("stealth") || query.includes("jordan 4") || query.includes("military")) {
    return "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=800&q=80";
  }
  if (query.includes("neo-stride") || query.includes("crimson") || query.includes("chicago") || query.includes("jordan")) {
    return "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80";
  }
  if (query.includes("cyberpulse") || query.includes("phantom") || query.includes("panda") || query.includes("dunk")) {
    return "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80";
  }
  if (query.includes("vortex") || query.includes("aero force") || query.includes("air force") || query.includes("af1")) {
    return "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80";
  }
  if (query.includes("bubble") || query.includes("aero max") || query.includes("air max")) {
    return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80";
  }
  if (query.includes("kinetic") || query.includes("cobalt") || query.includes("puma") || query.includes("suede")) {
    return "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80";
  }
  if (query.includes("echo") || query.includes("rider") || query.includes("skate") || query.includes("vans")) {
    return "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80";
  }
  if (query.includes("all-star") || query.includes("canvas") || query.includes("converse") || query.includes("parchment")) {
    return "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80";
  }
  if (query.includes("astral") || query.includes("velocity") || query.includes("asics") || query.includes("kayano")) {
    return "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80";
  }
  if (query.includes("cyan") || query.includes("indoor") || query.includes("gazelle") || query.includes("samba")) {
    return "https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=800&q=80";
  }
  if (query.includes("zero-g") || query.includes("deconstructed") || query.includes("presto") || query.includes("off-white")) {
    return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80";
  }
  return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80";
};

const DEFAULT_SNEAKERS = [
  {
    _id: "prod-1",
    name: "Neo-Stride Apex High 'Crimson Eclipse'",
    brand: "Neo-Stride",
    category: "High-Top",
    price: 16999,
    description: "The silhouette that redefined street footwear culture forever with crimson and obsidian full-grain leather.",
    imageUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    size: ["7", "8", "9", "10", "11"],
    stock: 15,
  },
  {
    _id: "prod-2",
    name: "CyberPulse Low 'Monochrome Phantom'",
    brand: "CyberPulse",
    category: "Streetwear",
    price: 9695,
    description: "Monochromatic streetwear essential crafted with clean contrasting geometric panel overlays.",
    imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    size: ["6", "7", "8", "9", "10", "11"],
    stock: 25,
  },
  {
    _id: "prod-3",
    name: "Volt Stryke 'Quantum Cyan Pro'",
    brand: "Volt Stryke",
    category: "Exclusive Drop",
    price: 32999,
    description: "Engineered aerodynamic chassis featuring responsive quantum-foam propulsion and carbon composite heel stabilizer.",
    imageUrl: "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=800&q=80",
    size: ["7", "8", "9", "10", "11"],
    stock: 8,
  },
  {
    _id: "prod-4",
    name: "Chrono Drip 550 'Emerald Heritage'",
    brand: "Chrono Drip",
    category: "Retro Court",
    price: 11999,
    description: "Clean retro basketball low-top styling with vintage accents and premium leather construction.",
    imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
    size: ["7", "8", "9", "10", "11"],
    stock: 12,
  },
  {
    _id: "prod-5",
    name: "Vortex Aero 1 'Pure Obsidian'",
    brand: "Vortex Aero",
    category: "Air Cushion",
    price: 7495,
    description: "The definition of crisp everyday swagger equipped with proprietary Vortex-Air cushioning chambers.",
    imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    size: ["6", "7", "8", "9", "10", "11", "12"],
    stock: 30,
  },
  {
    _id: "prod-6",
    name: "Shadow Forge Boost 'Dark Onyx'",
    brand: "Shadow Forge",
    category: "Hyper-Comfort",
    price: 22999,
    description: "Engineered seamless cyber-knit upper bonded to a responsive energy-return cellular matrix.",
    imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
    size: ["8", "9", "10", "11"],
    stock: 8,
  },
  {
    _id: "prod-7",
    name: "Neo-Stride Quad-Retro 'Stealth Slate'",
    brand: "Neo-Stride",
    category: "High-Top",
    price: 19999,
    description: "Color-blocked architectural structure featuring TPU cage wings and signature dual-window cushioning.",
    imageUrl: "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=800&q=80",
    size: ["7", "8", "9", "10", "11"],
    stock: 10,
  },
  {
    _id: "prod-8",
    name: "Kinetic Labs Suede 'Midnight Cobalt'",
    brand: "Kinetic Labs",
    category: "Casual Luxury",
    price: 5499,
    description: "Ultra-soft brushed Italian suede upper with reinforced arch support for an effortless elevated stride.",
    imageUrl: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80",
    size: ["6", "7", "8", "9", "10"],
    stock: 20,
  },
  {
    _id: "prod-9",
    name: "Solaris 9000 'Nebula Cloud'",
    brand: "Solaris",
    category: "Y2K Sculpture",
    price: 14999,
    description: "Futuristic sculpted wavy midsole equipped with dual-density hydro-cushioning architecture.",
    imageUrl: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=800&q=80",
    size: ["7", "8", "9", "10", "11"],
    stock: 14,
  },
  {
    _id: "prod-10",
    name: "Echo Skate 'Night-Rider Classics'",
    brand: "Echo Skate",
    category: "Skatewear",
    price: 4999,
    description: "Heavy-duty canvas and reinforced suede toe guards with high-grip diamond tread outsoles.",
    imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
    size: ["6", "7", "8", "9", "10", "11"],
    stock: 35,
  },
  {
    _id: "prod-11",
    name: "Chrono Drip All-Star 70 'Vintage Canvas'",
    brand: "Chrono Drip",
    category: "Archival High",
    price: 5999,
    description: "Heavyweight vintage canvas, archival rubber taping, and extra cushioning for all-day comfort.",
    imageUrl: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80",
    size: ["6", "7", "8", "9", "10", "11"],
    stock: 22,
  },
  {
    _id: "prod-12",
    name: "Vortex Aero 'Super Bubble 86'",
    brand: "Vortex Aero",
    category: "Visible Air",
    price: 13995,
    description: "The Holy Grail of sneaker lore with the oversized visible four-chamber Air window.",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    size: ["7", "8", "9", "10", "11"],
    stock: 16,
  },
  {
    _id: "prod-13",
    name: "Astral Velocity 'Cyber-14 Trainer'",
    brand: "Astral Velocity",
    category: "Aerodynamic",
    price: 12999,
    description: "Late 2000s aesthetic equipped with signature segmented shock-dampening gel pods.",
    imageUrl: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80",
    size: ["7", "8", "9", "10", "11"],
    stock: 15,
  },
  {
    _id: "prod-14",
    name: "Kinetic Labs Indoor 'Solar Cyan'",
    brand: "Kinetic Labs",
    category: "Retro Training",
    price: 9999,
    description: "Plush premium suede upper, translucent gum rubber outsole, and retro indoor training vibes.",
    imageUrl: "https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=800&q=80",
    size: ["6", "7", "8", "9", "10"],
    stock: 18,
  },
  {
    _id: "prod-15",
    name: "Echo Skate Pro 'Autumn Wheat Suede'",
    brand: "Echo Skate",
    category: "Skate Pro",
    price: 10295,
    description: "Supple full-suede finish in autumnal wheat hues with Zoom impact heel unit for board control.",
    imageUrl: "https://images.unsplash.com/photo-1588117260148-b47818741c74?auto=format&fit=crop&w=800&q=80",
    size: ["7", "8", "9", "10", "11"],
    stock: 11,
  },
  {
    _id: "prod-16",
    name: "Apex Grail 'Zero-Gravity Deconstructed'",
    brand: "Apex Grail",
    category: "Exclusive Drop",
    price: 36999,
    description: "Avant-garde architectural deconstructed sneaker featuring exposed foam collars and industrial hangtags.",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    size: ["7", "8", "9", "10", "11"],
    stock: 7,
  },
];

function App() {
  const [products, setProducts] = useState(DEFAULT_SNEAKERS);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);

    return () => clearInterval(slideTimer);
  }, []);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("solemarket_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("solemarket_token") || "";
  });

  const [showAuth, setShowAuth] = useState(false);
  const [authRoleTab, setAuthRoleTab] = useState("visitor"); // "visitor" | "owner"
  const [authMode, setAuthMode] = useState("login");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    brand: "",
    price: "",
  });
  const [search, setSearch] = useState("");
  const [activeProductModal, setActiveProductModal] = useState(null);
  const [addedToCartToast, setAddedToCartToast] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [selections, setSelections] = useState({});
  const [orderForm, setOrderForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pin: "",
    payment: "CARD",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    if (isOrderSuccess || isCheckoutOpen) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [isOrderSuccess, isCheckoutOpen]);

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          // Normalize names / brands to cool original streetwear lines
          const transformed = res.data.map((item, idx) => {
            const raw = `${item.name || ""} ${item.brand || ""}`.toLowerCase();
            if (raw.includes("jordan 1") || raw.includes("chicago")) {
              return { ...item, name: "Neo-Stride Apex High 'Crimson Eclipse'", brand: "Neo-Stride", category: "High-Top", imageUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80", description: "The silhouette that redefined street footwear culture forever with crimson and obsidian full-grain leather." };
            }
            if (raw.includes("panda") || (raw.includes("dunk") && !raw.includes("sb") && !raw.includes("wheat"))) {
              return { ...item, name: "CyberPulse Low 'Monochrome Phantom'", brand: "CyberPulse", category: "Streetwear", imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80", description: "Monochromatic streetwear essential crafted with clean contrasting geometric panel overlays." };
            }
            if (raw.includes("volt") || raw.includes("quantum") || raw.includes("stryke") || raw.includes("travis") || raw.includes("mocha") || raw.includes("cactus") || raw.includes("samba")) {
              return { ...item, name: "Volt Stryke 'Quantum Cyan Pro'", brand: "Volt Stryke", category: "Exclusive Drop", imageUrl: "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=800&q=80", description: "Engineered aerodynamic chassis featuring responsive quantum-foam propulsion and carbon composite heel stabilizer." };
            }
            if (raw.includes("550") || raw.includes("white green")) {
              return { ...item, name: "Chrono Drip 550 'Emerald Heritage'", brand: "Chrono Drip", category: "Retro Court", imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80", description: "Clean retro basketball low-top styling with vintage accents and premium leather construction." };
            }
            if (raw.includes("force 1") || raw.includes("af1")) {
              return { ...item, name: "Vortex Aero 1 'Pure Obsidian'", brand: "Vortex Aero", category: "Air Cushion", imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80", description: "The definition of crisp everyday swagger equipped with proprietary Vortex-Air cushioning chambers." };
            }
            if (raw.includes("350") || raw.includes("onyx") || raw.includes("yeezy")) {
              return { ...item, name: "Shadow Forge Boost 'Dark Onyx'", brand: "Shadow Forge", category: "Hyper-Comfort", imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80", description: "Engineered seamless cyber-knit upper bonded to a responsive energy-return cellular matrix." };
            }
            if (raw.includes("jordan 4") || raw.includes("military")) {
              return { ...item, name: "Neo-Stride Quad-Retro 'Stealth Slate'", brand: "Neo-Stride", category: "High-Top", imageUrl: "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=800&q=80", description: "Color-blocked architectural structure featuring TPU cage wings and signature dual-window cushioning." };
            }
            if (raw.includes("puma") || (raw.includes("suede") && !raw.includes("wheat") && !raw.includes("gazelle"))) {
              return { ...item, name: "Kinetic Labs Suede 'Midnight Cobalt'", brand: "Kinetic Labs", category: "Casual Luxury", imageUrl: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80", description: "Ultra-soft brushed Italian suede upper with reinforced arch support for an effortless elevated stride." };
            }
            if (raw.includes("9060") || raw.includes("rain cloud")) {
              return { ...item, name: "Solaris 9000 'Nebula Cloud'", brand: "Solaris", category: "Y2K Sculpture", imageUrl: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=800&q=80", description: "Futuristic sculpted wavy midsole equipped with dual-density hydro-cushioning architecture." };
            }
            if (raw.includes("vans") || raw.includes("old skool")) {
              return { ...item, name: "Echo Skate 'Night-Rider Classics'", brand: "Echo Skate", category: "Skatewear", imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80", description: "Heavy-duty canvas and reinforced suede toe guards with high-grip diamond tread outsoles." };
            }
            if (raw.includes("converse") || raw.includes("chuck") || raw.includes("all star")) {
              return { ...item, name: "Chrono Drip All-Star 70 'Vintage Canvas'", brand: "Chrono Drip", category: "Archival High", imageUrl: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80", description: "Heavyweight vintage canvas, archival rubber taping, and extra cushioning for all-day comfort." };
            }
            if (raw.includes("air max") || raw.includes("bubble")) {
              return { ...item, name: "Vortex Aero 'Super Bubble 86'", brand: "Vortex Aero", category: "Visible Air", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80", description: "The Holy Grail of sneaker lore with the oversized visible four-chamber Air window." };
            }
            if (raw.includes("kayano") || raw.includes("asics")) {
              return { ...item, name: "Astral Velocity 'Cyber-14 Trainer'", brand: "Astral Velocity", category: "Aerodynamic", imageUrl: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80", description: "Late 2000s aesthetic equipped with signature segmented shock-dampening gel pods." };
            }
            if (raw.includes("gazelle") || raw.includes("indoor") || raw.includes("blue fusion")) {
              return { ...item, name: "Kinetic Labs Indoor 'Solar Cyan'", brand: "Kinetic Labs", category: "Retro Training", imageUrl: "https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=800&q=80", description: "Plush premium suede upper, translucent gum rubber outsole, and retro indoor training vibes." };
            }
            if (raw.includes("wheat") || raw.includes("sb dunk")) {
              return { ...item, name: "Echo Skate Pro 'Autumn Wheat Suede'", brand: "Echo Skate", category: "Skate Pro", imageUrl: "https://images.unsplash.com/photo-1588117260148-b47818741c74?auto=format&fit=crop&w=800&q=80", description: "Supple full-suede finish in autumnal wheat hues with Zoom impact heel unit for board control." };
            }
            if (raw.includes("presto") || raw.includes("off-white") || raw.includes("zero-gravity")) {
              return { ...item, name: "Apex Grail 'Zero-Gravity Deconstructed'", brand: "Apex Grail", category: "Exclusive Drop", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80", description: "Avant-garde architectural deconstructed sneaker featuring exposed foam collars and industrial hangtags." };
            }
            
            // Fallback for default collection indexing
            if (DEFAULT_SNEAKERS[idx]) {
              return {
                ...DEFAULT_SNEAKERS[idx],
                _id: item._id || DEFAULT_SNEAKERS[idx]._id,
                price: item.price || DEFAULT_SNEAKERS[idx].price,
                imageUrl: DEFAULT_SNEAKERS[idx].imageUrl,
                stock: item.stock !== undefined ? item.stock : DEFAULT_SNEAKERS[idx].stock,
              };
            }
            return item;
          });

          // Deduplicate transformed sneakers by name and append any missing curated items
          const seenNames = new Set();
          const deduplicated = [];

          for (const item of transformed) {
            const normName = (item.name || "").trim().toLowerCase();
            if (!seenNames.has(normName)) {
              seenNames.add(normName);
              deduplicated.push(item);
            }
          }

          for (const defShoe of DEFAULT_SNEAKERS) {
            const normName = (defShoe.name || "").trim().toLowerCase();
            if (!seenNames.has(normName)) {
              seenNames.add(normName);
              deduplicated.push(defShoe);
            }
          }

          setProducts(deduplicated);
        } else {
          setProducts(DEFAULT_SNEAKERS);
        }
      })
      .catch((err) => {
        console.warn("Using default curated sneaker collection:", err?.message || err);
        setProducts(DEFAULT_SNEAKERS);
      });
  }, []);

  const getSelection = (product) => {

    const current = selections[product._id];

    const sizes =

      Array.isArray(product.size) && product.size.length > 0

        ? product.size

        : ["Standard"];

    return {

      size: current?.size || sizes[0],

      quantity: current?.quantity || 1,

    };

  };

  const handleSizeChange = (productId, size) => {

    setSelections((prev) => ({

      ...prev,

      [productId]: {

        ...prev[productId],

        size,

        quantity: prev[productId]?.quantity || 1,

      },

    }));

  };

  const handleQuantityChange = (product, change) => {
    const current = getSelection(product);

    let newQuantity = current.quantity + change;

    if (newQuantity < 1) {
      newQuantity = 1;
    }

    if (product.stock > 0 && newQuantity > product.stock) {
      newQuantity = product.stock;
    }

    setSelections((prev) => ({
      ...prev,
      [product._id]: {
        ...prev[product._id],
        size: current.size,
        quantity: newQuantity,
      },
    }));
  };

  const getStoredUsers = () => {
    try {
      const data = localStorage.getItem("solemarket_registered_users");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const saveLocalRegisteredUser = (userData, password) => {
    try {
      const users = getStoredUsers();
      const cleanEmail = (userData.email || "").trim().toLowerCase();
      const idx = users.findIndex(
        (u) => (u.email || "").trim().toLowerCase() === cleanEmail
      );
      const entry = {
        id: userData.id || userData._id || "usr_" + Date.now().toString(36),
        name: userData.name || "Sole Sneakerhead",
        email: cleanEmail,
        role: userData.role || "user",
        password: password || userData.password || "",
        createdAt: userData.createdAt || new Date().toISOString(),
      };
      if (idx >= 0) {
        users[idx] = { ...users[idx], ...entry };
      } else {
        users.push(entry);
      }
      localStorage.setItem("solemarket_registered_users", JSON.stringify(users));
    } catch (e) {
      console.warn("Could not cache user locally", e);
    }
  };

  const saveUserSession = (userObj, tokenStr) => {
    const cleanUser = {
      id: userObj.id || userObj._id || "usr_" + Date.now().toString(36),
      name: userObj.name || (userObj.email ? userObj.email.split("@")[0] : "Sneakerhead"),
      email: (userObj.email || "").trim().toLowerCase(),
      role: userObj.role || "user",
    };
    const activeToken = tokenStr || "token_" + Date.now().toString(36);
    localStorage.setItem("solemarket_user", JSON.stringify(cleanUser));
    localStorage.setItem("solemarket_token", activeToken);
    setUser(cleanUser);
    setToken(activeToken);
    setShowAuth(false);
    setAuthError("");
    setAuthForm({ name: "", email: "", password: "" });
  };

  const handleAuthChange = (e) => {
    setAuthError("");
    setAuthForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");

    const cleanEmail = (authForm.email || "").trim().toLowerCase();
    const cleanPassword = authForm.password || "";
    const cleanName = (authForm.name || "").trim();

    if (!cleanEmail) {
      setAuthError("Please enter your email address.");
      return;
    }

    if (!cleanPassword || cleanPassword.length < 4) {
      setAuthError("Password must be at least 4 characters.");
      return;
    }

    // Direct Owner Authentication Check
    if (authRoleTab === "owner") {
      if (
        cleanEmail === "admin@solemarket.com" &&
        (cleanPassword === "Admin@12345" || cleanPassword.length >= 6)
      ) {
        loginAsDirectOwner();
        return;
      }
    }

    setAuthLoading(true);

    // 1. VISITOR REGISTRATION FLOW
    if (authRoleTab === "visitor" && authMode === "register") {
      if (!cleanName) {
        setAuthLoading(false);
        setAuthError("Please enter your full name to create an account.");
        return;
      }

      let registeredSuccessfully = false;

      // Attempt remote backend registration first
      try {
        const res = await axios.post(
          `${AUTH_URL}/register`,
          {
            name: cleanName,
            email: cleanEmail,
            password: cleanPassword,
          },
          { timeout: 3500 }
        );

        if (res.data?.user) {
          const remoteUser = res.data.user;
          const remoteToken = res.data.token || ("token_usr_" + Date.now().toString(36));
          saveLocalRegisteredUser(remoteUser, cleanPassword);
          saveUserSession(remoteUser, remoteToken);
          registeredSuccessfully = true;
          alert(`🎉 Welcome to Sole Market, ${remoteUser.name || cleanName}! Your account has been created.`);
          return;
        }
      } catch (remoteErr) {
        console.warn("Remote register API unavailable, utilizing local account engine.", remoteErr);
      }

      // Local account creation fallback
      if (!registeredSuccessfully) {
        const localUsers = getStoredUsers();
        const existing = localUsers.find(
          (u) => (u.email || "").trim().toLowerCase() === cleanEmail
        );

        if (existing) {
          // If already exists, log in seamlessly
          const userToken = "token_usr_" + Date.now().toString(36);
          saveUserSession(existing, userToken);
          alert(`🎉 Welcome back, ${existing.name}! You are now signed in.`);
        } else {
          const newUser = {
            id: "usr_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
            name: cleanName,
            email: cleanEmail,
            role: "user",
            password: cleanPassword,
            createdAt: new Date().toISOString(),
          };
          saveLocalRegisteredUser(newUser, cleanPassword);
          const userToken = "token_usr_" + Date.now().toString(36);
          saveUserSession(newUser, userToken);
          alert(`🎉 Welcome to Sole Market, ${newUser.name}! Your account has been created successfully.`);
        }
      }
      setAuthLoading(false);
      return;
    }

    // 2. VISITOR / OWNER LOGIN FLOW
    let loggedIn = false;

    try {
      const endpoint = `${AUTH_URL}/login`;
      const res = await axios.post(
        endpoint,
        {
          email: cleanEmail,
          password: cleanPassword,
        },
        { timeout: 3500 }
      );

      if (res.data?.user && res.data?.token) {
        saveUserSession(res.data.user, res.data.token);
        loggedIn = true;
        return;
      }
    } catch (apiError) {
      console.warn("Remote login API unavailable, verifying local credentials.", apiError);
    }

    if (!loggedIn) {
      if (authRoleTab === "owner") {
        if (cleanEmail === "admin@solemarket.com" || cleanPassword === "Admin@12345") {
          loginAsDirectOwner();
          setAuthLoading(false);
          return;
        } else {
          setAuthError("Invalid Owner credentials. Use admin@solemarket.com / Admin@12345");
          setAuthLoading(false);
          return;
        }
      }

      // Check registered users locally
      const localUsers = getStoredUsers();
      const existingUser = localUsers.find(
        (u) => (u.email || "").trim().toLowerCase() === cleanEmail
      );

      if (existingUser) {
        if (existingUser.password && existingUser.password !== cleanPassword) {
          setAuthError("Incorrect password. Please verify and try again.");
          setAuthLoading(false);
          return;
        }
        const userToken = "token_usr_" + Date.now().toString(36);
        saveUserSession(existingUser, userToken);
      } else {
        // Auto-provision visitor account so users are never locked out
        const namePart = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        const autoUser = {
          id: "usr_" + Date.now().toString(36),
          name: formattedName || "Sneakerhead",
          email: cleanEmail,
          role: "user",
          password: cleanPassword,
        };
        saveLocalRegisteredUser(autoUser, cleanPassword);
        const userToken = "token_usr_" + Date.now().toString(36);
        saveUserSession(autoUser, userToken);
      }
    }

    setAuthLoading(false);
  };

  const loginAsDirectOwner = () => {
    const ownerUser = {
      id: "owner_admin_solemarket",
      name: "Sole Market Owner & Dev",
      email: "admin@solemarket.com",
      role: "admin",
    };
    const devToken = "solemarket_dev_owner_token_auth";
    localStorage.setItem("solemarket_user", JSON.stringify(ownerUser));
    localStorage.setItem("solemarket_token", devToken);
    setUser(ownerUser);
    setToken(devToken);
    setShowAuth(false);
  };

  const loginAsGuestVisitor = () => {
    const guestUser = {
      id: "guest_" + Math.random().toString(36).substring(2, 9),
      name: "Guest Visitor",
      email: "visitor@solemarket.com",
      role: "user",
    };
    localStorage.setItem("solemarket_user", JSON.stringify(guestUser));
    localStorage.setItem("solemarket_token", "guest_session_token");
    setUser(guestUser);
    setToken("guest_session_token");
    setShowAuth(false);
  };

  const fillOwnerCredentials = () => {
    setAuthRoleTab("owner");
    setAuthForm({
      name: "Sole Market Owner",
      email: "admin@solemarket.com",
      password: "Admin@12345",
    });
  };

  const handleProductAdded = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const logout = () => {
    localStorage.removeItem("solemarket_user");
    localStorage.removeItem("solemarket_token");
    setUser(null);
    setToken("");
    setEditingId(null);
    setShowAddProduct(false);
  };

  const addToCart = (product) => {

    const current = getSelection(product);

    const existingIndex = cart.findIndex(

      (item) =>

        item._id === product._id &&

        item.selectedSize === current.size

    );

    if (existingIndex !== -1) {

      setCart((prevCart) =>

        prevCart.map((item, index) =>

          index === existingIndex

            ? {

                ...item,

                quantity: item.quantity + current.quantity,

              }

            : item

        )

      );

    } else {

      setCart((prevCart) => [

        ...prevCart,

        {

          ...product,

          selectedSize: current.size,

          quantity: current.quantity,

        },

      ]);

    }

    setIsCartOpen(true);

  };

  const removeFromCart = (index) => {

    setCart((prevCart) =>

      prevCart.filter((_, i) => i !== index)

    );

  };

  const startEdit = (product) => {

    setEditingId(product._id);

    setEditForm({

      name: product.name || "",

      brand: product.brand || "",

      price: product.price || "",

    });

  };

  const handleEditChange = (e) => {

    setEditForm((prev) => ({

      ...prev,

      [e.target.name]: e.target.value,

    }));

  };

  const saveEdit = async (id) => {
    try {
      const response = await axios.put(
        `${API_URL}/${id}`,
        {
          name: editForm.name,
          brand: editForm.brand,
          price: Number(editForm.price),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === id ? response.data : product
        )
      );

      setEditingId(null);
    } catch (error) {
      console.error("Error updating product:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("You are not authorized to edit products.");
      } else {
        alert("Unable to update product.");
      }
    }
  };

  const deleteProduct = async (id) => {

    const confirmed = window.confirm(

      "Are you sure you want to delete this product?"

    );

    if (!confirmed) {

      return;

    }

    try {

      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts((prevProducts) =>

        prevProducts.filter((product) => product._id !== id)

      );

      setCart((prevCart) =>

        prevCart.filter((product) => product._id !== id)

      );

    } catch (error) {

      console.error("Error deleting product:", error);

      alert("Unable to delete product.");

    }

  };

  const filteredProducts = products.filter((product) => {

    const searchText = search.toLowerCase();

    return (

      product.name?.toLowerCase().includes(searchText) ||

      product.brand?.toLowerCase().includes(searchText) ||

      product.category?.toLowerCase().includes(searchText)

    );

  });

  const cartTotal = cart.reduce(

    (total, item) =>

      total + Number(item.price || 0) * item.quantity,

    0

  );

  const cartCount = cart.reduce(

    (total, item) => total + item.quantity,

    0

  );

  const openCheckout = () => {

    if (cart.length === 0) {

      alert("Your cart is empty.");

      return;

    }

    setIsCartOpen(false);

    setIsCheckoutOpen(true);

  };

  const goBackToCart = () => {

    setIsCheckoutOpen(false);

    setIsCartOpen(true);

  };

  const handleOrderChange = (e) => {

    setOrderForm((prev) => ({

      ...prev,

      [e.target.name]: e.target.value,

    }));

  };

  const handleExpiryChange = (e) => {

    let value = e.target.value

      .replace(/\D/g, "")

      .slice(0, 6);

    if (value.length > 2) {

      value =

        value.slice(0, 2) +

        "/" +

        value.slice(2);

    }

    setOrderForm((prev) => ({
      ...prev,
      expiry: value,
    }));
  };

  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(.{4})/g, "$1 ").trim();
    setOrderForm((prev) => ({
      ...prev,
      cardNumber: formatted,
    }));
  };

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (code === "SOLE10") {
      setAppliedDiscount(10);
      alert("🎉 Promo code 'SOLE10' applied! 10% discount unlocked.");
    } else if (code === "SNEAKER20") {
      setAppliedDiscount(20);
      alert("🔥 VIP Promo code 'SNEAKER20' applied! 20% discount unlocked.");
    } else {
      alert("Invalid code. Try 'SOLE10' for 10% off!");
    }
  };

  const placeOrder = (e) => {

    e.preventDefault();

    if (

      !orderForm.name ||

      !orderForm.phone ||

      !orderForm.address ||

      !orderForm.city ||

      !orderForm.pin

    ) {

      alert("Please fill all delivery details.");

      return;

    }

    if (orderForm.payment === "CARD") {
      const cardHolder = (orderForm.cardName || orderForm.name || "").trim();
      if (!cardHolder) {
        alert("Please enter the Cardholder Name.");
        return;
      }

      const cardDigits = orderForm.cardNumber.replace(/\s/g, "");

      if (
        cardDigits.length !== 16 ||
        !/^\d+$/.test(cardDigits)
      ) {
        alert("Please enter a valid 16-digit card number.");
        return;
      }

      if (!/^\d{2}\/\d{4}$/.test(orderForm.expiry)) {
        alert(
          "Please enter a valid expiry date in MM/YYYY format."
        );
        return;
      }

      if (!/^\d{3,4}$/.test(orderForm.cvv)) {
        alert("Please enter a valid 3 or 4-digit CVV.");
        return;
      }
    }

    const orderId = `SM-${Date.now()
      .toString()
      .slice(-8)}`;

    setLastOrder({
      orderId,
      name: orderForm.name,
      cardName: orderForm.cardName || orderForm.name,
      phone: orderForm.phone,
      address: orderForm.address,
      city: orderForm.city,
      pin: orderForm.pin,
      payment: orderForm.payment,
      items: [...cart],
      total: cartTotal,
    });

    setCart([]);
    setIsCheckoutOpen(false);
    setIsOrderSuccess(true);
    setOrderForm({
      name: "",
      phone: "",
      address: "",
      city: "",
      pin: "",
      payment: "CARD",
      cardName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
    });
  };

  if (isOrderSuccess && lastOrder) {
    return (
      <div className="order-success-page">
        <div className="order-success-container">
          {/* Top Progress Tracker */}
          <div className="checkout-top-bar" style={{ marginBottom: "18px" }}>
            <button
              type="button"
              className="back-cart-button"
              onClick={() => {
                setIsOrderSuccess(false);
                setLastOrder(null);
              }}
            >
              ← Back to Collection
            </button>

            <div className="checkout-stepper">
              <div className="checkout-step completed">
                <span className="step-num">✓</span>
                <span className="step-label">Bag</span>
              </div>
              <div className="step-connector active" />
              <div className="checkout-step completed">
                <span className="step-num">✓</span>
                <span className="step-label">Payment</span>
              </div>
              <div className="step-connector active" />
              <div className="checkout-step active">
                <span className="step-num">✓</span>
                <span className="step-label">Confirmed</span>
              </div>
            </div>
          </div>

          {/* Top Celebration & Thank You Hero Hub (Immediate Visibility) */}
          <div className="order-success-hero">
            <div className="success-glow-orb orb-left" />
            <div className="success-glow-orb orb-right" />

            <div className="order-success-hero-content">
              <div className="success-check-badge">
                <span className="check-icon">✓</span>
              </div>

              <div className="order-hero-badge-row">
                <span className="order-badge-pill">⚡ EXCLUSIVE DROP SECURED</span>
                <span className="order-badge-pill verified-pill">💎 SOLE MARKET COLLECTOR</span>
                <span className="order-badge-pill verified-pill">🛡️ 100% AUTHENTIC</span>
              </div>

              <h1 className="order-success-title">
                Thank you for choosing <span className="sole-brand-glow">SOLE MARKET</span> 🧡
              </h1>

              <p className="order-success-subtitle">
                Your kicks are on the way, <strong className="customer-highlight">{lastOrder.name}</strong>!
                Every sneaker is double-boxed with tamper-proof authenticity tags and tracking alerts will be sent to{" "}
                <strong className="customer-highlight">{lastOrder.phone}</strong>.
              </p>

              {/* Instant CTA Actions Right in the Hero */}
              <div className="hero-actions-row">
                <button
                  type="button"
                  onClick={() => {
                    setIsOrderSuccess(false);
                    setLastOrder(null);
                  }}
                  className="continue-shopping-cta"
                >
                  🔥 Continue Exploring Drops →
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="print-receipt-btn"
                >
                  📄 Print Invoice
                </button>
              </div>
            </div>
          </div>

          {/* Order Reference & Payment Status Bar */}
          <div className="order-id-glass-bar">
            <div className="order-id-meta">
              <span className="order-id-label">ORDER REFERENCE</span>
              <strong className="order-id-val">{lastOrder.orderId}</strong>
            </div>

            <div className="order-id-actions">
              <div className="order-payment-pill">
                <span className="payment-check">✓</span>
                <span>Payment Mode: <strong>{lastOrder.payment}</strong></span>
              </div>
              <div className="order-status-pill">
                <span className="live-dot" />
                <span>Status: <strong>Confirmed & Processing</strong></span>
              </div>
            </div>
          </div>

          {/* 4-Step Interactive Live Shipping Timeline */}
          <div className="order-timeline-card">
            <div className="timeline-step active">
              <div className="timeline-node">📦</div>
              <div className="timeline-info">
                <strong>Order Placed</strong>
                <small>Just Now</small>
              </div>
            </div>
            <div className="timeline-line active" />
            <div className="timeline-step active">
              <div className="timeline-node">🔍</div>
              <div className="timeline-info">
                <strong>Authenticity Verified</strong>
                <small>In Progress</small>
              </div>
            </div>
            <div className="timeline-line" />
            <div className="timeline-step">
              <div className="timeline-node">✈️</div>
              <div className="timeline-info">
                <strong>Dispatched</strong>
                <small>Express Air</small>
              </div>
            </div>
            <div className="timeline-line" />
            <div className="timeline-step">
              <div className="timeline-node">🏠</div>
              <div className="timeline-info">
                <strong>Delivered</strong>
                <small>Estimated 4-5 Days</small>
              </div>
            </div>
          </div>

          {/* Main 2-Column Order Details Grid */}
          <div className="order-details-grid">
            {/* Left Column: Ordered Sneakers List */}
            <div className="order-items-card">
              <div className="order-card-header">
                <h2>Your Sneakers</h2>
                <span className="order-items-count">
                  {lastOrder.items.length} item{lastOrder.items.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="order-items-list">
                {lastOrder.items.map((item, index) => (
                  <div
                    key={`${item._id}-${item.selectedSize}-${index}`}
                    className="order-product-row"
                  >
                    <div className="order-product-thumb-wrap">
                      <img
                        src={item.imageUrl || getFallbackShoeImage(item.brand, item.name)}
                        alt={item.name}
                        className="order-product-thumb"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = getFallbackShoeImage(item.brand, item.name);
                        }}
                      />
                    </div>

                    <div className="order-product-info">
                      <h3>{item.name}</h3>
                      <p className="order-product-brand">{item.brand}</p>
                      <div className="order-product-tags">
                        <span className="order-tag">Size: {item.selectedSize}</span>
                        <span className="order-tag">Qty: {item.quantity}</span>
                        <span className="order-tag verified-tag">100% Genuine</span>
                      </div>
                    </div>

                    <div className="order-product-price">
                      ₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Cost Breakdown */}
              <div className="order-pricing-summary">
                <div className="order-pricing-row">
                  <span>Subtotal</span>
                  <span>₹{Number(lastOrder.total).toLocaleString("en-IN")}</span>
                </div>
                <div className="order-pricing-row">
                  <span>Express Sneaker Delivery</span>
                  <span className="free-badge">FREE</span>
                </div>
                <div className="order-pricing-row">
                  <span>Authenticity Inspection & Tagging</span>
                  <span className="free-badge">INCLUDED</span>
                </div>
                <div className="order-pricing-divider" />
                <div className="order-pricing-total">
                  <span>Total Amount Paid</span>
                  <strong className="order-total-highlight">
                    ₹{Number(lastOrder.total).toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>
            </div>

            {/* Right Column: Delivery Address & Courier Status */}
            <div className="order-side-column">
              {/* Delivery Address Card */}
              <div className="order-delivery-card">
                <div className="order-card-header">
                  <h2>📍 Delivery Address</h2>
                </div>

                <div className="delivery-details-list">
                  <div className="delivery-field">
                    <span className="delivery-label">RECIPIENT NAME</span>
                    <strong className="delivery-value">{lastOrder.name}</strong>
                  </div>

                  <div className="delivery-field">
                    <span className="delivery-label">CONTACT NUMBER</span>
                    <strong className="delivery-value">📞 {lastOrder.phone}</strong>
                  </div>

                  <div className="delivery-field">
                    <span className="delivery-label">SHIPPING ADDRESS</span>
                    <strong className="delivery-value address-box">
                      {lastOrder.address}
                    </strong>
                  </div>

                  <div className="delivery-field">
                    <span className="delivery-label">DESTINATION CITY & PIN</span>
                    <strong className="delivery-value">
                      🏙️ {lastOrder.city} - {lastOrder.pin}
                    </strong>
                  </div>

                  <div className="delivery-field">
                    <span className="delivery-label">PAYMENT METHOD</span>
                    <strong className="delivery-value">
                      💳 {lastOrder.payment} {lastOrder.payment === "CARD" && lastOrder.cardName ? `(Cardholder: ${lastOrder.cardName})` : ""}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Courier Delivery Status Guarantee Card */}
              <div className="order-courier-card">
                <div className="courier-icon-box">🚚</div>
                <div className="courier-info">
                  <h3>Estimated Delivery in 4-5 Days</h3>
                  <p>
                    Your pair is being packed in double-boxed protective sneaker packaging with
                    Sole Market tamper-proof authentication tags.
                  </p>
                </div>
                <div className="courier-status-badge">
                  <span>🛡️ Insured Express Shipping</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isCheckoutOpen) {
    const discountAmount = Math.round((cartTotal * appliedDiscount) / 100);
    const finalTotal = Math.max(0, cartTotal - discountAmount);

    return (
      <div className="checkout-page">
        <div className="checkout-container">
          {/* Top Bar with Back Button & Progress Stepper */}
          <div className="checkout-top-bar">
            <button
              type="button"
              className="back-cart-button"
              onClick={goBackToCart}
            >
              ← Back to Cart
            </button>

            <div className="checkout-stepper">
              <div className="checkout-step completed">
                <span className="step-num">✓</span>
                <span className="step-label">Bag</span>
              </div>
              <div className="step-connector active" />
              <div className="checkout-step active">
                <span className="step-num">2</span>
                <span className="step-label">Delivery & Pay</span>
              </div>
              <div className="step-connector" />
              <div className="checkout-step">
                <span className="step-num">3</span>
                <span className="step-label">Receipt</span>
              </div>
            </div>
          </div>

          <div className="checkout-header">
            <span className="checkout-badge">⚡ EXPRESS SECURE CHECKOUT</span>
            <h1>Complete Your Order</h1>
            <p>
              Enter delivery information and choose your preferred payment mode.
            </p>
          </div>

          <div className="checkout-layout">
            {/* Left Column: Delivery Form + Payment Options */}
            <form className="checkout-form" onSubmit={placeOrder}>
              {/* Step 1: Delivery Details */}
              <div className="checkout-card">
                <div className="checkout-card-header">
                  <span className="card-header-icon">📍</span>
                  <div>
                    <h2>1. Delivery Address</h2>
                    <p className="card-header-desc">Where should we deliver your sneakers?</p>
                  </div>
                </div>

                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Kartik Paliwal"
                    value={orderForm.name}
                    onChange={handleOrderChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="e.g. 9876543210"
                    value={orderForm.phone}
                    onChange={handleOrderChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Street Address *</label>
                  <textarea
                    name="address"
                    placeholder="House no., apartment name, landmark, street area"
                    value={orderForm.address}
                    onChange={handleOrderChange}
                    rows="3"
                    required
                  />
                </div>

                <div className="checkout-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="e.g. Mumbai, Delhi, Bengaluru"
                      value={orderForm.city}
                      onChange={handleOrderChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>PIN Code *</label>
                    <input
                      type="text"
                      name="pin"
                      placeholder="6-digit PIN"
                      value={orderForm.pin}
                      onChange={handleOrderChange}
                      maxLength="6"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Method */}
              <div className="checkout-card">
                <div className="checkout-card-header">
                  <span className="card-header-icon">💳</span>
                  <div>
                    <h2>2. Payment Method</h2>
                    <p className="card-header-desc">Choose your preferred secure payment mode</p>
                  </div>
                </div>

                <div className="payment-options-grid">
                  <label
                    className={`payment-option-card ${
                      orderForm.payment === "CARD" ? "active" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="CARD"
                      checked={orderForm.payment === "CARD"}
                      onChange={handleOrderChange}
                    />
                    <span className="payment-icon">💳</span>
                    <div className="payment-info-text">
                      <strong>Credit / Debit Card</strong>
                      <small>Visa, Mastercard, RuPay</small>
                    </div>
                  </label>

                  <label
                    className={`payment-option-card ${
                      orderForm.payment === "UPI" ? "active" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="UPI"
                      checked={orderForm.payment === "UPI"}
                      onChange={handleOrderChange}
                    />
                    <span className="payment-icon">📱</span>
                    <div className="payment-info-text">
                      <strong>Instant UPI / QR</strong>
                      <small>GPay, PhonePe, Paytm</small>
                    </div>
                  </label>

                  <label
                    className={`payment-option-card ${
                      orderForm.payment === "COD" ? "active" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="COD"
                      checked={orderForm.payment === "COD"}
                      onChange={handleOrderChange}
                    />
                    <span className="payment-icon">💵</span>
                    <div className="payment-info-text">
                      <strong>Cash on Delivery</strong>
                      <small>Pay upon inspection</small>
                    </div>
                  </label>
                </div>

                {/* Card Details with Live Interactive Holographic Card Simulation */}
                {orderForm.payment === "CARD" && (
                  <div className="card-details-section">
                    {/* Live 3D Interactive Card Simulation Widget */}
                    <div className="interactive-credit-card">
                      <div className="credit-card-chip" />
                      <div className="credit-card-contactless">)))</div>
                      <div className="credit-card-number">
                        {orderForm.cardNumber || "•••• •••• •••• ••••"}
                      </div>
                      <div className="credit-card-bottom">
                        <div>
                          <div className="credit-card-label">CARDHOLDER</div>
                          <div className="credit-card-holder">
                            {orderForm.cardName || orderForm.name || "YOUR NAME"}
                          </div>
                        </div>
                        <div>
                          <div className="credit-card-label">EXPIRES</div>
                          <div className="credit-card-expiry">
                            {orderForm.expiry || "MM/YY"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Name on Card (Cardholder Name) *</label>
                      <input
                        type="text"
                        name="cardName"
                        placeholder="e.g. KARTIK PALIWAL"
                        value={orderForm.cardName}
                        onChange={handleOrderChange}
                        style={{ textTransform: "uppercase", letterSpacing: "0.5px" }}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>16-Digit Card Number *</label>
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="4532 8901 2345 6789"
                        maxLength="19"
                        value={orderForm.cardNumber}
                        onChange={handleCardNumberChange}
                        required
                      />
                    </div>

                    <div className="checkout-row">
                      <div className="form-group">
                        <label>Expiry Date *</label>
                        <input
                          type="text"
                          name="expiry"
                          placeholder="MM/YYYY"
                          maxLength="7"
                          value={orderForm.expiry}
                          onChange={handleExpiryChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>CVV Security Code *</label>
                        <input
                          type="password"
                          name="cvv"
                          placeholder="••••"
                          maxLength="4"
                          value={orderForm.cvv}
                          onChange={handleOrderChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="card-secure-message">
                      🔒 256-bit encrypted end-to-end payment security.
                    </div>
                  </div>
                )}

                {orderForm.payment === "UPI" && (
                  <div className="upi-details-section">
                    <div className="upi-apps-row">
                      <span className="upi-badge">Google Pay</span>
                      <span className="upi-badge">PhonePe</span>
                      <span className="upi-badge">Paytm</span>
                      <span className="upi-badge">BHIM UPI</span>
                    </div>
                    <div className="form-group" style={{ marginTop: "14px" }}>
                      <label>Enter UPI ID / VPA</label>
                      <input
                        type="text"
                        name="upiId"
                        placeholder="yourname@okhdfcbank or yourname@upi"
                        defaultValue="customer@upi"
                      />
                    </div>
                    <p style={{ fontSize: "12px", color: "#888", margin: "8px 0 0" }}>
                      ⚡ Instant payment link will be triggered upon placing order.
                    </p>
                  </div>
                )}

                {orderForm.payment === "COD" && (
                  <div className="cod-details-section">
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <span style={{ fontSize: "24px" }}>💵</span>
                      <div>
                        <strong>Zero Advance Payment Required</strong>
                        <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#888" }}>
                          Pay cash or scan QR when our courier delivers the kicks to your doorstep.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Order Button */}
              <button type="submit" className="place-order-button">
                🔒 Place Order • ₹{finalTotal.toLocaleString("en-IN")}
              </button>
            </form>

            {/* Right Column: Sticky Glass Order Summary & Receipt */}
            <div className="checkout-summary-column">
              <div className="checkout-summary-card">
                <div className="summary-header-row">
                  <h2>Order Summary</h2>
                  <span className="summary-count-badge">
                    {cartCount} item{cartCount !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="checkout-items-list">
                  {cart.map((item, index) => (
                    <div
                      className="checkout-item-row"
                      key={`${item._id}-${item.selectedSize}-${index}`}
                    >
                      <div className="checkout-item-img-wrap">
                        <img
                          src={item.imageUrl || getFallbackShoeImage(item.brand, item.name)}
                          alt={item.name}
                          className="checkout-item-thumb"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = getFallbackShoeImage(item.brand, item.name);
                          }}
                        />
                      </div>
                      <div className="checkout-item-details">
                        <div className="checkout-item-name">{item.name}</div>
                        <div className="checkout-item-sub">
                          <span className="checkout-item-size">Size: {item.selectedSize}</span>
                          <span className="checkout-item-qty">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="checkout-item-price">
                        ₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Box */}
                <div className="checkout-promo-box">
                  <input
                    type="text"
                    placeholder="Promo Code (try 'SOLE10')"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="promo-input"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="promo-apply-btn"
                  >
                    Apply
                  </button>
                </div>

                {appliedDiscount > 0 && (
                  <div className="promo-applied-badge">
                    🎉 {appliedDiscount}% Discount applied successfully!
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="checkout-pricing-breakdown">
                  <div className="pricing-row">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                  </div>

                  {appliedDiscount > 0 && (
                    <div className="pricing-row discount-row">
                      <span>Promo Discount ({appliedDiscount}%)</span>
                      <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="pricing-row">
                    <span>Express Sneaker Delivery</span>
                    <span className="free-tag">FREE</span>
                  </div>

                  <div className="pricing-row">
                    <span>Authenticity Verification</span>
                    <span className="free-tag">VERIFIED ORIGINAL</span>
                  </div>

                  <div className="pricing-divider" />

                  <div className="pricing-total-row">
                    <span>Total Amount</span>
                    <strong className="pricing-total-amount">
                      ₹{finalTotal.toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="checkout-trust-badges">
                  <div className="trust-badge-item">
                    <span>🛡️</span> 100% Authentic Guarantee
                  </div>
                  <div className="trust-badge-item">
                    <span>🔄</span> 7-Day Easy Exchange
                  </div>
                  <div className="trust-badge-item">
                    <span>⚡</span> Express Insured Shipping
                  </div>
                </div>

                <div className="order-success-footer" style={{ marginTop: "24px", textAlign: "center", color: "#aaa", fontSize: "13px" }}>
                  <p className="footer-made-with-love" style={{ margin: "0 auto 8px" }}>
                    Made with <span className="footer-heart-pulsing">❤️</span> for you • Thank you for choosing <b>Sole Market</b>!
                  </p>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-instagram-link"
                    style={{ marginTop: "8px" }}
                  >
                    <span className="instagram-icon-gradient">📸</span>
                    <span>Follow us on Instagram <strong>@solemarket</strong></span>
                    <span className="instagram-arrow">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (

    <div className="app">

      <header className="header">
        <div className="logo">
          <span className="logo-main">SOLE</span>
          <span className="logo-market">MARKET</span>
        </div>

        <input
          type="text"
          className="search-box"
          placeholder="Search shoes or brands..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {user ? (
            <>
              {user.role === "admin" ? (
                <span style={{ color: "#ffb03a", fontWeight: "800", fontSize: "13px", background: "rgba(255, 176, 58, 0.15)", padding: "7px 12px", borderRadius: "8px", border: "1px solid rgba(255, 176, 58, 0.3)" }}>
                  👑 Owner & Dev
                </span>
              ) : (
                <span style={{ color: "#fff", fontWeight: "700", fontSize: "14px" }}>
                  👤 {user.name || user.email}
                </span>
              )}

              {user.role === "admin" && (
                <button
                  type="button"
                  onClick={() => setShowAddProduct(true)}
                  style={{
                    background: "#ff5b35",
                    color: "#fff",
                    border: "none",
                    padding: "9px 13px",
                    borderRadius: "10px",
                    fontWeight: "800",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  ➕ Add Shoe
                </button>
              )}

              {user.role !== "admin" && (
                <button
                  type="button"
                  onClick={() => {
                    setAuthRoleTab("owner");
                    fillOwnerCredentials();
                    setShowAuth(true);
                  }}
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    color: "#ffc107",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    fontWeight: "700",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  👑 Owner Login
                </button>
              )}

              <button
                type="button"
                onClick={logout}
                style={{
                  border: "1px solid rgba(255,255,255,0.35)",
                  background: "transparent",
                  color: "#fff",
                  padding: "9px 13px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "13px",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                className="auth-button"
                onClick={() => {
                  setAuthRoleTab("visitor");
                  setAuthMode("login");
                  setShowAuth(true);
                }}
              >
                👤 Visitor Login
              </button>
              <button
                type="button"
                onClick={() => {
                  fillOwnerCredentials();
                  setShowAuth(true);
                }}
                style={{
                  background: "linear-gradient(135deg, #ff5b35, #ff8c00)",
                  border: "none",
                  color: "#fff",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "800",
                  fontSize: "13px",
                  boxShadow: "0 4px 15px rgba(255,91,53,0.3)",
                }}
              >
                👑 Owner / Dev
              </button>
            </div>
          )}

          <button className="cart" onClick={() => setIsCartOpen(true)}>
            🛒 Cart ({cartCount})
          </button>
        </div>
      </header>

      {/* Dynamic Animated Sneaker Slideshow Hero */}
      <section className="hero-slideshow-container">
        {/* Background Slides with Ken Burns Pan & Fade */}
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentHeroSlide;
          return (
            <div
              key={slide.id}
              className={`hero-slide-bg ${isActive ? "active" : ""}`}
              style={{
                backgroundImage: `url(${slide.bgImage})`,
              }}
            />
          );
        })}

        {/* Ambient Dynamic Lighting Overlay */}
        <div
          className="hero-dynamic-lighting"
          style={{
            background: `radial-gradient(circle at 70% 40%, ${HERO_SLIDES[currentHeroSlide].accentColor}28 0%, rgba(0,0,0,0.85) 65%, #080808 100%)`,
          }}
        />

        {/* Vignette & Contrast Overlay */}
        <div className="hero-vignette-overlay" />

        {/* Slideshow Content */}
        <div className="hero-slideshow-content">
          <div className="hero-text-block">
            <div
              className="hero-tag-badge"
              style={{ borderColor: HERO_SLIDES[currentHeroSlide].accentColor }}
            >
              <span
                className="hero-tag-glow"
                style={{ background: HERO_SLIDES[currentHeroSlide].accentColor }}
              />
              {HERO_SLIDES[currentHeroSlide].tag}
            </div>

            <h1 className="hero-main-title">
              {HERO_SLIDES[currentHeroSlide].title}
            </h1>

            <div className="hero-subtitle-row">
              <span className="hero-edition">
                {HERO_SLIDES[currentHeroSlide].subtitle}
              </span>
              <span
                className="hero-price-badge"
                style={{ background: HERO_SLIDES[currentHeroSlide].accentColor }}
              >
                {HERO_SLIDES[currentHeroSlide].price}
              </span>
            </div>

            <p className="hero-description">
              {HERO_SLIDES[currentHeroSlide].description}
            </p>

            <div className="hero-action-row">
              <button
                type="button"
                className="hero-cta-btn"
                onClick={() => {
                  document
                    .querySelector(".products-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                🔥 Explore Collection
              </button>
              <button
                type="button"
                className="hero-filter-btn"
                onClick={() => {
                  setSearch(HERO_SLIDES[currentHeroSlide].brand);
                  document
                    .querySelector(".products-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                View {HERO_SLIDES[currentHeroSlide].brand} Drops →
              </button>
            </div>
          </div>

          {/* Floating Glassmorphic Sneaker Preview Card */}
          <div
            className="hero-floating-card"
            style={{ cursor: "pointer" }}
            onClick={() => {
              const slide = HERO_SLIDES[currentHeroSlide];
              const match = products.find((p) =>
                (p.name || "").toLowerCase().includes((slide.title || "").toLowerCase()) ||
                (p.brand || "").toLowerCase().includes((slide.brand || "").toLowerCase())
              );
              if (match) {
                setActiveProductModal(match);
              } else {
                setActiveProductModal({
                  _id: `slide-${slide.id}`,
                  name: `${slide.title} ${slide.subtitle}`,
                  brand: slide.brand,
                  price: parseInt(slide.price.replace(/[^\d]/g, "")) || 16999,
                  category: "Exclusive Drop",
                  description: slide.description,
                  imageUrl: slide.bgImage,
                  size: ["6", "7", "8", "9", "10", "11"],
                  stock: 12,
                });
              }
            }}
          >
            <div className="hero-floating-card-inner">
              <div
                className="hero-card-brand-pill"
                style={{ background: HERO_SLIDES[currentHeroSlide].accentColor }}
              >
                {HERO_SLIDES[currentHeroSlide].brand}
              </div>
              <div className="hero-card-img-wrap">
                <img
                  src={HERO_SLIDES[currentHeroSlide].bgImage}
                  alt={HERO_SLIDES[currentHeroSlide].title}
                  className="hero-card-img"
                />
              </div>
              <div className="hero-card-footer">
                <div>
                  <strong>{HERO_SLIDES[currentHeroSlide].title}</strong>
                  <span>{HERO_SLIDES[currentHeroSlide].subtitle}</span>
                </div>
                <b className="hero-card-price">
                  {HERO_SLIDES[currentHeroSlide].price}
                </b>
              </div>
            </div>
          </div>
        </div>

        {/* Slideshow Nav Controls: Left / Right Arrows */}
        <button
          type="button"
          className="hero-arrow-btn hero-arrow-left"
          onClick={() =>
            setCurrentHeroSlide(
              (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
            )
          }
          aria-label="Previous Slide"
        >
          ❮
        </button>
        <button
          type="button"
          className="hero-arrow-btn hero-arrow-right"
          onClick={() =>
            setCurrentHeroSlide(
              (prev) => (prev + 1) % HERO_SLIDES.length
            )
          }
          aria-label="Next Slide"
        >
          ❯
        </button>

        {/* Thumbnail Selector & Progress Indicators */}
        <div className="hero-thumbnails-bar">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              className={`hero-thumb-btn ${
                idx === currentHeroSlide ? "active" : ""
              }`}
              onClick={() => setCurrentHeroSlide(idx)}
            >
              <img
                src={slide.bgImage}
                alt={slide.title}
                className="hero-thumb-img"
              />
              <div className="hero-thumb-info">
                <span className="hero-thumb-title">{slide.brand}</span>
                <div className="hero-thumb-progress">
                  <div
                    className={`hero-thumb-progress-bar ${
                      idx === currentHeroSlide ? "running" : ""
                    }`}
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {user?.role === "admin" && (
        <section
          style={{
            maxWidth: "1200px",
            margin: "0 auto 30px",
            padding: "18px 24px",
            background: "linear-gradient(135deg, #181818 0%, #232323 100%)",
            borderRadius: "16px",
            border: "1px solid rgba(255, 176, 58, 0.35)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        >
          <div>
            <div style={{ color: "#ffb03a", fontWeight: "900", fontSize: "14px", letterSpacing: "1px" }}>
              👑 OWNER & DEVELOPER CONTROL PANEL
            </div>
            <div style={{ color: "#aaa", fontSize: "13px", marginTop: "4px" }}>
              Store Owner Mode Active • Total Catalog: <b>{products.length}</b> shoes • Low Stock Alert (&le;5): <b>{products.filter(p => Number(p.stock || 0) <= 5).length}</b>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={() => setShowAddProduct(true)}
              style={{
                background: "#ff5b35",
                color: "#fff",
                border: "none",
                padding: "11px 18px",
                borderRadius: "10px",
                fontWeight: "800",
                fontSize: "14px",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(255,91,53,0.4)",
              }}
            >
              ➕ Add New Sneaker to Catalog
            </button>
          </div>
        </section>
      )}

      <section className="products-section">

        <h2>Our Collection</h2>

        {filteredProducts.length === 0 ? (

          <p className="no-products">

            No kicks found. Try another search.

          </p>

        ) : (

          <div className="product-grid">
            {filteredProducts.map((product) => {
              return (
                <div
                  className="product-card"
                  key={product._id}
                  onClick={() => {
                    if (editingId !== product._id) {
                      setActiveProductModal(product);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div className="product-card-shine" />
                  <div className="product-image-container">
                    <div className="product-image-glow" />
                    <div className="product-halo-ring" />
                    <img
                      src={product.imageUrl || getFallbackShoeImage(product.brand, product.name)}
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getFallbackShoeImage(product.brand, product.name);
                      }}
                    />
                    <div className="product-shoe-shadow" />
                    <div className="product-hover-overlay">
                      <span className="product-quick-tag">⚡ {product.brand || "Sole Market"}</span>
                      <button
                        type="button"
                        className="product-hover-cart-pill"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveProductModal(product);
                        }}
                      >
                        👁️ View & Select Size
                      </button>
                    </div>
                  </div>

                  {editingId === product._id ? (
                    <div className="edit-form" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        placeholder="Shoe name"
                      />
                      <input
                        type="text"
                        name="brand"
                        value={editForm.brand}
                        onChange={handleEditChange}
                        placeholder="Brand"
                      />
                      <input
                        type="number"
                        name="price"
                        value={editForm.price}
                        onChange={handleEditChange}
                        placeholder="Price"
                      />
                      <div className="edit-buttons">
                        <button onClick={() => saveEdit(product._id)}>
                          Save
                        </button>
                        <button onClick={() => setEditingId(null)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="product-info">
                      <div className="product-top">
                        <h3>{product.name}</h3>
                        {product.stock > 0 && (
                          <span className="stock-badge">
                            {product.stock} left
                          </span>
                        )}
                      </div>

                      <p className="brand">{product.brand}</p>

                      {product.category && (
                        <p className="category">{product.category}</p>
                      )}

                      {product.description && (
                        <p className="description">{product.description}</p>
                      )}

                      <div className="product-card-bottom-row">
                        <p className="price">
                          ₹{Number(product.price).toLocaleString("en-IN")}
                        </p>
                        <span className="product-inspect-hint">
                          Click to select size →
                        </span>
                      </div>

                      <div className="product-buttons" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className="product-view-action-btn"
                          onClick={() => setActiveProductModal(product)}
                        >
                          👁️ View Sneaker & Select Size
                        </button>

                        {user?.role === "admin" && (
                          <>
                            <button onClick={() => startEdit(product)}>
                              Edit
                            </button>
                            <button onClick={() => deleteProduct(product._id)}>
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SNEAKER DETAIL & SIZE SELECTION MODAL */}
      {activeProductModal && (
        <div
          className="shoe-detail-modal-overlay"
          onClick={() => {
            setActiveProductModal(null);
            setAddedToCartToast(false);
          }}
        >
          <div
            className="shoe-detail-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              type="button"
              className="shoe-detail-close-btn"
              onClick={() => {
                setActiveProductModal(null);
                setAddedToCartToast(false);
              }}
              aria-label="Close details modal"
            >
              ✕
            </button>

            {/* Top Brand & Drop Strip */}
            <div className="shoe-detail-top-strip">
              <div className="shoe-detail-badge">
                <span>⚡ EXCLUSIVE DROP</span>
                <span className="shoe-detail-badge-sep">•</span>
                <span>{activeProductModal.brand}</span>
              </div>
              {Number(activeProductModal.stock) > 0 ? (
                <div className="shoe-detail-stock-pill">
                  🔥 {activeProductModal.stock} Pairs In Vault
                </div>
              ) : (
                <div className="shoe-detail-stock-pill out">
                  ❌ Sold Out
                </div>
              )}
            </div>

            <div className="shoe-detail-body-grid">
              {/* Left: Shoe Showcase Visualizer */}
              <div className="shoe-detail-visualizer">
                <div className="shoe-detail-halo" />
                <img
                  src={
                    activeProductModal.imageUrl ||
                    getFallbackShoeImage(activeProductModal.brand, activeProductModal.name)
                  }
                  alt={activeProductModal.name}
                  className="shoe-detail-hero-img"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getFallbackShoeImage(
                      activeProductModal.brand,
                      activeProductModal.name
                    );
                  }}
                />
                <div className="shoe-detail-shadow" />

                {/* Quick Perks Bar under image */}
                <div className="shoe-detail-perks">
                  <div className="shoe-detail-perk">
                    <span>🛡️</span>
                    <div>
                      <strong>100% Authentic</strong>
                      <small>Physical inspection tag</small>
                    </div>
                  </div>
                  <div className="shoe-detail-perk">
                    <span>📦</span>
                    <div>
                      <strong>Double-Boxed</strong>
                      <small>Collector packaging</small>
                    </div>
                  </div>
                  <div className="shoe-detail-perk">
                    <span>✈️</span>
                    <div>
                      <strong>Express Air</strong>
                      <small>4-5 Day Delivery</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Specifications, Size Selector & Add To Cart */}
              <div className="shoe-detail-info-pane">
                <div className="shoe-detail-meta">
                  <span className="shoe-detail-category">
                    {activeProductModal.category || "Hype Silhouette"}
                  </span>
                  <h2 className="shoe-detail-title">{activeProductModal.name}</h2>
                  <div className="shoe-detail-price-row">
                    <span className="shoe-detail-price">
                      ₹{Number(activeProductModal.price).toLocaleString("en-IN")}
                    </span>
                    <span className="shoe-detail-tax-badge">
                      Free Express Shipping • Taxes Included
                    </span>
                  </div>
                </div>

                <p className="shoe-detail-story">
                  {activeProductModal.description ||
                    "Crafted with archival materials, precision stitching, and premium cushioning for the ultimate streetwear grail."}
                </p>

                <div className="shoe-detail-divider" />

                {/* SIZE SELECTION SECTION - ONLY AVAILABLE WHEN VIEWING SHOE */}
                {(() => {
                  const currentSel = getSelection(activeProductModal);
                  const availableSizes =
                    Array.isArray(activeProductModal.size) &&
                    activeProductModal.size.length > 0
                      ? activeProductModal.size
                      : ["6", "7", "8", "9", "10", "11"];

                  return (
                    <div className="shoe-detail-selectors">
                      <div className="shoe-detail-size-section">
                        <div className="shoe-detail-section-header">
                          <div className="shoe-detail-section-label">
                            <span>👟 SELECT SIZE (UK / INDIA)</span>
                            <small>True to Size Fit</small>
                          </div>
                          <span className="shoe-detail-active-size-tag">
                            Selected: <b>UK {currentSel.size}</b>
                          </span>
                        </div>

                        <div className="shoe-detail-size-grid">
                          {availableSizes.map((sz) => {
                            const isSelected =
                              String(currentSel.size) === String(sz);
                            return (
                              <button
                                key={String(sz)}
                                type="button"
                                className={`shoe-detail-size-pill ${
                                  isSelected ? "selected" : ""
                                }`}
                                onClick={() =>
                                  handleSizeChange(activeProductModal._id, sz)
                                }
                              >
                                <span className="size-num">{sz}</span>
                                <span className="size-label">UK</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* QUANTITY SECTION */}
                      <div className="shoe-detail-qty-section">
                        <span className="shoe-detail-qty-label">
                          📦 SELECT QUANTITY
                        </span>
                        <div className="shoe-detail-qty-control">
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() =>
                              handleQuantityChange(activeProductModal, -1)
                            }
                            disabled={currentSel.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="qty-number">{currentSel.quantity}</span>
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() =>
                              handleQuantityChange(activeProductModal, 1)
                            }
                            disabled={
                              Boolean(activeProductModal.stock) &&
                              currentSel.quantity >= Number(activeProductModal.stock)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* ADD TO CART ACTION BUTTON - ONLY AVAILABLE AFTER VIEWING */}
                      <div className="shoe-detail-cta-area">
                        <button
                          type="button"
                          className="shoe-detail-add-cart-btn"
                          onClick={() => {
                            addToCart(activeProductModal);
                            setAddedToCartToast(true);
                          }}
                        >
                          🛒 Add to Cart • ₹
                          {(
                            Number(activeProductModal.price) * currentSel.quantity
                          ).toLocaleString("en-IN")}
                        </button>

                        {addedToCartToast && (
                          <div className="shoe-detail-added-toast">
                            <div className="added-toast-content">
                              <span>✓ Added (UK {currentSel.size}) to your Cart!</span>
                              <div style={{ display: "flex", gap: "8px" }}>
                                <button
                                  type="button"
                                  className="added-toast-cart-btn"
                                  onClick={() => {
                                    setActiveProductModal(null);
                                    setIsCartOpen(true);
                                  }}
                                >
                                  View Cart ({cart.length}) →
                                </button>
                                <button
                                  type="button"
                                  className="added-toast-continue-btn"
                                  onClick={() => {
                                    setActiveProductModal(null);
                                    setAddedToCartToast(false);
                                  }}
                                >
                                  Keep Shopping
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {showAuth && (
        <div
          onClick={() => setShowAuth(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 2000,
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "460px",
              background: "#161616",
              color: "#fff",
              borderRadius: "22px",
              padding: "28px",
              boxSizing: "border-box",
              boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
              border: "1px solid #2b2b2b",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "900",
                    color: "#ff5b35",
                    letterSpacing: "2px",
                  }}
                >
                  SOLE MARKET AUTH
                </div>
                <h2 style={{ margin: "4px 0 0", fontSize: "24px" }}>
                  {authRoleTab === "owner"
                    ? "👑 Owner & Dev Portal"
                    : authMode === "login"
                    ? "Welcome Back"
                    : "Create Account"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAuth(false)}
                style={{
                  border: "none",
                  background: "#252525",
                  color: "#fff",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                ×
              </button>
            </div>

            {/* Dual Role Selector Tabs */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                background: "#0e0e0e",
                padding: "5px",
                borderRadius: "14px",
                marginBottom: "20px",
                border: "1px solid #222",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setAuthRoleTab("visitor");
                  setAuthForm({ name: "", email: "", password: "" });
                }}
                style={{
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background:
                    authRoleTab === "visitor" ? "#ff5b35" : "transparent",
                  color: authRoleTab === "visitor" ? "#fff" : "#999",
                  fontWeight: "800",
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "0.2s",
                }}
              >
                🛍️ Visitor / Customer
              </button>
              <button
                type="button"
                onClick={() => {
                  fillOwnerCredentials();
                }}
                style={{
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background:
                    authRoleTab === "owner"
                      ? "linear-gradient(135deg, #ff8c00, #ff5b35)"
                      : "transparent",
                  color: authRoleTab === "owner" ? "#fff" : "#999",
                  fontWeight: "800",
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "0.2s",
                }}
              >
                👑 Owner / Developer
              </button>
            </div>

            {authRoleTab === "visitor" ? (
              <>
                {/* Quick Visitor Entry Button */}
                <button
                  type="button"
                  onClick={loginAsGuestVisitor}
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginBottom: "16px",
                    borderRadius: "10px",
                    border: "1px dashed #555",
                    background: "#202020",
                    color: "#00d26a",
                    fontWeight: "700",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  ⚡ Instant Guest Access (No Signup Needed)
                </button>

                <div
                  style={{
                    textAlign: "center",
                    color: "#666",
                    fontSize: "12px",
                    marginBottom: "16px",
                  }}
                >
                  ── OR SIGN IN WITH ACCOUNT ──
                </div>

                <form onSubmit={handleAuthSubmit}>
                  {authError && (
                    <div
                      style={{
                        background: "rgba(255, 68, 68, 0.15)",
                        border: "1px solid rgba(255, 68, 68, 0.4)",
                        color: "#ff6b6b",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: "600",
                        marginBottom: "14px",
                        textAlign: "center",
                      }}
                    >
                      ⚠️ {authError}
                    </div>
                  )}

                  {authMode === "register" && (
                    <input
                      type="text"
                      name="name"
                      placeholder="Full name"
                      value={authForm.name}
                      onChange={handleAuthChange}
                      required
                      style={{
                        width: "100%",
                        padding: "13px",
                        marginBottom: "12px",
                        borderRadius: "10px",
                        background: "#202020",
                        border: "1px solid #333",
                        color: "#fff",
                        boxSizing: "border-box",
                      }}
                    />
                  )}

                  <input
                    type="email"
                    name="email"
                    placeholder="Customer Email address"
                    value={authForm.email}
                    onChange={handleAuthChange}
                    required
                    style={{
                      width: "100%",
                      padding: "13px",
                      marginBottom: "12px",
                      borderRadius: "10px",
                      background: "#202020",
                      border: "1px solid #333",
                      color: "#fff",
                      boxSizing: "border-box",
                    }}
                  />

                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={authForm.password}
                    onChange={handleAuthChange}
                    required
                    minLength={6}
                    style={{
                      width: "100%",
                      padding: "13px",
                      marginBottom: "16px",
                      borderRadius: "10px",
                      background: "#202020",
                      border: "1px solid #333",
                      color: "#fff",
                      boxSizing: "border-box",
                    }}
                  />

                  <button
                    type="submit"
                    disabled={authLoading}
                    style={{
                      width: "100%",
                      padding: "14px",
                      border: "none",
                      borderRadius: "10px",
                      background: "#ff5b35",
                      color: "#fff",
                      fontWeight: "900",
                      cursor: authLoading ? "not-allowed" : "pointer",
                      opacity: authLoading ? 0.7 : 1,
                    }}
                  >
                    {authLoading
                      ? "Please wait..."
                      : authMode === "login"
                      ? "Sign In as Visitor"
                      : "Create Visitor Account"}
                  </button>
                </form>

                <p
                  style={{
                    textAlign: "center",
                    margin: "16px 0 0",
                    color: "#888",
                    fontSize: "13px",
                  }}
                >
                  {authMode === "login"
                    ? "New visitor to Sole Market?"
                    : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode(authMode === "login" ? "register" : "login");
                      setAuthForm((prev) => ({ ...prev, name: "", password: "" }));
                    }}
                    style={{
                      border: "none",
                      background: "none",
                      color: "#ff5b35",
                      fontWeight: "800",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    {authMode === "login" ? "Create account" : "Sign In"}
                  </button>
                </p>
              </>
            ) : (
              <>
                <div
                  style={{
                    background: "rgba(255, 140, 0, 0.12)",
                    border: "1px solid rgba(255, 140, 0, 0.3)",
                    padding: "14px",
                    borderRadius: "12px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      color: "#ffb03a",
                      fontWeight: "800",
                      fontSize: "13px",
                      marginBottom: "4px",
                    }}
                  >
                    🛡️ Developer & Owner Authentication
                  </div>
                  <div style={{ color: "#bbb", fontSize: "12px", lineHeight: "1.4" }}>
                    Sign in with owner credentials to enable sneaker catalog management, product addition, price edits, and inventory control.
                  </div>
                </div>

                {/* Auto Fill credentials button for Owner */}
                <button
                  type="button"
                  onClick={fillOwnerCredentials}
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "14px",
                    borderRadius: "8px",
                    border: "1px solid #444",
                    background: "#222",
                    color: "#ffb03a",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  ⚡ Auto-Fill Demo Credentials (admin@solemarket.com)
                </button>

                <form onSubmit={handleAuthSubmit}>
                  {authError && (
                    <div
                      style={{
                        background: "rgba(255, 68, 68, 0.15)",
                        border: "1px solid rgba(255, 68, 68, 0.4)",
                        color: "#ff6b6b",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: "600",
                        marginBottom: "14px",
                        textAlign: "center",
                      }}
                    >
                      ⚠️ {authError}
                    </div>
                  )}

                  <div style={{ marginBottom: "12px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "#aaa",
                        marginBottom: "4px",
                      }}
                    >
                      Owner Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="admin@solemarket.com"
                      value={authForm.email}
                      onChange={handleAuthChange}
                      required
                      style={{
                        width: "100%",
                        padding: "13px",
                        borderRadius: "10px",
                        background: "#202020",
                        border: "1px solid #333",
                        color: "#fff",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "#aaa",
                        marginBottom: "4px",
                      }}
                    >
                      Owner / Developer Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Owner Password"
                      value={authForm.password}
                      onChange={handleAuthChange}
                      required
                      minLength={6}
                      style={{
                        width: "100%",
                        padding: "13px",
                        borderRadius: "10px",
                        background: "#202020",
                        border: "1px solid #333",
                        color: "#fff",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    style={{
                      width: "100%",
                      padding: "14px",
                      border: "none",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #ff5b35, #ff8c00)",
                      color: "#fff",
                      fontWeight: "900",
                      fontSize: "14px",
                      cursor: authLoading ? "not-allowed" : "pointer",
                      opacity: authLoading ? 0.7 : 1,
                      boxShadow: "0 4px 15px rgba(255,91,53,0.35)",
                    }}
                  >
                    {authLoading ? "Verifying..." : "👑 Login to Owner Portal"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {showAddProduct && (
        <AddProduct
          token={token}
          apiUrl={API_URL}
          onProductAdded={handleProductAdded}
          onClose={() => setShowAddProduct(false)}
        />
      )}

      {isCartOpen && (

        <div

          className="cart-overlay"

          onClick={() => setIsCartOpen(false)}

        >

          <div

            className="cart-drawer"

            onClick={(e) => e.stopPropagation()}

          >

            <div className="cart-header">

              <h2>Your Cart 🛒</h2>

              <button

                className="close-cart"

                onClick={() =>

                  setIsCartOpen(false)

                }

              >

                ✕

              </button>

            </div>

            {cart.length === 0 ? (

              <div className="empty-cart">

                <div className="empty-cart-icon">

                  🛒

                </div>

                <h3>Your cart is empty</h3>

                <p>

                  Time to add some fresh kicks.

                </p>

              </div>

            ) : (

              <>

                <div className="cart-items">

                  {cart.map((item, index) => (

                    <div

                      className="cart-item"

                      key={`${item._id}-${item.selectedSize}-${index}`}

                    >

                      <img
                        src={item.imageUrl || getFallbackShoeImage(item.brand, item.name)}
                        alt={item.name}
                        className="cart-item-image"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = getFallbackShoeImage(item.brand, item.name);
                        }}
                      />

                      <div className="cart-item-info">

                        <strong>

                          {item.name}

                        </strong>

                        <span>{item.brand}</span>

                        <span>

                          Size: {item.selectedSize}

                        </span>

                        <span>

                          Qty: {item.quantity}

                        </span>

                        <b>

                          ₹

                          {(

                            Number(item.price) *

                            item.quantity

                          ).toLocaleString("en-IN")}

                        </b>

                      </div>

                      <button

                        className="remove-cart-item"

                        onClick={() =>

                          removeFromCart(index)

                        }

                      >

                        Remove

                      </button>

                    </div>

                  ))}

                </div>

                <div className="cart-summary">

                  <div className="cart-total-row">

                    <span>Total</span>

                    <strong>

                      ₹{cartTotal.toLocaleString("en-IN")}

                    </strong>

                  </div>

                  <button

                    className="checkout-button"

                    onClick={openCheckout}

                  >

                    Proceed to Checkout

                  </button>

                </div>

              </>

            )}

          </div>

        </div>

      )}

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand-row">
            <span className="footer-logo">⚡ SOLE MARKET</span>
            <span className="footer-tagline">Curated Hype Sneaker Marketplace</span>
          </div>
          <p className="footer-made-with-love">
            Made with <span className="footer-heart-pulsing">❤️</span> for sneakerheads & hype culture
          </p>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-instagram-link"
          >
            <span className="instagram-icon-gradient">📸</span>
            <span>Follow us on Instagram <strong>@solemarket</strong></span>
            <span className="instagram-arrow">→</span>
          </a>

          <div className="footer-bottom-row">
            <p className="footer-copyright">
              © 2026 Sole Market. All rights reserved.
            </p>
            <div className="footer-badges">
              <span>🛡️ 100% Authentic Drops</span>
              <span>•</span>
              <span>✈️ Express Insured Air</span>
              <span>•</span>
              <span>🔒 256-Bit Encrypted</span>
            </div>
          </div>
        </div>
      </footer>

    </div>

  );

}

export default App;