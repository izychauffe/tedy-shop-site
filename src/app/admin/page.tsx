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
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-sm opacity-50">Vérification...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 md:px-12 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="font-black text-2xl uppercase tracking-tight">
            Tedy<span className="text-[var(--color-brass)]">/</span>Shop
          </h1>
          <p className="font-mono text-xs opacity-50 mt-1">Espace administration</p>
        </div>
        <button
          onClick={deconnexion}
          className="font-mono text-xs uppercase tracking-widest opacity-60 hover:opacity-100 border border-white/20 rounded-full px-4 py-2"
        >
          Déconnexion
        </button>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h2 className="font-mono text-xs uppercase tracking-widest opacity-50">
          {produits.length} produit{produits.length > 1 ? "s" : ""}
        </h2>
        <Link
          href="/admin/nouveau"
          className="font-mono text-xs uppercase tracking-widest text-[var(--color-dark)] bg-[var(--color-light)] rounded-full px-5 py-2.5"
        >
          + Nouveau produit
        </Link>
      </div>

      {chargement ? (
        <p className="font-mono text-xs opacity-50">Chargement...</p>
      ) : produits.length === 0 ? (
        <p className="font-mono text-xs opacity-50">Aucun produit pour le moment.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {produits.map((produit) => (
            <div
              key={produit.id}
              className="flex items-center gap-4 bg-white/5 rounded-xl p-4"
            >
              <div className="w-14 h-14 rounded-lg bg-white/5 flex items-center justify-center text-2xl shrink-0 overflow-hidden">
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
                <p className="font-mono text-xs opacity-50 mt-0.5">
                  {produit.categorie === "basket" ? "Basket" : "Montre"} · {produit.prix}
                </p>
              </div>
              <Link
                href={`/admin/modifier/${produit.id}`}
                className="font-mono text-xs uppercase tracking-widest opacity-60 hover:opacity-100 px-3 py-2"
              >
                Modifier
              </Link>
              <button
                onClick={() => supprimerProduit(produit.id)}
                className="font-mono text-xs uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-red-400 px-3 py-2"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}