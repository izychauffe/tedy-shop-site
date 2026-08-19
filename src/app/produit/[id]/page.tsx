"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Produit } from "@/lib/produits";
import { useCart } from "@/lib/cart-context";

export default function ProduitPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { ajouterAuPanier } = useCart();

  const [produit, setProduit] = useState<Produit | null>(null);
  const [chargement, setChargement] = useState(true);
  const [tailleChoisie, setTailleChoisie] = useState<string | null>(null);
  const [couleurChoisie, setCouleurChoisie] = useState<string | null>(null);

  useEffect(() => {
    const chargerProduit = async () => {
      const { data, error } = await supabase
        .from("produits")
        .select("*")
        .eq("id", id)
        .single();
      if (!error && data) setProduit(data as Produit);
      setChargement(false);
    };
    chargerProduit();
  }, [id]);

  if (chargement) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-sm opacity-50">Chargement...</p>
      </div>
    );
  }

  if (!produit) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-mono text-sm opacity-60">Produit introuvable.</p>
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-widest border border-white/25 rounded-full px-5 py-2.5 hover:border-white/50"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  const accent =
    produit.categorie === "basket" ? "var(--color-blue)" : "var(--color-brass)";

  const afficherTaille = produit.categorie === "basket";
  const peutAjouter = afficherTaille
    ? !!tailleChoisie && !!couleurChoisie
    : !!couleurChoisie;

  const handleAjouter = () => {
    if (!peutAjouter) return;
    ajouterAuPanier({
      produitId: produit.id,
      nom: produit.nom,
      prix: produit.prix,
      categorie: produit.categorie,
      taille: afficherTaille ? tailleChoisie! : "—",
      couleur: couleurChoisie!,
      imageUrl: produit.image_url,
    });
    router.push("/panier");
  };

  return (
    <div className="min-h-screen px-6 md:px-12 py-24 md:py-28">
      <Link
        href={produit.categorie === "basket" ? "/#baskets" : "/#montres"}
        className="font-mono text-xs uppercase tracking-widest opacity-60 hover:opacity-100 mb-12 inline-flex items-center gap-2"
      >
        ← Retour au catalogue
      </Link>

      <div className="grid md:grid-cols-2 gap-12 md:gap-20 mt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="aspect-square flex items-center justify-center text-[10rem] rounded-2xl overflow-hidden"
          style={{ background: `${accent}14` }}
        >
          {produit.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={produit.image_url} alt={produit.nom} className="w-full h-full object-cover" />
          ) : produit.categorie === "basket" ? (
            "👟"
          ) : (
            "⌚"
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          <span
            className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{ background: `${accent}30`, color: accent }}
          >
            {produit.categorie === "basket" ? "Basket" : "Montre"}
          </span>

          <h1
            className={`text-4xl md:text-5xl mt-5 mb-4 ${
              produit.categorie === "montre"
                ? "font-serif italic font-light"
                : "font-black uppercase"
            }`}
          >
            {produit.nom}
          </h1>

          <p className="font-mono text-lg opacity-70 mb-8">{produit.prix}</p>

          <p className="text-sm opacity-70 leading-relaxed mb-10 max-w-md">
            {produit.description}
          </p>

          {afficherTaille && (
            <div className="mb-8">
              <p className="font-mono text-xs uppercase tracking-widest opacity-50 mb-3">
                Taille
              </p>
              <div className="flex flex-wrap gap-2">
                {produit.tailles.map((taille) => (
                  <button
                    key={taille}
                    onClick={() => setTailleChoisie(taille)}
                    className={`font-mono text-xs px-4 py-2 rounded-full border transition-colors ${
                      tailleChoisie === taille
                        ? "bg-[var(--color-light)] text-[var(--color-dark)] border-[var(--color-light)]"
                        : "border-white/25 hover:border-white/50"
                    }`}
                  >
                    {taille}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-10">
            <p className="font-mono text-xs uppercase tracking-widest opacity-50 mb-3">
              Couleur
            </p>
            <div className="flex flex-wrap gap-2">
              {produit.couleurs.map((couleur) => (
                <button
                  key={couleur}
                  onClick={() => setCouleurChoisie(couleur)}
                  className={`font-mono text-xs px-4 py-2 rounded-full border transition-colors ${
                    couleurChoisie === couleur
                      ? "bg-[var(--color-light)] text-[var(--color-dark)] border-[var(--color-light)]"
                      : "border-white/25 hover:border-white/50"
                  }`}
                >
                  {couleur}
                </button>
              ))}
            </div>
          </div>

          <motion.button
            onClick={handleAjouter}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={!peutAjouter}
            className="w-full md:w-auto font-mono text-xs uppercase tracking-widest text-[var(--color-dark)] rounded-full px-8 py-4 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            style={{ background: accent }}
          >
            Ajouter au panier
          </motion.button>

          {!peutAjouter && (
            <p className="font-mono text-[11px] opacity-40 mt-3">
              {afficherTaille
                ? "Choisis une taille et une couleur pour continuer"
                : "Choisis une couleur pour continuer"}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}