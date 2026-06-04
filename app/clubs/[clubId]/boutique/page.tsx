"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { fetchClubProducts, type ShopProduct } from "@/lib/api";
import { useLocale } from "@/lib/locale-context";
import { ShoppingBag, Truck, RotateCcw, ShieldCheck, ChevronLeft, Star } from "lucide-react";

const clubData: Record<string, {
  nom: string;
  acronyme: string;
  logo: string;
  hero: string;
  color: string;
  colorDark: string;
}> = {
  jag: {
    nom: "Jaguar Académie Guinée",
    acronyme: "JAG",
    logo: "/images/jag-logo.png",
    hero: "/images/jag-hero.png",
    color: "#CC0000",
    colorDark: "#990000",
  },
  atletico: {
    nom: "Club Atlético de Colèah",
    acronyme: "Atlético",
    logo: "/images/atletico-logo.png",
    hero: "/images/atletico-hero.png",
    color: "#F5B800",
    colorDark: "#C9950A",
  },
};

type CategoryFilter = "all" | "jerseys" | "accessories" | "bags";

export default function BoutiquePage({ params }: { params: Promise<{ clubId: string }> }) {
  const { clubId } = use(params);
  const { locale, t } = useLocale();
  const club = clubData[clubId] ?? clubData.jag;
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");

  useEffect(() => {
    let active = true;

    fetchClubProducts(clubId)
      .then((items) => {
        if (active) {
          setProducts(items);
        }
      })
      .catch(() => {
        if (active) {
          setProducts([]);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [clubId]);

  const filterLabels: Record<CategoryFilter, string> = {
    all: t.shop.allProducts,
    jerseys: t.shop.jerseys,
    accessories: t.shop.accessories,
    bags: t.shop.bags,
  };

  const filtered = activeCategory === "all" ? products : products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero banner */}
      <div className="relative overflow-hidden h-40 sm:h-52" style={{ backgroundColor: club.colorDark }}>
        <Image src={club.hero} alt={club.nom} fill className="object-cover opacity-15" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 h-full flex flex-col justify-end pb-6">
          <Link
            href={`/clubs/${clubId}`}
            className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs mb-3 transition-colors w-fit"
          >
            <ChevronLeft size={14} />
            {club.acronyme}
          </Link>
          <div className="flex items-center gap-3">
            <Image src={club.logo} alt={club.nom} width={44} height={44} className="rounded-full border-2 border-white/30 object-cover" />
            <div>
              <p className="text-white/60 text-xs uppercase tracking-widest font-semibold">{t.shop.title}</p>
              <h1 className="text-white font-black text-xl sm:text-2xl leading-tight">{club.nom}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap gap-4 sm:gap-8 items-center justify-center sm:justify-start text-xs text-muted-foreground font-medium">
          <span className="flex items-center gap-1.5"><Truck size={13} />{t.shop.freeShipping}</span>
          <span className="flex items-center gap-1.5"><RotateCcw size={13} />{locale === "fr" ? "Retours sous 30 jours" : "30-day returns"}</span>
          <span className="flex items-center gap-1.5"><ShieldCheck size={13} />{locale === "fr" ? "Paiement sécurisé" : "Secure payment"}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(Object.keys(filterLabels) as CategoryFilter[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-sm text-sm font-semibold border transition-colors ${
                activeCategory === cat
                  ? "text-white border-transparent"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
              }`}
              style={activeCategory === cat ? { backgroundColor: club.color, borderColor: club.color } : {}}
            >
              {filterLabels[cat]}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {loading && filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">Chargement...</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="group bg-card border border-border rounded-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative aspect-square bg-muted overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name[locale]}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.isNew && (
                    <span
                      className="text-white text-[10px] font-black px-1.5 py-0.5 rounded-sm"
                      style={{ backgroundColor: club.color }}
                    >
                      {t.shop.newBadge}
                    </span>
                  )}
                  {product.isSale && (
                    <span className="bg-foreground text-background text-[10px] font-black px-1.5 py-0.5 rounded-sm">
                      {t.shop.saleLabel}
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-xs text-muted-foreground font-medium mb-0.5 capitalize">{t.shop[product.category]}</p>
                <h3 className="text-sm font-bold text-foreground leading-tight mb-1.5 line-clamp-2">
                  {product.name[locale]}
                </h3>
                {/* Stars */}
                <div className="flex items-center gap-1 mb-2.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={10}
                      className={i < product.rating ? "fill-amber-400 text-amber-400" : "text-border"}
                    />
                  ))}
                  <span className="text-[10px] text-muted-foreground ml-0.5">({product.reviews})</span>
                </div>
                <div className="flex items-end justify-between gap-2">
                  <div>
                    <p className="font-black text-foreground text-sm">{product.price}</p>
                    {product.oldPrice && (
                      <p className="text-muted-foreground text-xs line-through">{product.oldPrice}</p>
                    )}
                  </div>
                  <button
                    className="flex items-center gap-1 text-white text-xs font-bold px-2.5 py-1.5 rounded-sm transition-opacity hover:opacity-85 shrink-0"
                    style={{ backgroundColor: club.color }}
                  >
                    <ShoppingBag size={11} />
                    <span className="hidden sm:inline">{t.shop.addToCart}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-6 text-center text-muted-foreground text-sm mt-10">
        <p className="font-semibold text-foreground mb-1">Guinée Football Clubs</p>
        <p>Jaguar Académie Guinée &amp; Club Atlético de Colèah &mdash; {t.footer.city}</p>
        <p className="mt-1 text-xs opacity-50">&copy; {new Date().getFullYear()} {t.footer.rights}</p>
      </footer>
    </div>
  );
}
