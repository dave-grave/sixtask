"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Header from "./Header";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Content from "./Content";

export type NavPageType = "tasks" | "timer" | "spotify" | "dashboard";

export default function Home() {
  // extend current page and navigation handler as props for Content to read and NavButtons to edit
  const [currentPage, setCurrentPage] = useState<NavPageType>("tasks");
  const handleNavigation = (page: NavPageType) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <Header />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Content currentPage={currentPage} />
        <Navbar currentPage={currentPage} handleNavigation={handleNavigation} />
      </motion.div>
      <Footer />
    </div>
  );
}
