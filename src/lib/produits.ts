export type Categorie = "basket" | "montre";

export interface Produit {
  id: string;
  nom: string;
  prix: string;
  categorie: Categorie;
  description: string;
  tailles: string[];
  couleurs: string[];
  image_url: string | null;
}