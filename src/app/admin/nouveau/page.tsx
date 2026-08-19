"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Categorie } from "@/lib/produits";

export default function NouveauProduitPage() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [prix, setPrix] = useState("");
  const [categorie, setCategorie] = useState<Categorie>("basket");
  const [description, setDescription] = useState("");
  const [tailles, setTailles] = useState("");
  const [couleurs, setCouleurs] = useState("");
  const [fichierImage, setFichierImage] = useState<File | null>(null);
  const [apercu, setApercu] = useState<string | null>(null);
  const [enregistrement, setEnregistrement] = useState(false);
  const [erreur, setErreur] = useState("");

  const handleFichier = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fichier = e.target.files?.[0];
    if (!fichier) return;
    setFichierImage(fichier);
    setApercu(URL.createObjectURL(fichier));
  };

  const handleEnregistrer = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur("");
    setEnregistrement(true);

    let imageUrl: string | null = null;

    if (fichierImage) {
      const nomFichier = `${Date.now()}-${fichierImage.name}`;
      const { error: erreurUpload } = await supabase.storage
        .from("produits")
        .upload(nomFichier, fichierImage);

      if (erreurUpload) {
        setErreur("Erreur lors de l'envoi de l'image : " + erreurUpload.message);
        setEnregistrement(false);
        return;
      }

      const { data: urlData } = supabase.storage.from("produits").getPublicUrl(nomFichier);
      imageUrl = urlData.publicUrl;
    }

    const { error } = await supabase.from("produits").insert({
      nom,
      prix,
      categorie,
      description,
      tailles: tailles.split(",").map((t) => t.trim()).filter(Boolean),
      couleurs: couleurs.split(",").map((c) => c.trim()).filter(Boolean),
      image_url: imageUrl,
    });

    setEnregistrement(false);

    if (error) {
      setErreur("Erreur lors de l'enregistrement : " + error.message);
      return;
    }

    router.push("/admin");
  };

  return (
    <div className="min-h-screen px-6 md:px-12 py-12 max-w-xl mx-auto">
      <Link
        href="/admin"
        className="font-mono text-xs uppercase tracking-widest opacity-60 hover:opacity-100 mb-8 inline-flex items-center gap-2"
      >
        ← Retour au tableau de bord
      </Link>

      <h1 className="font-black text-2xl uppercase tracking-tight mt-6 mb-8">
        Nouveau produit
      </h1>

      <form onSubmit={handleEnregistrer} className="flex flex-col gap-5">
        <div>
          <label className="font-mono text-xs uppercase tracking-widest opacity-60 block mb-2">
            Catégorie
          </label>
          <div className="flex gap-2">
            {(["basket", "montre"] as Categorie[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategorie(cat)}
                className={`font-mono text-xs uppercase tracking-wide px-5 py-2.5 rounded-full border ${
                  categorie === cat
                    ? "bg-[var(--color-light)] text-[var(--color-dark)] border-[var(--color-light)]"
                    : "border-white/25"
                }`}
              >
                {cat === "basket" ? "Basket" : "Montre"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="font-mono text-xs uppercase tracking-widest opacity-60 block mb-2">
            Photo du produit
          </label>
          {apercu && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={apercu}
              alt="Aperçu"
              className="w-32 h-32 object-cover rounded-lg mb-3"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFichier}
            className="w-full font-mono text-xs file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:bg-white/10 file:text-[var(--color-light)] file:font-mono file:text-xs file:uppercase file:tracking-widest"
          />
        </div>

        <div>
          <label className="font-mono text-xs uppercase tracking-widest opacity-60 block mb-2">
            Nom du produit
          </label>
          <input
            required
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-sm outline-none focus:border-white/40"
          />
        </div>

        <div>
          <label className="font-mono text-xs uppercase tracking-widest opacity-60 block mb-2">
            Prix (ex: 45000 FCFA)
          </label>
          <input
            required
            value={prix}
            onChange={(e) => setPrix(e.target.value)}
            className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-sm outline-none focus:border-white/40"
          />
        </div>

        <div>
          <label className="font-mono text-xs uppercase tracking-widest opacity-60 block mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-sm outline-none focus:border-white/40 resize-none"
          />
        </div>

        <div>
          <label className="font-mono text-xs uppercase tracking-widest opacity-60 block mb-2">
            Tailles (séparées par des virgules, ex: 40, 41, 42)
          </label>
          <input
            value={tailles}
            onChange={(e) => setTailles(e.target.value)}
            className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-sm outline-none focus:border-white/40"
          />
        </div>

        <div>
          <label className="font-mono text-xs uppercase tracking-widest opacity-60 block mb-2">
            Couleurs (séparées par des virgules, ex: Noir, Blanc)
          </label>
          <input
            value={couleurs}
            onChange={(e) => setCouleurs(e.target.value)}
            className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-sm outline-none focus:border-white/40"
          />
        </div>

        {erreur && <p className="font-mono text-xs text-red-400">{erreur}</p>}

        <button
          type="submit"
          disabled={enregistrement}
          className="font-mono text-xs uppercase tracking-widest text-[var(--color-dark)] bg-[var(--color-light)] rounded-full px-6 py-3.5 disabled:opacity-50 mt-2"
        >
          {enregistrement ? "Enregistrement..." : "Créer le produit"}
        </button>
      </form>
    </div>
  );
}