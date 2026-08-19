"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Produit, Categorie } from "@/lib/produits";

type Filtre = "tout" | Categorie;

export default function Catalogue() {
  const [filtre, setFiltre] = useState<Filtre>("tout");
  const [produits, setProduits] = useState<Produit[]>([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const chargerProduits = async () => {
      const { data, error } = await supabase
        .from("produits")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setProduits(data as Produit[]);
      setChargement(false);
    };
    chargerProduits();
  }, []);

  useEffect(() => {
    const appliquerFiltreDepuisHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "baskets") setFiltre("basket");
      else if (hash === "montres") setFiltre("montre");
    };
    appliquerFiltreDepuisHash();
    window.addEventListener("hashchange", appliquerFiltreDepuisHash);
    return () => window.removeEventListener("hashchange", appliquerFiltreDepuisHash);
  }, []);

  const produitsFiltres = produits.filter((p) =>
    filtre === "tout" ? true : p.categorie === filtre
  );

  return (
    <section
      id="baskets"
      className="relative px-6 md:px-12 py-24 md:py-32 scroll-mt-24"
    >
      <div id="montres" className="absolute -top-24" />

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="font-mono text-xs uppercase tracking-widest opacity-50 mb-10 flex items-center gap-3"
      >
        <span className="w-6 h-px bg-current" />
        Catalogue
      </motion.p>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-14">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-black text-4xl md:text-6xl uppercase tracking-tight"
        >
          La sélection
        </motion.h2>

        <div className="flex gap-2">
          {(["tout", "basket", "montre"] as Filtre[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltre(cat)}
              className={`font-mono text-xs uppercase tracking-wide px-5 py-2 rounded-full border transition-colors ${
                filtre === cat
                  ? "bg-[var(--color-light)] text-[var(--color-dark)] border-[var(--color-light)]"
                  : "border-white/25 hover:border-white/50"
              }`}
            >
              {cat === "tout" ? "Tout" : cat === "basket" ? "Baskets" : "Montres"}
            </button>
          ))}
        </div>
      </div>

      {chargement ? (
        <p className="font-mono text-xs opacity-50">Chargement...</p>
      ) : produitsFiltres.length === 0 ? (
        <p className="font-mono text-xs opacity-50">Aucun produit pour le moment.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10">
          <AnimatePresence mode="popLayout">
            {produitsFiltres.map((produit) => (
              <motion.div
                key={produit.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href={`/produit/${produit.id}`}
                  className="group block bg-[var(--color-dark)] p-6 md:p-8 min-h-[280px] md:min-h-[340px] flex flex-col hover:bg-white/5 transition-colors"
                >
                  <span
                    className={`font-mono text-[10px] uppercase tracking-widest w-fit px-2.5 py-1 rounded-full mb-6 ${
                      produit.categorie === "basket"
                        ? "bg-[var(--color-blue)]/20 text-[#7f95ff]"
                        : "bg-[var(--color-brass)]/20 text-[var(--color-brass)]"
                    }`}
                  >
                    {produit.categorie === "basket" ? "Basket" : "Montre"}
                  </span>
                  <div className="flex-1 flex items-center justify-center text-5xl opacity-80 overflow-hidden rounded-lg">
                    {produit.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={produit.image_url}
                        alt={produit.nom}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : produit.categorie === "basket" ? (
                      "👟"
                    ) : (
                      "⌚"
                    )}
                  </div>
                  <p
                    className={`text-sm font-semibold mb-1 mt-4 ${
                      produit.categorie === "montre" ? "font-serif italic font-normal" : ""
                    }`}
                  >
                    {produit.nom}
                  </p>
                  <p className="font-mono text-xs opacity-50">{produit.prix}</p>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}