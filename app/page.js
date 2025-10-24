// 'use client' must be first
'use client';

import React, { useEffect, useMemo, useState } from "react";

/**
 * Next.js App Router page – Persona vs Feature mock storefront
 * Uses NEXT_PUBLIC_FRAME_ARM to force arm ('persona' | 'feature').
 * If the env var is missing, defaults to 'persona' but provides a Toggle for piloting.
 */

const CATALOG = [
  {
    id: "pegasus",
    brand: "Zoom",
    name: "Air Pegasus",
    price: 119.99,
    rating: 4.6,
    reviews: 842,
    img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1200&auto=format&fit=crop",
    personaText: "For light lifters and easy stretchers who want comfort without the bulk.",
    featureText: "Breathable mesh, cushioned Zoom pods, lightweight upper; everyday trainer.",
    bullets: ["Breathable mesh", "Zoom Air cushioning", "Lightweight upper"],
    tags: ["Footwear", "Running", "Lifestyle"],
  },
  {
    id: "ultraboost23",
    brand: "Ultraboost",
    name: "23 Knit",
    price: 139.0,
    rating: 4.7,
    reviews: 1292,
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
    personaText: "For casual movers who like staying active—minus the grind.",
    featureText: "Boost midsole for energy return; knit upper adapts to foot shape.",
    bullets: ["Boost midsole", "Adaptive knit", "Everyday comfort"],
    tags: ["Footwear", "Running", "Walking"],
  },
  {
    id: "1080v13",
    brand: "Fresh Foam X",
    name: "1080v13",
    price: 149.5,
    rating: 4.5,
    reviews: 564,
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    personaText: "For de-stress miles after long days.",
    featureText: "Fresh Foam X cushioning; rocker geometry for smooth transitions.",
    bullets: ["Fresh Foam X", "Rocker geometry", "Soft landings"],
    tags: ["Footwear", "Running"],
  },
  {
    id: "studio-hoodie",
    brand: "Luma",
    name: "Studio Hoodie",
    price: 69.0,
    rating: 4.4,
    reviews: 310,
    img: "https://images.unsplash.com/photo-1520975851084-9bb318bf0f37?q=80&w=1200&auto=format&fit=crop",
    personaText: "For cool-down coffee runs and cozy commutes.",
    featureText: "Midweight fleece, brushed interior; zipper pockets for essentials.",
    bullets: ["Brushed fleece", "Zipper pockets", "Relaxed fit"],
    tags: ["Apparel", "Hoodies"],
  },
  {
    id: "studio-jogger",
    brand: "Luma",
    name: "Studio Jogger",
    price: 59.0,
    rating: 4.3,
    reviews: 201,
    img: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1200&auto=format&fit=crop",
    personaText: "For lazy-morning walks that still get your steps in.",
    featureText: "4-way stretch jersey; drawcord waistband; ankle cuff.",
    bullets: ["4-way stretch", "Drawcord", "Ankle cuff"],
    tags: ["Apparel", "Joggers"],
  },
  {
    id: "balance-mat",
    brand: "Yun",
    name: "Balance Mat Pro",
    price: 39.0,
    rating: 4.8,
    reviews: 982,
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop",
    personaText: "For reset sessions when you need a mental breather.",
    featureText: "Non-slip TPE, 6mm cushioning; odor-resistant coating.",
    bullets: ["Non-slip TPE", "6mm cushion", "Odor-resistant"],
    tags: ["Yoga", "Accessories"],
  },
  {
    id: "steel-bottle",
    brand: "Nord",
    name: "Therma Bottle 600ml",
    price: 24.0,
    rating: 4.7,
    reviews: 1420,
    img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1200&auto=format&fit=crop",
    personaText: "For desk-to-gym days when hydration slips your mind.",
    featureText: "Double-wall stainless steel; keeps drinks cold 24h, hot 12h.",
    bullets: ["Double-wall steel", "Cold 24h / Hot 12h", "Leak-proof"],
    tags: ["Bottles", "Accessories"],
  },
  {
    id: "sleep-mask",
    brand: "Seren",
    name: "Weighted Sleep Mask",
    price: 29.0,
    rating: 4.2,
    reviews: 184,
    img: "https://images.unsplash.com/photo-1628725885812-00d2182baf4a?q=80&w=1200&auto=format&fit=crop",
    personaText: "For evening unwinders who need lights-out focus.",
    featureText: "Microbead weighted design; blackout fabric; adjustable strap.",
    bullets: ["Weighted", "Blackout", "Adjustable"],
    tags: ["Sleep", "Accessories"],
  },
  {
    id: "foam-roller",
    brand: "Recover",
    name: "Foam Roller 45cm",
    price: 22.0,
    rating: 4.5,
    reviews: 642,
    img: "https://images.unsplash.com/photo-1599059835186-c6f4c82f1c8c?q=80&w=1200&auto=format&fit=crop",
    personaText: "For desk-bound backs that need quick resets.",
    featureText: "EVA high-density foam; ribbed texture for deep tissue relief.",
    bullets: ["High-density EVA", "Ribbed texture", "45cm length"],
    tags: ["Recovery", "Accessories"],
  },
  {
    id: "duffel",
    brand: "Port",
    name: "Transit Duffel 35L",
    price: 74.0,
    rating: 4.6,
    reviews: 403,
    img: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=1200&auto=format&fit=crop",
    personaText: "For weekenders who pack light and move fast.",
    featureText: "35L capacity; waterproof base; trolley sleeve.",
    bullets: ["35L", "Waterproof base", "Trolley sleeve"],
    tags: ["Bags", "Travel"],
  },
  {
    id: "earbuds",
    brand: "Aural",
    name: "Flow Buds",
    price: 89.0,
    rating: 4.1,
    reviews: 1210,
    img: "https://images.unsplash.com/photo-1585386959984-a41552231655?q=80&w=1200&auto=format&fit=crop",
    personaText: "For focus-mode sprints and deep-work playlists.",
    featureText: "Active noise reduction; 28h with case; low-lag gaming mode.",
    bullets: ["Noise reduction", "28h battery", "Low-lag mode"],
    tags: ["Audio", "Electronics"],
  },
  {
    id: "smartwatch",
    brand: "Pulse",
    name: "Watch S3",
    price: 199.0,
    rating: 4.4,
    reviews: 955,
    img: "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1200&auto=format&fit=crop",
    personaText: "For balance-seekers who track steps, sleep, and sanity.",
    featureText: "SpO2, HRV, sleep staging; 7-day battery; water-resistant.",
    bullets: ["SpO2/HRV", "Sleep staging", "7-day battery"],
    tags: ["Wearables", "Electronics"],
  },
];

const FORCED_ARM = process.env.NEXT_PUBLIC_FRAME_ARM === 'feature' ? 'feature' : 'persona';
const DEFAULT_EXPLAINER = process.env.NEXT_PUBLIC_EXPLAINER === 'item' ? 'item' : 'user';

const persistKey = "mockstore_assignment_v1";

function logEvent(name, payload = {}) {
  // Placeholder – POST to /api/events (wired by server route)
  try {
    fetch('/api/events', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name, session_id: getOrCreateSessionId(), arm: FORCED_ARM, explainer: DEFAULT_EXPLAINER, ts: Date.now(), payload }),
      keepalive: true,
    });
  } catch (e) {
    console.log("EVENT (fallback):", name, payload);
  }
}

function getOrCreateSessionId() {
  const k = 'sess_id_v1';
  let id = localStorage.getItem(k);
  if (!id) { id = crypto.randomUUID(); localStorage.setItem(k, id); }
  return id;
}

function StarRating({ value }) {
  const whole = Math.floor(value);
  const half = value - whole >= 0.5;
  const empties = 5 - whole - (half ? 1 : 0);
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating ${value}`}>
      {Array.from({ length: whole }).map((_, i) => (<span key={'w'+i}>★</span>))}
      {half && <span>☆</span>}
      {Array.from({ length: empties }).map((_, i) => (<span key={'e'+i}>☆</span>))}
      <span className="ml-1 text-sm text-zinc-500">{value.toFixed(1)}</span>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="px-2 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs border border-zinc-200">
      {children}
    </span>
  );
}

function Button({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-xl border border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 transition ${className}`}
    >
      {children}
    </button>
  );
}

function Header({ arm, explainer, onToggleDrawer, onToggleArm }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
        <div className="text-xl font-semibold">Lifestyle Outlet</div>
        <nav className="hidden md:flex items-center gap-3 text-sm text-zinc-600">
          <a href="#" className="hover:underline">Deals</a>
          <a href="#" className="hover:underline">Footwear</a>
          <a href="#" className="hover:underline">Apparel</a>
          <a href="#" className="hover:underline">Accessories</a>
          <a href="#" className="hover:underline">Electronics</a>
        </nav>
        <div className="ml-auto flex items-center gap-2 text-xs text-zinc-600">
          <Badge>Arm: {arm}</Badge>
          <Badge>Rec explainer: {explainer}</Badge>
          <Button onClick={onToggleDrawer}>Cart</Button>
          {/* Toggle helpful for piloting; ignore in deployed split */}
          <Button onClick={onToggleArm}>Toggle Arm</Button>
        </div>
      </div>
    </header>
  );
}

function Hero({ arm }) {
  return (
    <section className="bg-gradient-to-br from-zinc-50 to-zinc-100 border-b">
      <div className="mx-auto max-w-7xl px-4 py-8 grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold mb-2">Fresh picks for everyday living</h1>
          {arm === "persona" ? (
            <p className="text-zinc-700">
              Find gear that fits <span className="font-medium">who you are</span>—from lazy-morning walkers to deep-work sprinters.
            </p>
          ) : (
            <p className="text-zinc-700">
              Shop by <span className="font-medium">features</span> that matter—cushioning, battery life, water resistance, and more.
            </p>
          )}
        </div>
        <div className="rounded-2xl overflow-hidden shadow-sm border">
          <img
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop"
            alt="Lifestyle collage"
            className="w-full h-56 object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function Filters() {
  return (
    <aside className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Departments</h3>
        <ul className="space-y-2 text-sm">
          {["Footwear","Apparel","Accessories","Electronics","Sleep & Recovery"].map((d) => (
            <li key={d} className="flex items-center gap-2">
              <input type="checkbox" className="accent-black" id={`dep-${d}`} />
              <label htmlFor={`dep-${d}`}>{d}</label>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-medium mb-2">Price</h3>
        <ul className="space-y-2 text-sm">
          {["Under $25", "$25–$50", "$50–$100", "$100+"].map((p) => (
            <li key={p} className="flex items-center gap-2">
              <input type="checkbox" className="accent-black" id={`price-${p}`} />
              <label htmlFor={`price-${p}`}>{p}</label>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-medium mb-2">Avg. Customer Review</h3>
        <ul className="space-y-2 text-sm">
          {[5, 4, 3].map((r) => (
            <li key={r} className="flex items-center gap-2">
              <input type="radio" name="rating" className="accent-black" id={`r-${r}`} />
              <label htmlFor={`r-${r}`}>{r}★ & up</label>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function ProductCard({ p, arm, explainer, onAdd }) {
  const lead = arm === "persona" ? p.personaText : p.featureText;
  return (
    <div className="border rounded-2xl overflow-hidden hover:shadow-sm transition bg-white flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="text-xs text-zinc-500">{p.brand}</div>
        <div className="font-medium leading-tight">{p.name}</div>
        <StarRating value={p.rating} />
        <p className="text-sm text-zinc-700 line-clamp-2">{lead}</p>
        <div className="flex items-center gap-2 mt-1">
          {p.tags.slice(0, 2).map((t) => (<Badge key={t}>{t}</Badge>))}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-lg font-semibold">${p.price.toFixed(2)}</div>
          <Button onClick={() => onAdd(p)}>Add to cart</Button>
        </div>
      </div>
      <div className="border-t p-3 text-xs text-zinc-600">
        {explainer === "user" ? (
          <div>People who viewed <span className="font-medium">{p.name}</span> also bought:</div>
        ) : (
          <div>Similar to <span className="font-medium">{p.name}</span>:</div>
        )}
        <div className="mt-2 flex gap-2 overflow-x-auto">
          {CATALOG.filter((x) => x.id !== p.id).slice(0, 5).map((rec) => (
            <button
              key={rec.id}
              className="min-w-[120px] border rounded-xl p-2 hover:bg-zinc-50 text-left"
              onClick={() => {
                logEvent("rec_click", { anchor: p.id, rec: rec.id, arm, explainer });
              }}
            >
              <div className="text-[11px] font-medium line-clamp-1">{rec.name}</div>
              <div className="text-[11px] text-zinc-500 line-clamp-2">
                {arm === "persona" ? rec.personaText : rec.featureText}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Grid({ products, arm, explainer, onAdd }) {
  useEffect(() => {
    logEvent("grid_impression", { count: products.length, arm, explainer });
  }, [products, arm, explainer]);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} p={p} arm={arm} explainer={explainer} onAdd={onAdd} />
      ))}
    </div>
  );
}

function CartDrawer({ open, items, onClose }) {
  const subtotal = items.reduce((s, it) => s + it.price, 0);
  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-black/40 transition ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white border-l shadow-xl transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-4 flex items-center justify-between border-b">
          <div className="font-medium">Your Cart</div>
          <Button onClick={onClose}>Close</Button>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto h-[calc(100%-160px)]">
          {items.length === 0 ? (
            <div className="text-sm text-zinc-600">No items yet.</div>
          ) : (
            items.map((it, i) => (
              <div key={i} className="flex items-center gap-3 border rounded-xl p-2">
                <img src={it.img} alt={it.name} className="w-14 h-14 object-cover rounded-lg" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{it.name}</div>
                  <div className="text-xs text-zinc-600">${it.price.toFixed(2)}</div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-zinc-600">Subtotal</div>
            <div className="font-semibold">${subtotal.toFixed(2)}</div>
          </div>
          <Button className="w-full" onClick={()=>logEvent('checkout_start', { items: items.map(i=>i.id), subtotal })}>Proceed to checkout</Button>
          <p className="mt-2 text-[11px] text-zinc-500">
            This is a research prototype. A small proportion of participants may be asked to complete a binding
            purchase at the shown price (1-in-20) to make decisions incentive compatible.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [arm, setArm] = useState(FORCED_ARM);
  const [explainer] = useState(DEFAULT_EXPLAINER);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("relevance");

  useEffect(() => {
    logEvent("session_start", { ua: navigator.userAgent, ref: document.referrer || null });
    const onBeforeUnload = () => logEvent("session_end");
    window.addEventListener("beforeunload", onBeforeUnload);
    const hb = setInterval(() => { if (document.visibilityState === 'visible') logEvent('heartbeat', { active: true }); }, 5000);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      clearInterval(hb);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let items = CATALOG.filter((p) =>
      [p.name, p.brand, ...(p.tags || []), p.personaText, p.featureText]
        .some((x) => x.toLowerCase().includes(q))
    );
    if (sort === "price_asc") items = [...items].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") items = [...items].sort((a, b) => b.price - a.price);
    if (sort === "rating") items = [...items].sort((a, b) => b.rating - a.rating);
    return items;
  }, [query, sort]);

  function handleAdd(p) {
    logEvent("add_to_cart", { product: p.id, price: p.price, arm, explainer });
    setCart((c) => [...c, p]);
    setCartOpen(true);
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Header arm={arm} explainer={explainer} onToggleDrawer={() => setCartOpen(true)} onToggleArm={() => setArm(arm === 'persona' ? 'feature' : 'persona')} />
      <Hero arm={arm} />

      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center gap-3 border-b">
        <input
          className="flex-1 px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-zinc-300"
          placeholder="Search products"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => logEvent("search_focus", { arm, explainer })}
        />
        <select
          className="px-3 py-2 rounded-xl border"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="relevance">Sort: Relevance</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 hidden lg:block">
          <Filters />
        </div>
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Top picks</h2>
            <div className="text-sm text-zinc-600">
              Showing <span className="font-medium">{filtered.length}</span> items
            </div>
          </div>
          <Grid products={filtered} arm={arm} explainer={explainer} onAdd={handleAdd} />
        </div>
      </main>

      <footer className="border-t py-8 text-sm text-zinc-600">
        <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="font-medium text-zinc-800">About this research</div>
            <p>We are testing how different ways of presenting products affect shopping choices.</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge>Forced arm via env</Badge>
            <Badge>Prototype • No real shipping</Badge>
          </div>
        </div>
      </footer>

      <CartDrawer open={cartOpen} items={cart} onClose={() => setCartOpen(false)} />
    </div>
  );
}
