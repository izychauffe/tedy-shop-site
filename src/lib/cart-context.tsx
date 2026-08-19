"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface ArticlePanier {
  cleUnique: string;
  produitId: string;
  nom: string;
  prix: string;
  categorie: "basket" | "montre";
  taille: string;
  couleur: string;
  imageUrl: string | null;
}

interface CartContextType {
  articles: ArticlePanier[];
  ajouterAuPanier: (article: Omit<ArticlePanier, "cleUnique">) => void;
  retirerDuPanier: (cleUnique: string) => void;
  viderPanier: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<ArticlePanier[]>([]);

  const ajouterAuPanier = (article: Omit<ArticlePanier, "cleUnique">) => {
    const cleUnique = `${article.produitId}-${article.taille}-${article.couleur}-${Date.now()}`;
    setArticles((prev) => [...prev, { ...article, cleUnique }]);
  };

  const retirerDuPanier = (cleUnique: string) => {
    setArticles((prev) => prev.filter((a) => a.cleUnique !== cleUnique));
  };

  const viderPanier = () => setArticles([]);

  return (
    <CartContext.Provider value={{ articles, ajouterAuPanier, retirerDuPanier, viderPanier }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart doit être utilisé dans un CartProvider");
  return context;
}