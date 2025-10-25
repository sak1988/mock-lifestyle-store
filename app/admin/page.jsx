'use client';
import { useEffect, useState } from 'react';

const API = {
  list: async () => fetch('/api/admin/products').then(r=>r.json()),
  create: async (pw, body) => fetch('/api/admin/products', { method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+pw}, body: JSON.stringify(body)}).then(r=>r.json()),
  update: async (pw, body) => fetch('/api/admin/products', { method:'PATCH', headers:{'Content-Type':'application/json','Authorization':'Bearer '+pw}, body: JSON.stringify(body)}).then(r=>r.json()),
  remove: async (pw, id) => fetch('/api/admin/products?id='+id, { method:'DELETE', headers:{'Authorization':'Bearer '+pw} }).then(r=>r.json()),
  getCfg: async () => fetch('/api/admin/config').then(r=>r.json()),
  saveCfg: async (pw, body) => fetch('/api/admin/config', { method:'PATCH', headers:{'Content-Type':'application/json','Authorization':'Bearer '+pw}, body: JSON.stringify(body)}).then(r=>r.json()),
};

export default function Admin() {
  const [pw, setPw] = useState('');
  const [authed, setAuthed] = useState(false);
  const [items, setItems] = useState([]);
  const [cfg, setCfg] = useState({ nav: [], hero_image: '' });

  useEffect(() => { refresh(); }, []);
  useEffect(() => {
    const saved = localStorage.getItem('admin_pw');
    if (saved) { setPw(saved); setAuthed(true); }
  }, []);

  async function refresh() {
    const [list, c] = await Promise.all([API.list(), API.getCfg()]);
    setItems(list || []); setCfg(c || { nav: [], hero_image: '' });
  }

  function unlock() {
    if (!pw) return;
    setAuthed(true);
    localStorage.setItem('admin_pw', pw);
  }

  async function addEmpty() {
    await API.create(pw, { name:'New Product', brand:'', price:0, img:'', persona_text:'', feature_text:'', tags:['Misc'] });
    refresh();
  }
  async function saveItem(p) { await API.update(pw, p); refresh(); }
  async function delItem(id) { await API.remove(pw, id); refresh(); }
  async function saveCfg() { await API.saveCfg(pw, cfg); refresh(); }

  if (!authed) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <h1 className="text-xl font-semibold mb-3">Admin</h1>
        <input type="password" placeholder="Enter admin password"
               value={pw} onChange={e=>setPw(e.target.value)}
               className="w-full border rounded p-2 mb-3"/>
        <button onClick={unlock} className="px-3 py-2 rounded border">Unlock</button>
        <p className="text-sm text-gray-600 mt-3">Password must match Vercel env <code>ADMIN_PASSWORD</code>.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      <section>
        <h2 className="text-lg font-semibold mb-3">Site config</h2>
        <label className="block text-sm">Hero image URL</label>
        <input className="w-full border rounded p-2 mb-3" value={cfg?.hero_image||''}
               onChange={e=>setCfg({...cfg, hero_image:e.target.value})}/>
        <label className="block text-sm">Top navigation (comma-separated)</label>
        <input className="w-full border rounded p-2 mb-3"
               value={(cfg?.nav||[]).join(', ')}
               onChange={e=>setCfg({...cfg, nav:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}/>
        <button onClick={saveCfg} className="px-3 py-2 rounded border">Save config</button>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Products</h2>
          <button onClick={addEmpty} className="px-3 py-2 rounded border">+ Add product</button>
        </div>
        <div className="mt-4 grid gap-4">
          {items.map(p=>(
            <div key={p.id} className="border rounded p-3 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className="block text-sm">Name</label>
                  <input className="w-full border rounded p-2" value={p.name||''} onChange={e=>p.name=e.target.value}/></div>
                <div><label className="block text-sm">Brand</label>
                  <input className="w-full border rounded p-2" value={p.brand||''} onChange={e=>p.brand=e.target.value}/></div>
                <div><label className="block text-sm">Price</label>
                  <input type="number" className="w-full border rounded p-2" value={p.price||0} onChange={e=>p.price=parseFloat(e.target.value)}/></div>
                <div><label className="block text-sm">Image URL</label>
                  <input className="w-full border rounded p-2" value={p.img||''} onChange={e=>p.img=e.target.value}/></div>
                <div className="md:col-span-2"><label className="block text-sm">Persona description</label>
                  <textarea className="w-full border rounded p-2" rows={2} value={p.persona_text||''} onChange={e=>p.persona_text=e.target.value}/></div>
                <div className="md:col-span-2"><label className="block text-sm">Feature description</label>
                  <textarea className="w-full border rounded p-2" rows={2} value={p.feature_text||''} onChange={e=>p.feature_text=e.target.value}/></div>
                <div className="md:col-span-2"><label className="block text-sm">Tags (comma-separated)</label>
                  <input className="w-full border rounded p-2" value={(p.tags||[]).join(', ')}
                         onChange={e=>p.tags=e.target.value.split(',').map(s=>s.trim()).filter(Boolean)}/></div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded border" onClick={()=>saveItem(p)}>Save</button>
                <button className="px-3 py-2 rounded border" onClick={()=>delItem(p.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
