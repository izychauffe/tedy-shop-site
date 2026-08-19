"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-context";

const NUMERO_WHATSAPP = "22963923777";

export default function PanierPage() {
  const { articles, retirerDuPanier } = useCart();

  const genererMessageWhatsApp = () => {
    let message = "Bonjour, je souhaite commander :\n\n";
    articles.forEach((a, i) => {
      const detail = a.taille !== "—" ? `Taille: ${a.taille}, Couleur: ${a.couleur}` : `Couleur: ${a.couleur}`;
      message += `${i + 1}. ${a.nom} — ${detail} — ${a.prix}\n`;
    });
    message += "\nMerci de me confirmer la disponibilité.";
    return encodeURIComponent(message);
  };

  const lienWhatsApp = `https://wa.me/${NUMERO_WHATSAPP}?text=${genererMessageWhatsApp()}`;

  return (
    <div className="min-h-screen px-6 md:px-12 py-24 md:py-28 max-w-3xl mx-auto">
      <Link
        href="/"
        className="font-mono text-xs uppercase tracking-widest opacity-60 hover:opacity-100 mb-12 inline-flex items-center gap-2"
      >
        ← Continuer mes achats
      </Link>

      <h1 className="font-black text-4xl md:text-5xl uppercase tracking-tight mt-8 mb-12">
        Mon panier
      </h1>

      {articles.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-mono text-sm opacity-50 mb-6">Ton panier est vide.</p>
          <Link
            href="/#baskets"
            className="font-mono text-xs uppercase tracking-widest border border-white/25 rounded-full px-5 py-2.5 hover:border-white/50"
          >
            Voir le catalogue
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 mb-12">
            <AnimatePresence>
              {articles.map((article) => {
                const accent =
                  article.categorie === "basket" ? "var(--color-blue)" : "var(--color-brass)";
                return (
                  <motion.div
                    key={article.cleUnique}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-4 bg-white/5 rounded-xl p-4 md:p-5"
                  >
                    <div
                      className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl shrink-0 overflow-hidden"
                      style={{ background: `${accent}20` }}
                    >
                      {article.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={article.imageUrl}
                          alt={article.nom}
                          className="w-full h-full object-cover"
                        />
                      ) : article.categorie === "basket" ? (
                        "👟"
                      ) : (
                        "⌚"
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{article.nom}</p>
                      <p className="font-mono text-xs opacity-50 mt-1">
                        {article.taille !== "—" ? `Taille ${article.taille} · ` : ""}
                        {article.couleur}
                      </p>
                    </div>
                    <p className="font-mono text-sm opacity-70 shrink-0">{article.prix}</p>
                    <button
                      onClick={() => retirerDuPanier(article.cleUnique)}
                      className="font-mono text-xs opacity-50 hover:opacity-100 hover:text-red-400 transition-colors shrink-0 px-2"
                      aria-label="Retirer du panier"
                    >
                      Retirer
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <motion.a
            href={lienWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-3 w-full font-mono text-sm uppercase tracking-widest text-[var(--color-dark)] bg-[#25D366] rounded-full px-8 py-5"
          >
            Commander via WhatsApp ({articles.length})
          </motion.a>
        </>
      )}
    </div>
  );
}