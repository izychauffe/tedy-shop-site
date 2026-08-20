"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Produit } from "@/lib/produits";

export default function AdminDashboard() {
  const router = useRouter();
  const [produits, setProduits] = useState<Produit[]>([]);
  const [chargement, setChargement] = useState(true);
  const [verifieSession, setVerifieSession] = useState(false);

  useEffect(() => {
    const verifierSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/admin/login");
        return;
      }
      setVerifieSession(true);
    };
    verifierSession();
  }, [router]);

  useEffect(() => {
    if (!verifieSession) return;
    chargerProduits();
  }, [verifieSession]);

  const chargerProduits = async () => {
    setChargement(true);
    const { data, error } = await supabase
      .from("produits")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setProduits(data as Produit[]);
    setChargement(false);
  };

  const supprimerProduit = async (id: string) => {
    if (!confirm("Supprimer ce produit définitivement ?")) return;
    const { error } = await supabase.from("produits").delete().eq("id", id);
    if (!error) setProduits((prev) => prev.filter((p) => p.id !== id));
  };

  const deconnexion = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (!verifieSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121110]">
        <p className="font-mono text-sm text-[#a39d92]">Vérification...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121110] text-[#f1ede4]">
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-10 md:py-14">
        {/* Header */}
        <div className="flex justify-between items-start mb-12 pb-8 border-b border-white/10">
          <div>
            <h1 className="font-black text-xl uppercase tracking-tight">
              Tedy<span className="text-[#c7a877]">/</span>Shop
            </h1>
            <p className="font-mono text-[11px] uppercase tracking-widest text-[#a39d92] mt-1.5">
              Espace administration
            </p>
          </div>
          <button
            onClick={deconnexion}
            className="font-mono text-[11px] uppercase tracking-widest border border-white/20 rounded-full px-4 py-2 hover:bg-white/10 hover:border-white/40 transition-colors"
          >
            Déconnexion
          </button>
        </div>

        {/* Barre d'actions */}
        <div className="flex justify-between items-center mb-8">
          <p className="font-mono text-[11px] uppercase tracking-widest text-[#a39d92]">
            {produits.length} produit{produits.length > 1 ? "s" : ""} au catalogue
          </p>
          <Link
            href="/admin/nouveau"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest bg-[#f1ede4] text-[#121110] rounded-full px-5 py-2.5 hover:bg-white transition-colors shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
          >
            <span className="text-sm leading-none">+</span> Nouveau produit
          </Link>
        </div>

        {/* Liste */}
        {chargement ? (
          <p className="font-mono text-xs text-[#a39d92]">Chargement...</p>
        ) : produits.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-white/15 rounded-2xl">
            <p className="font-mono text-xs text-[#a39d92]">Aucun produit pour le moment.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {produits.map((produit) => {
              const accent = produit.categorie === "basket" ? "#6b82ff" : "#c7a877";
              return (
                <div
                  key={produit.id}
                  className="flex items-center gap-4 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 hover:bg-white/[0.05] transition-colors"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-white/5 flex items-center justify-center text-xl">
                    {produit.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={produit.image_url} alt={produit.nom} className="w-full h-full object-cover" />
                    ) : produit.categorie === "basket" ? (
                      "👟"
                    ) : (
                      "⌚"
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{produit.nom}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: accent }}
                      />
                      <p className="font-mono text-[11px] text-[#a39d92]">
                        {produit.categorie === "basket" ? "Basket" : "Montre"} · {produit.prix}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <Link
                      href={`/admin/modifier/${produit.id}`}
                      className="font-mono text-[11px] uppercase tracking-widest border border-white/20 rounded-full px-4 py-2 hover:bg-white/10 hover:border-white/40 transition-colors"
                    >
                      Modifier
                    </Link>
                    <button
                      onClick={() => supprimerProduit(produit.id)}
                      className="font-mono text-[11px] uppercase tracking-widest border border-red-400/30 text-red-400 rounded-full px-4 py-2 hover:bg-red-400/10 hover:border-red-400/50 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}