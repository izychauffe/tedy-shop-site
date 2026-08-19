"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function Hero() {
  const { articles } = useCart();

  return (
    <section className="relative flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-6 md:px-12 py-6"
        style={{ color: "var(--color-text)" }}
      >
        <div>
          <div className="font-black text-lg tracking-tight">
            TEDY<span style={{ color: "var(--color-brass)" }}>/</span>SHOP
          </div>
          <div className="font-mono text-[10px] tracking-widest opacity-60 mt-0.5">
            Baskets & Montres
          </div>
        </div>
        <div className="hidden md:flex gap-8 text-xs uppercase tracking-widest font-semibold">
          <a href="#baskets">Baskets</a>
          <a href="#montres">Montres</a>
        </div>
        <Link
          href="/panier"
          className="font-mono text-xs border rounded-full px-3 py-1.5"
          style={{ borderColor: "var(--color-text)" }}
        >
          Panier ({articles.length})
        </Link>
      </motion.nav>

      {/* Baskets half */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="group relative flex-1 flex flex-col justify-end p-8 md:p-16 transition-all duration-500 hover:flex-[1.15]"
        style={{
          background:
            "color-mix(in srgb, var(--color-blue) 12%, var(--color-bg-alt))",
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-black text-6xl md:text-8xl uppercase leading-[0.9] mb-6"
          style={{ color: "var(--color-text)" }}
        >
          Baskets
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="max-w-xs text-sm opacity-70 mb-8"
          style={{ color: "var(--color-text)" }}
        >
          Des paires qui marquent. Sélection pointue, stock limité.
        </motion.p>
        <motion.a
          href="#baskets"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="w-fit font-mono text-xs uppercase tracking-widest rounded-full px-6 py-3.5"
          style={{ background: "var(--color-blue)", color: "var(--color-bg)" }}
        >
          Voir la collection →
        </motion.a>
      </motion.div>

      {/* Watches half */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="group relative flex-1 flex flex-col justify-end p-8 md:p-16 transition-all duration-500 hover:flex-[1.15]"
        style={{
          background:
            "color-mix(in srgb, var(--color-brass) 12%, var(--color-bg-alt))",
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-serif italic font-light text-6xl md:text-8xl leading-[0.9] mb-6"
          style={{ color: "var(--color-text)" }}
        >
          Montres
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="max-w-xs text-sm opacity-70 mb-8"
          style={{ color: "var(--color-text)" }}
        >
          Des pièces choisies pour durer. L&apos;élégance qui ne se démode pas.
        </motion.p>
        <motion.a
          href="#montres"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="w-fit font-mono text-xs uppercase tracking-widest rounded-full px-6 py-3.5"
          style={{ background: "var(--color-brass)", color: "var(--color-bg)" }}
        >
          Voir la collection →
        </motion.a>
      </motion.div>
    </section>
  );
}