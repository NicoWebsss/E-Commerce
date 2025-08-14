// E‑commerce JS — tiny store with localStorage cart
const PRODUCTS = [
  {id:1, title:"Aero Cap", price:24.00, category:"Accessories", img:"https://images.unsplash.com/photo-1612152607435-8cd73b0f2b0c?q=80&w=1200&auto=format&fit=crop"},
  {id:2, title:"Glow Hoodie", price:59.00, category:"Apparel", img:"https://images.unsplash.com/photo-1548883354-7622d02d6db0?q=80&w=1200&auto=format&fit=crop"},
  {id:3, title:"Wave Tee", price:28.00, category:"Apparel", img:"https://images.unsplash.com/photo-1520975922218-7d07a0f4f63f?q=80&w=1200&auto=format&fit=crop"},
  {id:4, title:"Orbit Mouse", price:39.00, category:"Tech", img:"https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=1200&auto=format&fit=crop"},
  {id:5, title:"Neon Keyboard", price:89.00, category:"Tech", img:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop"},
  {id:6, title:"Canvas Tote", price:19.00, category:"Accessories", img:"https://images.unsplash.com/photo-1685090068982-6866967570f0?q=80&w=1200&auto=format&fit=crop"}
];

function getCart(){ return JSON.parse(localStorage.getItem('cart')||'[]'); }
function setCart(cart){ localStorage.setItem('cart', JSON.stringify(cart)); updateCartCount(); }
function updateCartCount(){
  const countEl = document.getElementById('cartCount');
  if(!countEl) return;
  const qty = getCart().reduce((a,i)=>a+i.qty,0);
  countEl.textContent = qty;
}

function renderProducts(){
  const grid = document.getElementById('products');
  if(!grid) return;
  const q = (document.getElementById('search')?.value || '').toLowerCase();
  const cat = (document.getElementById('category')?.value || 'all');
  grid.innerHTML = '';
  PRODUCTS
    .filter(p => (cat==='all' || p.category===cat) && (p.title.toLowerCase().includes(q)))
    .forEach(p => {
      const el = document.createElement('article');
      el.className = 'card';
      el.innerHTML = `
        <img src="${p.img}" alt="${p.title}">
        <div class="card-body">
          <h4>${p.title}</h4>
          <p class="price">$${p.price.toFixed(2)}</p>
          <button class="btn" data-add="${p.id}">Add to Cart</button>
        </div>`;
      grid.appendChild(el);
    });
  grid.addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-add]');
    if(!btn) return;
    const id = Number(btn.dataset.add);
    const cart = getCart();
    const item = cart.find(i=>i.id===id);
    if(item) item.qty += 1; else cart.push({id, qty:1});
    setCart(cart);
  }, {once:true});
}

function renderCart(){
  const list = document.getElementById('cartItems');
  if(!list) return;
  const cart = getCart();
  list.innerHTML = '';
  cart.forEach(ci => {
    const p = PRODUCTS.find(x=>x.id===ci.id);
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <img src="${p.img}" alt="${p.title}" width="80" height="80">
      <div>
        <strong>${p.title}</strong>
        <div class="price">$${p.price.toFixed(2)}</div>
      </div>
      <div class="qty">
        <button data-dec="${ci.id}">-</button>
        <span>${ci.qty}</span>
        <button data-inc="${ci.id}">+</button>
        <button data-rem="${ci.id}" class="btn ghost">Remove</button>
      </div>`;
    list.appendChild(el);
  });
  updateSubtotal();
  list.addEventListener('click', (e)=>{
    const dec = e.target.closest('[data-dec]');
    const inc = e.target.closest('[data-inc]');
    const rem = e.target.closest('[data-rem]');
    let cart = getCart();
    if(dec){ const id=+dec.dataset.dec; cart = cart.map(i=>i.id===id?({...i, qty:Math.max(1,i.qty-1)}):i); }
    if(inc){ const id=+inc.dataset.inc; cart = cart.map(i=>i.id===id?({...i, qty:i.qty+1}):i); }
    if(rem){ const id=+rem.dataset.rem; cart = cart.filter(i=>i.id!==id); }
    setCart(cart); renderCart();
  }, {once:true});
  document.getElementById('clearCart')?.addEventListener('click', ()=>{ setCart([]); renderCart(); }, {once:true});
  document.getElementById('checkout')?.addEventListener('click', ()=>{
    alert('Demo only — connect a real checkout later!');
  }, {once:true});
}

function updateSubtotal(){
  const subEl = document.getElementById('subtotal');
  if(!subEl) return;
  const total = getCart().reduce((sum, ci)=>{
    const p = PRODUCTS.find(x=>x.id===ci.id);
    return sum + (p.price * ci.qty);
  }, 0);
  subEl.textContent = `$${total.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', ()=>{
  updateCartCount();
  renderProducts();
  renderCart();
  document.getElementById('search')?.addEventListener('input', renderProducts);
  document.getElementById('category')?.addEventListener('change', renderProducts);
});
