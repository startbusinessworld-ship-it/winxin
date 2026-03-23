import { useState, useEffect } from "react";
import Head from "next/head";

const SUPABASE_URL = "https://ulplyswdnneripnppyvb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVscGx5c3dkbm5lcmlwbnBweXZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxOTM4NjcsImV4cCI6MjA4OTc2OTg2N30.DMysw_S5bxDJ64-5SVoRKbJjZH0aUDceWH3PKDXO47M";

const categories = [
  { id: "tous", label: "Tous", color: "#5F5E5A", bg: "#F1EFE8" },
  { id: "tech", label: "Électronique", color: "#185FA5", bg: "#E6F1FB" },
  { id: "textile", label: "Textile & Mode", color: "#993556", bg: "#FBEAF0" },
  { id: "maison", label: "Maison & Déco", color: "#0F6E56", bg: "#E1F5EE" },
  { id: "sport", label: "Sport & Loisirs", color: "#854F0B", bg: "#FAEEDA" },
  { id: "beaute", label: "Beauté & Soin", color: "#993C1D", bg: "#FAECE7" },
  { id: "jouets", label: "Jouets & Enfants", color: "#3B6D11", bg: "#EAF3DE" },
  { id: "auto", label: "Auto & Moto", color: "#534AB7", bg: "#EEEDFE" },
  { id: "buro", label: "Bureau & Papeterie", color: "#444441", bg: "#F1EFE8" },
];

function getRemise(remises, qty) {
  if (!remises || !Array.isArray(remises)) return 0;
  let pct = 0;
  for (const r of remises) { if (qty >= r.qte) pct = r.pct; }
  return pct;
}

export default function Home() {
  const [activecat, setActivecat] = useState("tous");
  const [cart, setCart] = useState({});
  const [quantities, setQuantities] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(SUPABASE_URL + "/rest/v1/Produits?select=*", {
      headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
    })
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const getCat = (id) => categories.find((c) => c.id === id) || categories[0];
  const filteredProducts = activecat === "tous" ? products : products.filter((p) => p.categorie === activecat);
  const getQty = (id, min) => quantities[id] !== undefined ? quantities[id] : (min || 1);
  const setQty = (id, val, min) => {
    const minimum = min || 1;
    const newVal = Math.max(minimum, parseInt(val) || minimum);
    setQuantities((prev) => ({ ...prev, [id]: newVal }));
  };
  const addToCart = (p) => {
    const qty = getQty(p.id, p.min_commande);
    const remise = getRemise(p.remises, qty);
    const prixFinal = p.prix * (1 - remise / 100);
    setCart((prev) => ({ ...prev, [p.id]: { qty, prix: prixFinal, nom: p.nom, remise } }));
  };
  const cartQty = Object.values(cart).reduce((a, b) => a + b.qty, 0);
  const cartTotal = Object.values(cart).reduce((acc, item) => acc + item.prix * item.qty, 0);
  const submitOrder = () => { setModalOpen(false); setSuccess(true); setCart({}); };

  return (
    <>
      <Head><title>Winxin — Import B2B Usines Certifiées</title></Head>
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; background:#fff; color:#1a1a1a; }
        :root { --red:#E24B4A; --red-dark:#A32D2D; --red-light:#FCEBEB; --red-border:#F7C1C1; --muted:#6b6b6b; --bg2:#f7f6f2; --border:rgba(0,0,0,0.1); --radius-md:8px; --radius-lg:12px; }
        nav { display:flex; align-items:center; justify-content:space-between; padding:14px 24px; background:#fff; border-bottom:0.5px solid var(--border); position:sticky; top:0; z-index:50; }
        .logo { font-size:21px; font-weight:500; }
        .logo span { color:var(--red); }
        .nav-links { display:flex; gap:18px; font-size:13px; color:var(--muted); }
        .nav-cta { background:var(--red); color:#fff; border:none; padding:8px 18px; border-radius:var(--radius-md); font-size:13px; cursor:pointer; font-weight:500; }
        .hero { padding:52px 24px 44px; border-bottom:0.5px solid var(--border); }
        .eyebrow { display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap; }
        .pill { font-size:11px; padding:3px 10px; border-radius:20px; font-weight:500; }
        .pill-red { background:var(--red-light); color:var(--red-dark); }
        .pill-green { background:#EAF3DE; color:#3B6D11; }
        h1 { font-size:34px; font-weight:500; line-height:1.2; max-width:580px; margin-bottom:14px; }
        h1 em { font-style:normal; color:var(--red); }
        .hero p { font-size:15px; color:var(--muted); max-width:500px; line-height:1.7; margin-bottom:28px; }
        .hero-btns { display:flex; gap:10px; }
        .btn-primary { background:var(--red); color:#fff; border:none; padding:11px 24px; border-radius:var(--radius-md); font-size:14px; cursor:pointer; font-weight:500; }
        .btn-ghost { background:transparent; border:0.5px solid var(--border); padding:11px 24px; border-radius:var(--radius-md); font-size:14px; cursor:pointer; }
        .certifs { display:flex; flex-wrap:wrap; border-bottom:0.5px solid var(--border); background:var(--bg2); }
        .certif-item { flex:1; min-width:140px; padding:14px 18px; border-right:0.5px solid var(--border); display:flex; align-items:center; gap:10px; }
        .certif-item:last-child { border-right:none; }
        .certif-badge { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:14px; }
        .certif-label { font-size:12px; font-weight:500; }
        .certif-sub { font-size:11px; color:var(--muted); }
        .transport-strip { background:var(--red-light); border-bottom:0.5px solid var(--red-border); padding:14px 24px; display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
        .transport-icon { font-size:22px; }
        .transport-text strong { font-size:13px; color:var(--red-dark); display:block; margin-bottom:2px; }
        .transport-text span { font-size:12px; color:#791F1F; }
        .transport-steps { display:flex; gap:6px; flex-wrap:wrap; margin-left:auto; }
        .tstep { background:#fff; border:0.5px solid var(--red-border); border-radius:var(--radius-md); padding:5px 10px; font-size:11px; color:var(--red-dark); }
        .cats-bar { padding:16px 24px 0; }
        .cats-bar-label { font-size:11px; color:var(--muted); margin-bottom:8px; }
        .cat-tabs { display:flex; gap:8px; flex-wrap:wrap; }
        .cat-tab { padding:6px 14px; border-radius:20px; font-size:12px; cursor:pointer; border:0.5px solid var(--border); background:#fff; transition:all .12s; }
        .cat-tab.active { background:var(--red); color:#fff; border-color:var(--red); }
        .section { padding:20px 24px 32px; }
        .section-header { display:flex; align-items:baseline; justify-content:space-between; margin-bottom:16px; }
        .section-title { font-size:16px; font-weight:500; }
        .count-label { font-size:13px; color:var(--muted); }
        .products-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:14px; }
        .product-card { background:#fff; border:0.5px solid var(--border); border-radius:var(--radius-lg); overflow:hidden; transition:border-color .15s; }
        .product-card:hover { border-color:var(--red); }
        .product-img { height:160px; background:var(--bg2); display:flex; align-items:center; justify-content:center; border-bottom:0.5px solid var(--border); position:relative; overflow:hidden; }
        .product-img img { width:100%; height:100%; object-fit:cover; }
        .product-img-placeholder { font-size:40px; }
        .cert-dot { position:absolute; top:8px; right:8px; background:#EAF3DE; color:#3B6D11; font-size:10px; padding:2px 6px; border-radius:10px; }
        .product-info { padding:12px; }
        .cat-badge { display:inline-block; font-size:10px; padding:2px 7px; border-radius:10px; margin-bottom:6px; font-weight:500; }
        .product-name { font-size:14px; font-weight:500; margin-bottom:4px; line-height:1.3; }
        .product-min { font-size:11px; color:var(--muted); margin-bottom:8px; }
        .product-price-big { font-size:22px; font-weight:500; color:var(--red); margin-bottom:2px; }
        .product-price-unit { font-size:11px; color:var(--muted); margin-bottom:8px; }
        .prix-remise { font-size:11px; color:#3B6D11; font-weight:500; margin-left:6px; }
        .remises-bar { display:flex; gap:4px; flex-wrap:wrap; margin-bottom:10px; }
        .remise-pill { font-size:10px; padding:2px 7px; border-radius:10px; font-weight:500; background:#EAF3DE; color:#3B6D11; border:0.5px solid #C0DD97; }
        .remise-pill.active { background:#3B6D11; color:#fff; }
        .qty-row { display:flex; align-items:center; gap:6px; margin-bottom:10px; }
        .qty-btn { width:28px; height:28px; border-radius:50%; border:0.5px solid var(--border); background:var(--bg2); font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; font-weight:500; transition:all .12s; flex-shrink:0; }
        .qty-btn:hover { border-color:var(--red); color:var(--red); }
        .qty-input { width:52px; text-align:center; border:0.5px solid var(--border); border-radius:6px; padding:4px; font-size:14px; font-weight:500; outline:none; }
        .qty-total { font-size:12px; color:var(--muted); margin-left:auto; white-space:nowrap; }
        .add-btn { width:100%; background:var(--red); color:#fff; border:none; padding:9px; border-radius:var(--radius-md); font-size:13px; cursor:pointer; font-weight:500; }
        .add-btn:hover { opacity:0.9; }
        .add-btn.added { background:#EAF3DE; color:#3B6D11; border:0.5px solid #C0DD97; }
        .loading { text-align:center; padding:60px 24px; font-size:14px; color:var(--muted); }
        .how { background:var(--bg2); border-top:0.5px solid var(--border); border-bottom:0.5px solid var(--border); }
        .how-title { padding:18px 24px 12px; font-size:15px; font-weight:500; }
        .steps-row { display:grid; grid-template-columns:repeat(5,1fr); }
        .step { padding:16px 14px 20px; border-right:0.5px solid var(--border); text-align:center; }
        .step:last-child { border-right:none; }
        .step-num { width:26px; height:26px; border-radius:50%; background:var(--red); color:#fff; font-size:12px; font-weight:500; display:flex; align-items:center; justify-content:center; margin:0 auto 8px; }
        .step-title { font-size:12px; font-weight:500; margin-bottom:4px; }
        .step-desc { font-size:11px; color:var(--muted); line-height:1.4; }
        .reassurance { display:grid; grid-template-columns:repeat(3,1fr); border-top:0.5px solid var(--border); border-bottom:0.5px solid var(--border); }
        .reas-item { padding:22px 20px; border-right:0.5px solid var(--border); }
        .reas-item:last-child { border-right:none; }
        .reas-num { font-size:28px; font-weight:500; color:var(--red); margin-bottom:4px; }
        .reas-label { font-size:13px; font-weight:500; margin-bottom:4px; }
        .reas-desc { font-size:12px; color:var(--muted); line-height:1.5; }
        .cart-bar { position:sticky; bottom:0; background:#fff; border-top:0.5px solid var(--border); padding:12px 24px; display:flex; align-items:center; justify-content:space-between; }
        .cart-count { display:inline-flex; align-items:center; justify-content:center; background:var(--red); color:#fff; font-size:10px; width:18px; height:18px; border-radius:50%; margin-left:4px; }
        .cart-ht { font-size:11px; color:var(--muted); }
        .checkout-btn { background:var(--red); color:#fff; border:none; padding:10px 22px; border-radius:var(--radius-md); font-size:13px; cursor:pointer; font-weight:500; }
        .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.45); display:flex; align-items:center; justify-content:center; z-index:100; }
        .modal { background:#fff; border-radius:var(--radius-lg); width:440px; max-width:93vw; padding:26px; max-height:90vh; overflow-y:auto; }
        .modal h2 { font-size:17px; font-weight:500; margin-bottom:5px; }
        .modal-sub { font-size:13px; color:var(--muted); margin-bottom:18px; line-height:1.6; }
        .form-row { margin-bottom:11px; }
        .form-row label { display:block; font-size:12px; color:var(--muted); margin-bottom:4px; }
        .form-row input, .form-row select, .form-row textarea { width:100%; font-size:13px; padding:8px 10px; border:0.5px solid var(--border); border-radius:var(--radius-md); background:#fff; outline:none; }
        .form-2col { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .form-row textarea { height:65px; resize:none; }
        .freight-note { background:var(--bg2); border:0.5px solid var(--border); border-radius:var(--radius-md); padding:11px 13px; font-size:12px; color:var(--muted); margin:12px 0; line-height:1.6; }
        .freight-note strong { color:#1a1a1a; }
        .modal-actions { display:flex; gap:8px; margin-top:14px; }
        .modal-cancel { flex:1; background:var(--bg2); border:0.5px solid var(--border); padding:10px; border-radius:var(--radius-md); font-size:13px; cursor:pointer; }
        .modal-confirm { flex:2; background:var(--red); color:#fff; border:none; padding:10px; border-radius:var(--radius-md); font-size:13px; cursor:pointer; font-weight:500; }
        .success-box { background:#fff; border-radius:var(--radius-lg); padding:32px; text-align:center; max-width:360px; width:90vw; }
        .success-icon { font-size:48px; margin-bottom:16px; }
        .success-title { font-size:18px; font-weight:500; margin-bottom:8px; }
        .success-desc { font-size:13px; color:var(--muted); line-height:1.6; margin-bottom:20px; }
        .success-btn { background:var(--red); color:#fff; border:none; padding:10px 24px; border-radius:var(--radius-md); font-size:13px; cursor:pointer; font-weight:500; }
      `}</style>

      <nav>
        <div className="logo">Win<span>xin</span></div>
        <div className="nav-links"><span>Catalogue</span><span>Comment ça marche</span><span>Nos usines</span><span>Contact</span></div>
        <button className="nav-cta" onClick={() => setModalOpen(true)}>Passer commande</button>
      </nav>

      <div className="hero">
        <div className="eyebrow">
          <span className="pill pill-red">Import B2B · Usines certifiées</span>
          <span className="pill pill-green">CE · ISO · RoHS · SGS</span>
        </div>
        <h1>La marchandise d'usine <em>sélectionnée</em>, livrée chez vous</h1>
        <p>Nous sélectionnons les meilleures usines chinoises certifiées aux normes internationales. Vous commandez, on gère tout le transport de A à Z.</p>
        <div className="hero-btns">
          <button className="btn-primary">Voir le catalogue</button>
          <button className="btn-ghost">Comment ça marche ?</button>
        </div>
      </div>

      <div className="certifs">
        <div className="certif-item"><div className="certif-badge" style={{background:"#EAF3DE"}}>✓</div><div><div className="certif-label">Usines certifiées</div><div className="certif-sub">CE, ISO 9001, RoHS, SGS</div></div></div>
        <div className="certif-item"><div className="certif-badge" style={{background:"#E6F1FB"}}>🚢</div><div><div className="certif-label">Transport géré</div><div className="certif-sub">Mer, air, express — de A à Z</div></div></div>
        <div className="certif-item"><div className="certif-badge" style={{background:"#FAEEDA"}}>📦</div><div><div className="certif-label">MOQ accessible</div><div className="certif-sub">Dès 5 unités selon produit</div></div></div>
        <div className="certif-item"><div className="certif-badge" style={{background:"#FCEBEB"}}>💳</div><div><div className="certif-label">Paiement sécurisé</div><div className="certif-sub">Stripe ou virement bancaire</div></div></div>
      </div>

      <div className="transport-strip">
        <div className="transport-icon">🚢</div>
        <div className="transport-text">
          <strong>Transport calculé après commande — inclus dans notre service</strong>
          <span>Vous payez les produits en ligne. Devis fret personnalisé sous 48h.</span>
        </div>
        <div className="transport-steps">
          <div className="tstep">Vous commandez</div>
          <div className="tstep">Devis fret 48h</div>
          <div className="tstep">Expédition usine</div>
        </div>
      </div>

      <div className="cats-bar">
        <div className="cats-bar-label">Filtrer par catégorie</div>
        <div className="cat-tabs">
          {categories.map((c) => (
            <div key={c.id} className={"cat-tab" + (activecat === c.id ? " active" : "")} onClick={() => setActivecat(c.id)}>{c.label}</div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <div className="section-title">{activecat === "tous" ? "Tous les produits" : getCat(activecat).label}</div>
          <div className="count-label">{filteredProducts.length} références</div>
        </div>
        {loading ? (
          <div className="loading">Chargement des produits...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="loading">Aucun produit dans cette catégorie.</div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((p) => {
              const c = getCat(p.categorie);
              const inCart = cart[p.id];
              const min = p.min_commande || 1;
              const qty = getQty(p.id, min);
              const remise = getRemise(p.remises, qty);
              const prixFinal = p.prix * (1 - remise / 100);
              const totalLigne = (prixFinal * qty).toFixed(2);
              return (
                <div className="product-card" key={p.id}>
                  <div className="product-img">
                    {p.image_url ? <img src={p.image_url} alt={p.nom} /> : <span className="product-img-placeholder">{p.emoji || "📦"}</span>}
                    <span className="cert-dot">✓ Certifié</span>
                  </div>
                  <div className="product-info">
                    <span className="cat-badge" style={{background:c.bg, color:c.color}}>{c.label}</span>
                    <div className="product-name">{p.nom}</div>
                    <div className="product-min">Minimum de commande : {min} pcs</div>
                    <div className="product-price-big">
                      {prixFinal.toFixed(2)} <span style={{fontSize:"13px"}}>{p.unite}</span>
                      {remise > 0 && <span className="prix-remise">−{remise}%</span>}
                    </div>
                    <div className="product-price-unit">
                      {remise > 0 ? <span>Prix remisé · <span style={{textDecoration:"line-through",color:"var(--muted)"}}>{Number(p.prix).toFixed(2)}€</span></span> : "Prix à l'unité"}
                    </div>
                    {p.remises && Array.isArray(p.remises) && p.remises.length > 0 && (
                      <div className="remises-bar">
                        {p.remises.map((r) => (
                          <span key={r.qte} className={"remise-pill" + (qty >= r.qte ? " active" : "")}>
                            -{r.pct}% dès {r.qte} pcs
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="qty-row">
                      <button className="qty-btn" onClick={() => setQty(p.id, qty - 1, min)}>−</button>
                      <input type="number" className="qty-input" value={qty} min={min} onChange={(e) => setQty(p.id, e.target.value, min)} />
                      <button className="qty-btn" onClick={() => setQty(p.id, qty + 1, min)}>+</button>
                      <span className="qty-total">= {totalLigne} €</span>
                    </div>
                    <button className={"add-btn" + (inCart ? " added" : "")} onClick={() => addToCart(p)}>
                      {inCart ? "✓ Dans le panier" : "Ajouter au panier"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="how">
        <div className="how-title">Comment ça marche</div>
        <div className="steps-row">
          {[["1","Choisissez","Parcourez le catalogue"],["2","Payez en ligne","Règlement sécurisé"],["3","Devis fret","Transport calculé sous 48h"],["4","Validation","Vous acceptez, on confirme"],["5","Livraison","Expédition depuis l'usine"]].map(([num,title,desc])=>(
            <div className="step" key={num}><div className="step-num">{num}</div><div className="step-title">{title}</div><div className="step-desc">{desc}</div></div>
          ))}
        </div>
      </div>

      <div className="reassurance">
        <div className="reas-item"><div className="reas-num">200+</div><div className="reas-label">Usines partenaires</div><div className="reas-desc">Certifiées CE, ISO, SGS</div></div>
        <div className="reas-item"><div className="reas-num">48h</div><div className="reas-label">Devis transport</div><div className="reas-desc">Mer, air ou express</div></div>
        <div className="reas-item"><div className="reas-num">5000+</div><div className="reas-label">Références disponibles</div><div className="reas-desc">Toutes catégories, prix usine</div></div>
      </div>

      <div style={{height:"64px"}} />

      {cartQty > 0 && (
        <div className="cart-bar">
          <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
            <div style={{fontSize:"13px"}}>Panier<span className="cart-count">{cartQty}</span></div>
            <div style={{fontSize:"13px",color:"var(--muted)"}}><strong>{cartTotal.toFixed(2)} €</strong> <span className="cart-ht">HT · hors transport</span></div>
          </div>
          <button className="checkout-btn" onClick={() => setModalOpen(true)}>Finaliser la commande →</button>
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Passer commande</h2>
            <div className="modal-sub">Renseignez vos informations. Devis transport envoyé sous 48h.</div>
            <div className="form-2col">
              <div className="form-row"><label>Société</label><input type="text" placeholder="Nom de votre société" /></div>
              <div className="form-row"><label>Contact</label><input type="text" placeholder="Votre nom" /></div>
            </div>
            <div className="form-row"><label>Email professionnel</label><input type="email" placeholder="contact@societe.com" /></div>
            <div className="form-row"><label>Téléphone / WhatsApp</label><input type="tel" placeholder="+33 6 00 00 00 00" /></div>
            <div className="form-2col">
              <div className="form-row"><label>Pays de livraison</label>
                <select><option>France</option><option>Belgique</option><option>Maroc</option><option>Algérie</option><option>Sénégal</option><option>Côte d'Ivoire</option><option>Autre</option></select>
              </div>
              <div className="form-row"><label>Ville / Port</label><input type="text" placeholder="Marseille..." /></div>
            </div>
            <div className="form-row"><label>Message</label><textarea placeholder="Délai souhaité, incoterm (FOB, CIF…)..." /></div>
            <div className="freight-note"><strong>Transport :</strong> devis fret envoyé sous 48h. Aucune expédition sans votre accord.</div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setModalOpen(false)}>Annuler</button>
              <button className="modal-confirm" onClick={submitOrder}>Envoyer la commande →</button>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="modal-overlay">
          <div className="success-box">
            <div className="success-icon">✅</div>
            <div className="success-title">Commande envoyée !</div>
            <div className="success-desc">Notre équipe vous contacte sous 48h avec le devis transport.</div>
            <button className="success-btn" onClick={() => setSuccess(false)}>Fermer</button>
          </div>
        </div>
      )}
    </>
  );
}
