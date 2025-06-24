import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function Home({ theme }) {
  const vantaRef = useRef(null);
  useEffect(() => {
    let vantaEffect;
    if (window.VANTA && window.VANTA.NET && vantaRef.current) {
      vantaEffect = window.VANTA.NET({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0x00FFB3,
        backgroundColor: 0x030637,
        points: 12.0,
        maxDistance: 22.0,
        spacing: 18.0,
        showDots: true,
        showLines: true,
        highlightColor: 0xFFB347,
      });
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  return (
    <motion.div
      className="pt-32 px-8 min-h-screen relative overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Live animated background */}
      <div ref={vantaRef} className="fixed inset-0 z-0" style={{ pointerEvents: "none" }} />
      {/* Hero Section */}
      <section className="max-w-3xl mx-auto text-center relative z-10">
        <motion.h1
          className="text-6xl font-orbitron font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-[#00FFB3] to-[#FFB347] drop-shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
        >
          <span className="block tracking-widest">Space Station Inventory Detection</span>
        </motion.h1>
        <motion.p
          className="text-2xl mb-8 font-poppins text-[#bdb7e3] font-medium drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Real-time detection of fire extinguishers, toolboxes, and oxygen tanks using YOLOv8 ensemble models.
        </motion.p>
        {/* CTA Button: scroll/jump to Detect tab */}
        <motion.button
          className="mt-6 px-10 py-4 rounded-full font-bold text-xl shadow-xl bg-gradient-to-r from-[#1B1A55] to-[#3C0753] text-white hover:scale-105 transition border-2 border-[#2E236C]/60"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.href = "/detect"}
        >
          Try Detection
        </motion.button>
      </section>
      {/* Section Cards */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        <motion.div
          className="rounded-2xl p-6 bg-[#18182a]/80 backdrop-blur-md border border-[#3C0753]/40 shadow-xl text-white"
          whileHover={{ scale: 1.04 }}
        >
          <h2 className="font-bold text-xl mb-2">About</h2>
          <p className="text-[#bdb7e3] text-sm">This project leverages advanced YOLOv8 models to automate safety equipment detection in real-world environments, ensuring compliance and rapid inventory checks.</p>
        </motion.div>
        <motion.div
          className="rounded-2xl p-6 bg-[#18182a]/80 backdrop-blur-md border border-[#3C0753]/40 shadow-xl text-white"
          whileHover={{ scale: 1.04 }}
        >
          <h2 className="font-bold text-xl mb-2">Dataset</h2>
          <p className="text-[#bdb7e3] text-sm">Curated and annotated dataset with images of fire extinguishers, toolboxes, and oxygen tanks. One-class-per-model approach for robust detection.</p>
        </motion.div>
        <motion.div
          className="rounded-2xl p-6 bg-[#18182a]/80 backdrop-blur-md border border-[#3C0753]/40 shadow-xl text-white"
          whileHover={{ scale: 1.04 }}
        >
          <h2 className="font-bold text-xl mb-2">Model Accuracy</h2>
          <p className="text-[#bdb7e3] text-sm">Achieves high mAP@50 for all classes. Ensemble detection ensures reliability and minimizes false negatives in safety-critical scenarios.</p>
        </motion.div>
      </div>
      {/* Sample Detection Video Placeholder */}
      <div className="mt-16 flex justify-center relative z-10">
        {/* Replace the src below with your YouTube embed link */}
        <div className="w-full max-w-xl aspect-video rounded-xl overflow-hidden shadow-lg border-4 border-[#3C0753]/30">
          {/* PASTE_YOUR_YOUTUBE_EMBED_LINK_HERE */}
          <iframe
            src=""
            title="Sample Detection Video"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
    </motion.div>
  );
} 