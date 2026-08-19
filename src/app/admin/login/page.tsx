"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  const handleConnexion = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur("");
    setChargement(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: motDePasse,
    });

    setChargement(false);

    if (error) {
      setErreur("Email ou mot de passe incorrect.");
      return;
    }

    router.push("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form
        onSubmit={handleConnexion}
        className="w-full max-w-sm bg-white/5 rounded-2xl p-8"
      >
        <h1 className="font-black text-2xl uppercase tracking-tight mb-1">
          Tedy<span className="text-[var(--color-brass)]">/</span>Shop
        </h1>
        <p className="font-mono text-xs opacity-50 mb-8">Espace administration</p>

        <label className="font-mono text-xs uppercase tracking-widest opacity-60 block mb-2">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 mb-5 text-sm outline-none focus:border-white/40"
        />

        <label className="font-mono text-xs uppercase tracking-widest opacity-60 block mb-2">
          Mot de passe
        </label>
        <input
          type="password"
          required
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 mb-6 text-sm outline-none focus:border-white/40"
        />

        {erreur && (
          <p className="font-mono text-xs text-red-400 mb-4">{erreur}</p>
        )}

        <button
          type="submit"
          disabled={chargement}
          className="w-full font-mono text-xs uppercase tracking-widest text-[var(--color-dark)] bg-[var(--color-light)] rounded-full px-6 py-3.5 disabled:opacity-50"
        >
          {chargement ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}