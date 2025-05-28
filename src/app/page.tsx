"use client";

import { motion } from "motion/react";
import Header from "./Header";
import Content from "./Content";
import Timer from "./Timer";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <Header />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Content />
        <Navbar />
      </motion.div>
      <Footer />
    </div>
  );
}
