import { createContext, useContext, useState, type ReactNode } from "react";
import { createBrowserRouter, RouterProvider, useNavigate } from "react-router";
import ImageWithFallback from "./components/ImageWithFallback";
import beadRingsOnKnee from "./imports/image-1.png";
import beadRingsAtTable from "./imports/image-2.png";
import greenDress from "./imports/image-4.png";
import africaMapArtwork from "./imports/image-5.png";
import blueWovenChair from "./imports/image-6.png";
import woodenXBackChair from "./imports/image-7.png";
import kenyanFlagCuff from "./imports/image-8.png";
import butterflyBeadBracelet from "./imports/image-9.png";
import artisanShellObjects from "./imports/image-10.png";

const collections = [
  {
    number: "01",
    name: "Fashion",
    category: "Modern silhouettes · Personal style",
    image: greenDress,
    target: "african-styles",
  },
  {
    number: "02",
    name: "Culture",
    category: "Kenyan beadwork · Artisan craft",
    image: kenyanFlagCuff,
    target: "culture",
  },
  {
    number: "03",
    name: "Art",
    category: "African wall art · Decorative objects",
    image: africaMapArtwork,
    target: "art-house",
  },
];

const adornments = [
  { name: "Kenyan Flag Beaded Wrist Cuff", detail: "Red, black, white & green handwoven beadwork", price: "KSh 900", image: kenyanFlagCuff },
  { name: "Maroon Beaded Ring", detail: "Orange diamond motif · handmade & hand-finished", price: "KSh 350", image: beadRingsOnKnee },
  { name: "Green, Yellow & Red Beaded Ring", detail: "Vibrant handwoven geometric pattern", price: "KSh 350", image: beadRingsAtTable },
  { name: "Frosted Translucent Bead Bracelet", detail: "Pink accents with a hand-finished butterfly charm", price: "KSh 700", image: butterflyBeadBracelet },
  { name: "White/Cream Shell Accessory", detail: "Natural shell, shaped and finished by hand", price: "KSh 500", image: artisanShellObjects },
];

const objects = [
  ["Natural-Material Handmade Accessories", "KSh 800", "Organic, locally inspired materials", artisanShellObjects],
  ["Black Rectangular Compact/Palette", "KSh 600", "A clean, practical artisan accessory", "https://images.unsplash.com/photo-1551533256-20cbb76a6d48?w=720&h=720&fit=crop&auto=format"],
  ["White Rectangular Compact/Palette", "KSh 600", "Fresh, minimal and versatile", "https://images.unsplash.com/photo-1512207576147-99bc3066b621?w=720&h=720&fit=crop&auto=format"],
  ["Brown/Rose-Gold Compact/Palette", "KSh 700", "Warm hand-finished sophistication", "https://images.unsplash.com/photo-1512207426415-91c2e14fbe36?w=720&h=720&fit=crop&auto=format"],
  ["Dark Rectangular Compact/Palette", "KSh 700", "Refined profile with branded finish", "https://images.unsplash.com/photo-1551533256-023b6eab43d8?w=720&h=720&fit=crop&auto=format"],
  ["Blue/Grey Rectangular Compact/Palette", "KSh 600", "Cool-toned contemporary design", "https://images.unsplash.com/photo-1512207576147-99bc3066b621?w=720&h=720&fit=crop&auto=format"],
  ["Additional Dark Rectangular Accessory", "KSh 500", "Understated and versatile", "https://images.unsplash.com/photo-1551533256-20cbb76a6d48?w=720&h=720&fit=crop&auto=format"],
  ["Blue Woven/Plastic Chair", "KSh 4,500", "Handcrafted form for creative interiors", blueWovenChair],
  ["Wooden X-Back Chair", "KSh 6,500", "Architectural silhouette in finished wood", woodenXBackChair],
  ["Handcrafted Wooden Sailing Boat", "KSh 5,500", "A detailed tribute to boatbuilding", "https://images.unsplash.com/photo-1787496994407-4367010606ad?w=720&h=720&fit=crop&auto=format"],
  ["Wooden Wall-Mounted Geometric Planter Set", "KSh 3,500", "Greenery meets hand-finished wood", "https://images.unsplash.com/photo-1759050526841-37d7277c65d1?w=720&h=720&fit=crop&auto=format"],
] as const;

const styles = [
  { number: "04", name: "Nairobi Colour", note: "Fluid tailoring, saturated tones", image: greenDress },
  { number: "05", name: "Modern Heritage", note: "Adornment, form, and presence", image: "https://images.unsplash.com/photo-1619449947405-6aa13108371a?w=1100&h=1330&fit=crop&auto=format" },
  { number: "06", name: "The New Ceremony", note: "For entering a room", image: "https://images.unsplash.com/photo-1772965243005-b64da960038c?w=1100&h=1330&fit=crop&auto=format" },
];

const artworks = [
  { title: "String-Art African Map Wall Artwork", artist: "Artisan collection", medium: "Hand-positioned thread on a shaped board", price: "KSh 2,500", image: africaMapArtwork },
  { title: "Handcrafted Wooden Sailing Boat", artist: "Artisan collection", medium: "Layered wood, miniature sails & hand-finished detail", price: "KSh 5,500", image: "https://images.unsplash.com/photo-1742648592366-b8b0c847fa00?w=900&h=1080&fit=crop&auto=format" },
  { title: "Wooden Geometric Planter Set", artist: "Artisan collection", medium: "Intersecting wood forms with planting compartments", price: "KSh 3,500", image: "https://images.unsplash.com/photo-1779140911680-8f93a48b9107?w=900&h=1080&fit=crop&auto=format" },
];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span className={diagonal ? "inline-block -rotate-45" : "inline-block"}>→</span>;
}

type CartItem = { name: string; price: string; image?: string; quantity: number };
type CartContextValue = { items: CartItem[]; count: number; addItem: (item: Omit<CartItem, "quantity">) => void; updateQuantity: (name: string, amount: number) => void };

const CartContext = createContext<CartContextValue | null>(null);

function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("Cart must be used within CartProvider");
  return cart;
}

function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const addItem = (item: Omit<CartItem, "quantity">) => setItems((current) => {
    const existing = current.find((cartItem) => cartItem.name === item.name);
    return existing ? current.map((cartItem) => cartItem.name === item.name ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem) : [...current, { ...item, quantity: 1 }];
  });
  const updateQuantity = (name: string, amount: number) => setItems((current) => current.flatMap((item) => item.name === name ? (item.quantity + amount > 0 ? [{ ...item, quantity: item.quantity + amount }] : []) : [item]));
  return <CartContext.Provider value={{ items, count: items.reduce((sum, item) => sum + item.quantity, 0), addItem, updateQuantity }}>{children}</CartContext.Provider>;
}

function Home() {
  const [activeCollection, setActiveCollection] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);
  const { addItem, count } = useCart();
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <main className="overflow-x-hidden bg-[#f5f1e9] text-[#171512] selection:bg-[#b89a67] selection:text-white">
      <header className="relative z-20 border-b border-[#171512]/20 bg-[#f5f1e9] px-5 py-5 md:px-10 lg:px-14">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between">
          <button onClick={() => scrollTo("top")} className="font-display text-[22px] tracking-[0.09em]">INDASIO</button>
          <nav className="hidden items-center gap-9 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] md:flex">
            <button onClick={() => scrollTo("african-styles")} className="transition-opacity hover:opacity-50">Fashion</button>
            <button onClick={() => scrollTo("culture")} className="transition-opacity hover:opacity-50">Culture</button>
            <button onClick={() => scrollTo("art-house")} className="transition-opacity hover:opacity-50">Art</button>
            <button onClick={() => scrollTo("experience")} className="transition-opacity hover:opacity-50">The House</button>
            <button onClick={() => scrollTo("visit")} className="transition-opacity hover:opacity-50">Visit</button>
          </nav>
          <div className="hidden items-center gap-5 md:flex"><button onClick={() => navigate("/checkout")} className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] transition-colors hover:text-[#b89a67]">Bag ({count})</button><button onClick={() => setConsultationOpen(true)} className="border-b border-[#171512] pb-1 font-sans text-[10px] font-bold uppercase tracking-[0.18em] transition-colors hover:border-[#b89a67] hover:text-[#b89a67]">Book a consultation</button></div>
          <button aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)} className="grid size-9 place-items-center border border-[#171512]/30 md:hidden">
            <span className="block w-4 border-t border-[#171512] after:mt-1.5 after:block after:w-4 after:border-t after:border-[#171512]" />
          </button>
        </div>
        {menuOpen && <div className="absolute inset-x-0 top-full border-b border-[#171512]/20 bg-[#f5f1e9] px-5 py-7 md:hidden"><div className="flex flex-col gap-5 font-sans text-xs font-semibold uppercase tracking-[0.16em]"><button onClick={() => scrollTo("african-styles")} className="text-left">Fashion</button><button onClick={() => scrollTo("culture")} className="text-left">Culture</button><button onClick={() => scrollTo("art-house")} className="text-left">Art</button><button onClick={() => scrollTo("experience")} className="text-left">The House</button><button onClick={() => scrollTo("visit")} className="text-left">Visit</button><button onClick={() => { setConsultationOpen(true); setMenuOpen(false); }} className="text-left text-[#8e7243]">Book a consultation</button></div></div>}
      </header>

      <section id="top" className="relative min-h-[735px] border-b border-[#f5f1e9]/20 bg-[#171512] text-[#f5f1e9] md:min-h-[840px]">
        <div className="absolute inset-0 ml-[38%] bg-[linear-gradient(90deg,rgba(23,21,18,.86),rgba(23,21,18,.16))]" />
        <img src="https://images.unsplash.com/photo-1595882669314-919b3d51f2c7?w=2000&h=1400&fit=crop&auto=format" alt="African model in Indasio evening tailoring" className="absolute inset-0 h-full w-full object-cover object-[62%_center] opacity-75" />
        <div className="absolute inset-0 bg-[#171512]/25" />
        <div className="relative mx-auto grid min-h-[735px] max-w-[1500px] grid-cols-1 px-5 py-10 md:min-h-[840px] md:grid-cols-12 md:px-10 lg:px-14">
          <div className="col-span-7 flex flex-col justify-between py-4 md:py-8">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[#dccaa9]">Nairobi · Kenya</p>
            <div className="max-w-[690px]">
              <p className="mb-5 font-sans text-[10px] uppercase tracking-[0.22em] text-[#dccaa9]">Seasonal study / 2026</p>
              <h1 className="font-display text-[clamp(4rem,9vw,9rem)] leading-[.77] tracking-[-0.055em]">Quietly,<br /><i className="font-light">entirely</i><br />your own.</h1>
            </div>
          </div>
          <div className="col-span-5 flex items-end justify-end pb-4 md:pb-8">
            <div className="max-w-[240px] border-l border-[#f5f1e9]/40 pl-5 font-sans text-sm leading-6 text-[#f5f1e9]/85">A considered wardrobe for the life you are building—made with exactitude in Nairobi.</div>
          </div>
        </div>
        <button onClick={() => scrollTo("collection")} className="absolute bottom-8 right-5 flex items-center gap-3 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] md:right-10 lg:right-14">Explore the collection <span className="grid size-10 place-items-center rounded-full border border-[#f5f1e9]/50 text-base">↓</span></button>
      </section>

      <section className="mx-auto grid max-w-[1500px] grid-cols-1 border-x border-[#171512]/15 md:grid-cols-12">
        <div className="border-b border-[#171512]/15 p-5 md:col-span-3 md:border-b-0 md:border-r md:p-10 lg:p-14"><span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#8e7243]">Indasio / 01</span></div>
        <div className="border-b border-[#171512]/15 p-8 md:col-span-6 md:border-b-0 md:p-14"><p className="font-display text-[clamp(2rem,3.4vw,3.7rem)] leading-[1.02] tracking-[-0.04em]">Refinement lives in the details no one needs to announce.</p></div>
        <div className="flex items-end border-[#171512]/15 p-8 md:col-span-3 md:border-l md:p-10 lg:p-14"><p className="font-sans text-sm leading-6 text-[#574f46]">Impeccable tailoring. Exceptional cloth. A personal point of view.</p></div>
      </section>

      <section id="collection" className="bg-[#e5ddd0] px-5 py-18 md:px-10 md:py-28 lg:px-14">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-12 flex items-end justify-between border-b border-[#171512]/25 pb-5 md:mb-16"><div><p className="mb-3 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#8e7243]">The current edit</p><h2 className="font-display text-[clamp(3rem,6vw,6.5rem)] leading-none tracking-[-0.055em]">Collections</h2></div><span className="hidden font-sans text-[10px] uppercase tracking-[0.18em] text-[#574f46] md:block">Select a chapter</span></div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-5">
            {collections.map((item, i) => <button key={item.name} onClick={() => { setActiveCollection(i); scrollTo(item.target); }} className="group text-left"><div className="relative aspect-[.79] overflow-hidden bg-[#c9bbaa]"><ImageWithFallback src={item.image} alt={`${item.name} collection`} className={`h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0 ${activeCollection === i ? "grayscale-0" : ""}`} /><div className="absolute inset-0 bg-[#171512]/10" /><span className="absolute left-5 top-5 font-sans text-[10px] font-bold tracking-[0.2em] text-white">{item.number}</span><span className="absolute bottom-5 right-5 grid size-9 place-items-center rounded-full border border-white/60 text-lg text-white opacity-0 transition-opacity group-hover:opacity-100"><Arrow diagonal /></span></div><div className="flex items-start justify-between gap-4 pt-5"><div><h3 className="font-display text-2xl tracking-[-0.035em]">{item.name}</h3><p className="mt-2 font-sans text-[10px] uppercase tracking-[0.13em] text-[#574f46]">{item.category}</p></div>{activeCollection === i && <span className="mt-2 size-2 rounded-full bg-[#a7844a]" />}</div></button>)}
          </div>
        </div>
      </section>

      <section id="culture" className="bg-[#f5f1e9] px-5 py-18 md:px-10 md:py-28 lg:px-14"><div className="mx-auto max-w-[1500px]"><div className="grid gap-8 border-b border-[#171512]/25 pb-10 md:grid-cols-12 md:pb-14"><div className="md:col-span-4"><p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#8e7243]">Culture / artisan edit</p></div><div className="md:col-span-8"><h2 className="max-w-2xl font-display text-[clamp(3rem,5.7vw,6.4rem)] leading-[.87] tracking-[-.055em]">Colour, carried<br /><i className="font-light">with intention.</i></h2><p className="mt-6 max-w-md font-sans text-sm leading-6 text-[#574f46]">Handwoven in Kenya: beadwork, shell details, and small objects that bring character to the everyday.</p></div></div><div className="grid grid-cols-2 gap-x-4 gap-y-10 pt-10 md:grid-cols-5 md:gap-x-5 md:pt-14">{adornments.map((item) => <article key={item.name}><div className="aspect-[.8] overflow-hidden bg-[#d1c1ab]"><ImageWithFallback src={item.image} alt={item.name} className="h-full w-full object-cover transition duration-700 hover:scale-105" /></div><div className="mt-4 border-b border-[#171512]/20 pb-3"><h3 className="font-display text-xl leading-tight tracking-[-.03em]">{item.name}</h3><p className="mt-1 font-sans text-[9px] uppercase tracking-[.11em] text-[#574f46]">{item.detail}</p><p className="mt-3 font-sans text-[11px] font-bold tracking-[.1em] text-[#8e7243]">{item.price}</p><button onClick={() => addItem(item)} className="mt-4 w-full border border-[#171512]/35 py-3 font-sans text-[9px] font-bold uppercase tracking-[.16em] transition-colors hover:bg-[#171512] hover:text-[#f5f1e9]">Add to bag</button></div></article>)}</div><div className="mt-10 flex flex-col justify-between gap-4 border-t border-[#171512]/25 pt-5 sm:flex-row"><p className="font-sans text-[10px] font-semibold uppercase tracking-[.15em] text-[#574f46]">Culture edit · KSh 300 — KSh 6,500</p><a href="mailto:indasiofashion@gmail.com?subject=Indasio%20Culture" className="font-sans text-[10px] font-bold uppercase tracking-[.16em] underline decoration-[#b89a67] underline-offset-4">Enquire about the edit <Arrow /></a></div></div></section>
      <section id="african-styles" className="overflow-hidden bg-[#c44d32] px-5 py-18 text-[#f5f1e9] md:px-10 md:py-28 lg:px-14"><div className="mx-auto max-w-[1500px]"><div className="grid gap-10 md:grid-cols-12"><div className="md:col-span-4"><p className="font-sans text-[10px] font-bold uppercase tracking-[.2em] text-[#ffe6a8]">African styles / Lookbook 01</p><h2 className="mt-8 font-display text-[clamp(3.4rem,6.2vw,7rem)] leading-[.83] tracking-[-.06em]">More<br /><i className="font-light">than a</i><br />mood.</h2></div><div className="flex items-end md:col-span-8"><p className="max-w-md border-l border-[#f5f1e9]/55 pl-5 font-sans text-sm leading-6 text-[#f5f1e9]/85">A celebration of African dressing as it is lived now: poised, playful, storied, and completely contemporary.</p></div></div><div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">{styles.map((style, i) => <article key={style.name} className={i === 1 ? "md:mt-18" : ""}><div className="relative aspect-[.78] overflow-hidden bg-[#84341f]"><ImageWithFallback src={style.image} alt={`${style.name} African fashion look`} className="h-full w-full object-cover transition duration-700 hover:scale-105" /><span className="absolute left-5 top-5 font-sans text-[10px] font-bold tracking-[.2em]">{style.number}</span></div><h3 className="mt-4 font-display text-3xl tracking-[-.04em]">{style.name}</h3><p className="mt-1 font-sans text-[10px] uppercase tracking-[.14em] text-[#ffe6a8]">{style.note}</p></article>)}</div></div></section>

      <section id="art-house" className="bg-[#2e3426] px-5 py-18 text-[#f5f1e9] md:px-10 md:py-28 lg:px-14"><div className="mx-auto max-w-[1500px]"><div className="grid gap-8 border-b border-[#f5f1e9]/25 pb-12 md:grid-cols-12"><div className="md:col-span-4"><p className="font-sans text-[10px] font-bold uppercase tracking-[.2em] text-[#dbc284]">Indasio art house</p></div><div className="md:col-span-8"><h2 className="font-display text-[clamp(3rem,5.5vw,6.5rem)] leading-[.87] tracking-[-.06em]">Walls deserve<br /><i className="font-light">a point of view.</i></h2><p className="mt-6 max-w-lg font-sans text-sm leading-6 text-[#f5f1e9]/70">Handmade African wall art and display objects—chosen for the same certainty of line, texture, and feeling found in our collections.</p></div></div><div className="grid grid-cols-1 gap-10 pt-12 md:grid-cols-3 md:gap-5">{artworks.map((art, i) => <article key={art.title} className={i === 1 ? "md:mt-20" : ""}><div className="relative aspect-[.84] bg-[#47513a] p-4"><div className="h-full w-full overflow-hidden border border-[#f5f1e9]/35"><ImageWithFallback src={art.image} alt={`${art.title} artwork`} className="h-full w-full object-cover transition duration-700 hover:scale-105" /></div></div><div className="mt-5 border-b border-[#f5f1e9]/25 pb-4"><div className="flex justify-between gap-4"><div><h3 className="font-display text-2xl tracking-[-.035em]">{art.title}</h3><p className="mt-1 font-sans text-[10px] uppercase tracking-[.13em] text-[#f5f1e9]/55">{art.artist}</p><p className="mt-4 font-sans text-xs text-[#f5f1e9]/75">{art.medium}</p></div><p className="shrink-0 font-sans text-[10px] font-bold tracking-[.1em] text-[#dbc284]">{art.price}</p></div><button onClick={() => addItem({ name: art.title, price: art.price, image: art.image })} className="mt-5 w-full border border-[#f5f1e9]/45 py-3 font-sans text-[9px] font-bold uppercase tracking-[.16em] transition-colors hover:bg-[#f5f1e9] hover:text-[#171512]">Add to bag</button></div></article>)}</div><div className="mt-12 flex flex-col justify-between gap-4 border-t border-[#f5f1e9]/25 pt-5 sm:flex-row"><p className="font-sans text-[10px] font-semibold uppercase tracking-[.15em] text-[#f5f1e9]/60">Artisan wall art & decorative objects</p><a href="mailto:indasiofashion@gmail.com?subject=Indasio%20Art%20House" className="font-sans text-[10px] font-bold uppercase tracking-[.16em] text-[#dbc284] underline underline-offset-4">Request the art catalogue <Arrow /></a></div></div></section>

      <section className="bg-[#d9c7aa] px-5 py-18 md:px-10 md:py-28 lg:px-14"><div className="mx-auto max-w-[1500px]"><div className="grid gap-7 border-b border-[#171512]/20 pb-10 md:grid-cols-12"><p className="font-sans text-[10px] font-bold uppercase tracking-[.2em] text-[#766040] md:col-span-4">Indasio objects</p><div className="md:col-span-8"><h2 className="font-display text-[clamp(3rem,5.5vw,6rem)] leading-[.87] tracking-[-.055em]">Beautiful things,<br /><i className="font-light">made to live with.</i></h2><p className="mt-5 max-w-md font-sans text-sm leading-6 text-[#574f46]">From hand-finished practical pieces to furniture and decorative objects, every item celebrates thoughtful workmanship.</p></div></div><div className="mt-10 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{objects.map(([name, price, detail, image]) => <article key={name}><div className="aspect-square overflow-hidden bg-[#b9a98e]"><ImageWithFallback src={image} alt={name} className="h-full w-full object-cover transition duration-700 hover:scale-105" /></div><div className="border-b border-[#171512]/20 py-5"><p className="font-display text-2xl leading-tight tracking-[-.035em]">{name}</p><p className="mt-3 max-w-xs font-sans text-xs leading-5 text-[#574f46]">{detail}</p><div className="mt-5 flex items-center justify-between gap-4"><p className="font-sans text-[11px] font-bold tracking-[.1em] text-[#766040]">{price}</p><button onClick={() => addItem({ name, price, image })} className="font-sans text-[9px] font-bold uppercase tracking-[.14em] underline underline-offset-4">Add to bag</button></div></div></article>)}</div><div className="mt-8 flex justify-end"><a href="mailto:indasiofashion@gmail.com?subject=Indasio%20Objects" className="font-sans text-[10px] font-bold uppercase tracking-[.16em] underline decoration-[#8e7243] underline-offset-4">Enquire about objects <Arrow /></a></div></div></section>

      <section id="experience" className="bg-[#171512] text-[#f5f1e9]"><div className="mx-auto grid max-w-[1500px] grid-cols-1 md:grid-cols-2"><div className="min-h-[500px] bg-[#2b2721] md:min-h-[740px]"><img src="https://images.unsplash.com/photo-1713845784497-fe3d7ed176d8?w=1200&h=1400&fit=crop&auto=format" alt="African model wearing Indasio accessories" className="h-full w-full object-cover grayscale opacity-80" /></div><div className="flex flex-col justify-between p-8 md:p-14 lg:p-20"><div><p className="mb-8 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#dccaa9]">The Indasio way</p><h2 className="max-w-[540px] font-display text-[clamp(3rem,5vw,5.7rem)] leading-[.87] tracking-[-0.055em]">A private<br /><i className="font-light">conversation</i><br />with style.</h2></div><div className="mt-18 grid max-w-[540px] grid-cols-1 gap-8 border-t border-[#f5f1e9]/25 pt-8 sm:grid-cols-2"><p className="font-sans text-sm leading-6 text-[#f5f1e9]/75">Each appointment begins with listening. Your pace, your ambition, your exact idea of ease.</p><button onClick={() => setConsultationOpen(true)} className="flex items-start justify-between border-b border-[#f5f1e9] pb-2 font-sans text-[10px] font-bold uppercase tracking-[0.18em] transition-colors hover:border-[#b89a67] hover:text-[#dccaa9]">Arrange a fitting <Arrow /></button></div></div></div></section>

      <section className="bg-[#7a6240] px-5 py-18 text-[#f5f1e9] md:px-10 md:py-28 lg:px-14"><div className="mx-auto max-w-[1500px]"><p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#ead9ba]">Atelier services</p><div className="mt-10 grid grid-cols-1 gap-y-9 md:grid-cols-3 md:gap-x-12"><div><span className="font-display text-4xl">01</span><h3 className="mt-7 font-display text-3xl">Bespoke tailoring</h3><p className="mt-3 max-w-xs font-sans text-sm leading-6 text-[#f5f1e9]/75">Garments shaped around your proportions, presence and purpose.</p></div><div><span className="font-display text-4xl">02</span><h3 className="mt-7 font-display text-3xl">Private fittings</h3><p className="mt-3 max-w-xs font-sans text-sm leading-6 text-[#f5f1e9]/75">Unhurried appointments in our Westlands showroom, by design.</p></div><div><span className="font-display text-4xl">03</span><h3 className="mt-7 font-display text-3xl">Personal styling</h3><p className="mt-3 max-w-xs font-sans text-sm leading-6 text-[#f5f1e9]/75">A lucid, enduring edit for the work and life ahead of you.</p></div></div></div></section>

      <section id="visit" className="mx-auto grid max-w-[1500px] grid-cols-1 border-x border-[#171512]/15 md:grid-cols-12"><div className="bg-[#d1c1ab] p-8 md:col-span-5 md:p-14"><p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#766040]">Visit the showroom</p><h2 className="mt-7 max-w-sm font-display text-[clamp(3rem,4.5vw,5.2rem)] leading-[.9] tracking-[-0.05em]">Come in.<br /><i className="font-light">Stay awhile.</i></h2><button onClick={() => setConsultationOpen(true)} className="mt-12 bg-[#171512] px-6 py-4 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#f5f1e9] transition-colors hover:bg-[#7a6240]">Book your consultation</button></div><div className="flex flex-col justify-between bg-[#f5f1e9] p-8 md:col-span-7 md:p-14"><div className="grid grid-cols-1 gap-8 sm:grid-cols-2"><div><p className="mb-3 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#8e7243]">Address</p><p className="font-display text-2xl leading-tight">Kenrail Towers<br />Westlands, Nairobi<br />Kenya</p></div><div><p className="mb-3 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#8e7243]">Hours</p><p className="font-sans text-sm leading-6">Monday — Saturday<br />Regular business hours<br /><span className="text-[#574f46]">Sunday by appointment</span></p></div></div><div className="mt-20 grid grid-cols-1 gap-4 border-t border-[#171512]/20 pt-5 sm:grid-cols-2"><a href="tel:+254796923434" className="font-sans text-sm underline decoration-[#b89a67] underline-offset-4">+254 7 969 234 34</a><a href="mailto:indasiofashion@gmail.com" className="font-sans text-sm underline decoration-[#b89a67] underline-offset-4">indasiofashion@gmail.com</a></div></div></section>

      <footer className="bg-[#171512] px-5 py-10 text-[#f5f1e9] md:px-10 lg:px-14"><div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-10 md:flex-row md:items-end"><div><p className="font-display text-4xl tracking-[.08em]">INDASIO</p><p className="mt-3 font-sans text-[10px] uppercase tracking-[0.18em] text-[#f5f1e9]/55">Modern luxury · Nairobi</p></div><div className="flex gap-8 font-sans text-[10px] font-semibold uppercase tracking-[0.18em]"><a href="https://instagram.com/indasio_fashion" className="hover:text-[#dccaa9]">Instagram</a><a href="mailto:indasiofashion@gmail.com" className="hover:text-[#dccaa9]">Email</a><button onClick={() => scrollTo("top")} className="hover:text-[#dccaa9]">Back to top ↑</button></div></div></footer>

      {consultationOpen && <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-[#171512]/75 p-5"><div className="relative w-full max-w-xl bg-[#f5f1e9] p-7 text-[#171512] md:p-12"><button aria-label="Close" onClick={() => setConsultationOpen(false)} className="absolute right-6 top-5 text-xl">×</button><p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#8e7243]">Private appointment</p><h2 className="mt-5 font-display text-5xl leading-none tracking-[-.05em]">Begin with a conversation.</h2><p className="mt-5 max-w-md font-sans text-sm leading-6 text-[#574f46]">To arrange your fitting or digital consultation, contact our team directly.</p><div className="mt-10 grid gap-3 sm:grid-cols-2"><a href="tel:+254796923434" className="bg-[#171512] px-5 py-4 text-center font-sans text-[10px] font-bold uppercase tracking-[.14em] text-[#f5f1e9]">Call showroom</a><a href="mailto:indasiofashion@gmail.com?subject=Private%20Consultation" className="border border-[#171512] px-5 py-4 text-center font-sans text-[10px] font-bold uppercase tracking-[.14em]">Email Indasio</a></div></div></div>}
    </main>
  );
}

function formatPrice(value: number) {
  return `KSh ${new Intl.NumberFormat("en-KE").format(value)}`;
}

function priceValue(price: string) {
  return Number(price.replace(/[^0-9]/g, ""));
}

function Checkout() {
  const { items, count, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [payment, setPayment] = useState("M-Pesa");
  const [complete, setComplete] = useState(false);
  const subtotal = items.reduce((sum, item) => sum + priceValue(item.price) * item.quantity, 0);
  const delivery = subtotal > 0 ? 350 : 0;
  const total = subtotal + delivery;
  const methods = ["M-Pesa", "Bank transfer", "PayPal", "Stripe", "Visa", "Mastercard"];

  return <main className="min-h-screen bg-[#f5f1e9] text-[#171512]"><header className="border-b border-[#171512]/20 px-5 py-5 md:px-10 lg:px-14"><div className="mx-auto flex max-w-[1500px] items-center justify-between"><button onClick={() => navigate("/")} className="font-display text-[22px] tracking-[.09em]">INDASIO</button><button onClick={() => navigate("/")} className="font-sans text-[10px] font-bold uppercase tracking-[.18em] underline underline-offset-4">← Continue shopping</button></div></header><div className="mx-auto max-w-[1240px] px-5 py-12 md:px-10 md:py-18"><p className="font-sans text-[10px] font-bold uppercase tracking-[.2em] text-[#8e7243]">Secure checkout / {count} item{count === 1 ? "" : "s"}</p><h1 className="mt-4 font-display text-[clamp(3.5rem,6vw,6.5rem)] leading-[.86] tracking-[-.06em]">Your considered<br /><i className="font-light">selection.</i></h1>{complete ? <div className="mt-12 max-w-2xl border border-[#171512]/25 bg-[#e5ddd0] p-8 md:p-12"><p className="font-sans text-[10px] font-bold uppercase tracking-[.2em] text-[#8e7243]">Order received</p><h2 className="mt-5 font-display text-4xl leading-none">Thank you for choosing Indasio.</h2><p className="mt-5 max-w-lg font-sans text-sm leading-6 text-[#574f46]">Your order request has been recorded. Our team will contact you to confirm your {payment} payment instructions and delivery details.</p><button onClick={() => navigate("/")} className="mt-8 bg-[#171512] px-6 py-4 font-sans text-[10px] font-bold uppercase tracking-[.16em] text-[#f5f1e9]">Return to Indasio</button></div> : <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_.85fr]"><section>{items.length === 0 ? <div className="border-y border-[#171512]/20 py-10"><p className="font-display text-3xl">Your bag is waiting for its first piece.</p><button onClick={() => navigate("/")} className="mt-5 font-sans text-[10px] font-bold uppercase tracking-[.16em] underline underline-offset-4">Explore the collection</button></div> : <div className="border-t border-[#171512]/20">{items.map((item) => <article key={item.name} className="grid grid-cols-[82px_1fr_auto] gap-4 border-b border-[#171512]/20 py-5"><div className="aspect-square overflow-hidden bg-[#d1c1ab]">{item.image && <ImageWithFallback src={item.image} alt={item.name} className="h-full w-full object-cover" />}</div><div><h2 className="font-display text-xl leading-tight">{item.name}</h2><p className="mt-2 font-sans text-[10px] font-bold tracking-[.1em] text-[#8e7243]">{item.price}</p><div className="mt-4 flex items-center gap-3"><button aria-label={`Reduce ${item.name} quantity`} onClick={() => updateQuantity(item.name, -1)} className="grid size-6 place-items-center border border-[#171512]/30">−</button><span className="font-sans text-xs">{item.quantity}</span><button aria-label={`Increase ${item.name} quantity`} onClick={() => updateQuantity(item.name, 1)} className="grid size-6 place-items-center border border-[#171512]/30">+</button></div></div><p className="font-sans text-xs font-semibold">{formatPrice(priceValue(item.price) * item.quantity)}</p></article>)}</div>}</section><aside className="h-fit bg-[#171512] p-6 text-[#f5f1e9] md:p-8"><h2 className="font-display text-3xl">Payment</h2><p className="mt-2 font-sans text-xs leading-5 text-[#f5f1e9]/65">Select your preferred checkout method.</p><div className="mt-7 grid grid-cols-2 gap-2">{methods.map((method) => <button key={method} onClick={() => setPayment(method)} className={`border px-3 py-4 text-left font-sans text-[10px] font-bold uppercase tracking-[.11em] transition-colors ${payment === method ? "border-[#dccaa9] bg-[#dccaa9] text-[#171512]" : "border-[#f5f1e9]/30 text-[#f5f1e9] hover:border-[#f5f1e9]"}`}>{method}</button>)}</div><div className="mt-8 border-y border-[#f5f1e9]/25 py-5 font-sans text-xs"><div className="flex justify-between"><span className="text-[#f5f1e9]/65">Subtotal</span><span>{formatPrice(subtotal)}</span></div><div className="mt-3 flex justify-between"><span className="text-[#f5f1e9]/65">Nairobi delivery</span><span>{formatPrice(delivery)}</span></div><div className="mt-5 flex justify-between font-bold"><span>Total</span><span>{formatPrice(total)}</span></div></div><div className="mt-7"><label className="font-sans text-[10px] font-bold uppercase tracking-[.15em] text-[#dccaa9]">Delivery contact</label><input placeholder="Name, phone & delivery address" className="mt-3 w-full border border-[#f5f1e9]/30 bg-transparent px-4 py-4 font-sans text-xs text-[#f5f1e9] placeholder:text-[#f5f1e9]/45 focus:border-[#dccaa9] focus:outline-none" /></div><button disabled={items.length === 0} onClick={() => setComplete(true)} className="mt-5 w-full bg-[#dccaa9] py-4 font-sans text-[10px] font-bold uppercase tracking-[.16em] text-[#171512] transition-colors hover:bg-[#f5f1e9] disabled:cursor-not-allowed disabled:opacity-40">Place order via {payment}</button><p className="mt-4 font-sans text-[10px] leading-4 text-[#f5f1e9]/45">Payment details are confirmed securely with our team after your order request.</p></aside></div>}</div></main>;
}

const router = createBrowserRouter([
  { path: "/", Component: Home },
  { path: "/checkout", Component: Checkout },
]);

export default function App() {
  return <CartProvider><RouterProvider router={router} /></CartProvider>;
}
