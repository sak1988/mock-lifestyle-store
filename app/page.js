
'use client';
import React, { useEffect, useMemo, useState } from "react";

const FORCED_ARM = process.env.NEXT_PUBLIC_FRAME_ARM === 'feature' ? 'feature' : 'persona';
const ENV_SHOW_RECS = process.env.NEXT_PUBLIC_SHOW_RECS; // optional env override

function getOrCreateSessionId() {
  const k = 'sess_id_v1';
  let id = localStorage.getItem(k);
  if (!id) { id = crypto.randomUUID(); localStorage.setItem(k, id); }
  return id;
}
function logEvent(name, payload = {}) {
  try {
    fetch('/api/events', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name, session_id: getOrCreateSessionId(), arm: FORCED_ARM, ts: Date.now(), payload }),
      keepalive: true,
    });
  } catch (e) { console.log("EVENT (fallback):", name, payload); }
}

function StarRating({ value }) {
  const whole = Math.floor(value||0);
  const half = (value - whole) >= 0.5;
  const empties = 5 - whole - (half ? 1 : 0);
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating ${value}`}>
      {Array.from({ length: whole }).map((_, i) => (<span key={'w'+i}>★</span>))}
      {half && <span>☆</span>}
      {Array.from({ length: Math.max(empties,0) }).map((_, i) => (<span key={'e'+i}>☆</span>))}
      <span className="ml-1 text-sm text-zinc-500">{(value||0).toFixed(1)}</span>
    </div>
  );
}
function Badge({ children }) { return <span className="px-2 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs border">{children}</span>; }
function Button({ children, onClick, className="" }) {
  return <button onClick={onClick} className={`px-3 py-2 rounded-xl border hover:bg-zinc-50 ${className}`}>{children}</button>;
}

function Header({ arm, nav, onToggleDrawer }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
        <div className="text-xl font-semibold">Lifestyle Outlet</div>
        <nav className="hidden md:flex items-center gap-3 text-sm text-zinc-600">
          {(nav||[]).map((item) => (<a key={item} href="#" className="hover:underline">{item}</a>))}
        </nav>
        <div className="ml-auto flex items-center gap-2 text-xs text-zinc-600">
          <Badge>Arm: {arm}</Badge>
          <Button onClick={onToggleDrawer}>Cart</Button>
        </div>
      </div>
    </header>
  );
}

function Hero({ arm, heroImage }) {
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
          <img src={heroImage} alt="Lifestyle collage" className="w-full h-56 object-cover" />
        </div>
      </div>
    </section>
  );
}

function ProductCard({ p, arm, onAdd }) {
  const lead = arm === "persona" ? p.personaText : p.featureText;
  return (
    <div className="border rounded-2xl overflow-hidden hover:shadow-sm transition bg-white flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={p.img} alt={p.name} className="w-full h-full object-cover"
             onError={(e)=>{e.currentTarget.src='https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop'}} />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="text-xs text-zinc-500">{p.brand}</div>
        <div className="font-medium leading-tight">{p.name}</div>
        <StarRating value={p.rating} />
        <p className="text-sm text-zinc-700 line-clamp-2">{lead}</p>
        <div className="flex items-center gap-2 mt-1">
          {(p.tags||[]).slice(0, 2).map((t) => (<Badge key={t}>{t}</Badge>))}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-lg font-semibold">${(p.price||0).toFixed(2)}</div>
          <Button onClick={() => onAdd(p)}>Add to cart</Button>
        </div>
      </div>
    </div>
  );
}

function Grid({ products, arm, onAdd }) {
  useEffect(() => { /* log impression if needed */ }, [products, arm]);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((p) => (<ProductCard key={p.id} p={p} arm={arm} onAdd={onAdd} />))}
    </div>
  );
}

function CartDrawer({ open, items, onClose }) {
  const subtotal = items.reduce((s, it) => s + (it.price||0), 0);
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
                  <div className="text-xs text-zinc-600">${(it.price||0).toFixed(2)}</div>
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
          <Button className="w-full">Proceed to checkout</Button>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [arm] = useState(FORCED_ARM);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("relevance");
  const [nav, setNav] = useState(["Deals","Footwear","Apparel","Accessories","Electronics"]);
  const [heroImage, setHeroImage] = useState("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop");
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    logEvent("session_start", { ua: navigator.userAgent, ref: document.referrer || null });
    const onBeforeUnload = () => logEvent("session_end");
    window.addEventListener("beforeunload", onBeforeUnload);
    const hb = setInterval(() => { if (document.visibilityState === 'visible') logEvent('heartbeat', { active: true }); }, 5000);

    fetch('/config.json').then(r=>r.json()).then(cfg => {
      setNav(cfg.nav || nav);
      setHeroImage(cfg.heroImage || heroImage);
      // recommendations removed; config controls it but we ignore rendering
    }).catch(()=>{});
    fetch('/catalog.json').then(r=>r.json()).then(setCatalog).catch(()=>{});

    return () => { window.removeEventListener("beforeunload", onBeforeUnload); clearInterval(hb); };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let items = (catalog.length?catalog:[]).filter((p) =>
      [p.name, p.brand, ...((p.tags)||[]), p.personaText, p.featureText].some((x) => (x||'').toLowerCase().includes(q))
    );
    if (sort === "price_asc") items = [...items].sort((a, b) => (a.price||0) - (b.price||0));
    if (sort === "price_desc") items = [...items].sort((a, b) => (b.price||0) - (a.price||0));
    if (sort === "rating") items = [...items].sort((a, b) => (b.rating||0) - (a.rating||0));
    return items;
  }, [query, sort, catalog]);

  function handleAdd(p) {
    logEvent("add_to_cart", { product: p.id, price: p.price, arm });
    setCart((c) => [...c, p]);
    setCartOpen(true);
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Header arm={arm} nav={nav} onToggleDrawer={() => setCartOpen(true)} />
      <Hero arm={arm} heroImage={heroImage} />

      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center gap-3 border-b">
        <input className="flex-1 px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-zinc-300"
          placeholder="Search products" value={query} onChange={(e) => setQuery(e.target.value)}
          onFocus={() => logEvent("search_focus", { arm })}
        />
        <select className="px-3 py-2 rounded-xl border" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="relevance">Sort: Relevance</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 hidden lg:block">
          <div className="space-y-6">
            <div><h3 className="font-medium mb-2">Departments</h3><ul className="space-y-2 text-sm">
              {["Footwear","Apparel","Accessories","Electronics","Sleep & Recovery"].map((d)=>(
                <li key={d} className="flex items-center gap-2"><input type="checkbox" className="accent-black"/><span>{d}</span></li>
              ))}
            </ul></div>
          </div>
        </div>
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Top picks</h2>
            <div className="text-sm text-zinc-600">Showing <span className="font-medium">{filtered.length}</span> items</div>
          </div>
          <Grid products={filtered} arm={arm} onAdd={handleAdd} />
        </div>
      </main>

      <footer className="border-t py-8 text-sm text-zinc-600">
        <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="font-medium text-zinc-800">About this research</div>
            <p>We are testing how different ways of presenting products affect shopping choices.</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge>No‑code: edit /public/config.json & catalog.json</Badge>
          </div>
        </div>
      </footer>

      <CartDrawer open={cartOpen} items={cart} onClose={() => setCartOpen(false)} />
    </div>
  );
}
