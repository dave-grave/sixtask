"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Header from "./Header";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Content from "./Content";

export type NavPageType =
  | "tasks"
  | "timer"
  | "spotify"
  | "dashboard"
  | "settings";

export default function Home() {
  // extend current page and navigation handler as props for Content to read and NavButtons to edit
  const [currentPage, setCurrentPage] = useState<NavPageType>("tasks");
  const handleNavigation = (page: NavPageType) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col gap-6 min-h-screen items-center justify-center w-full">
      <Header />
      <div className="flex flex-col justify-center w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col gap-12 w-full"
        >
          <Content currentPage={currentPage} />
          <Navbar
            currentPage={currentPage}
            handleNavigation={handleNavigation}
          />
        </motion.div>
      </div>
      <Footer handleNavigation={handleNavigation} />
    </div>
  );
}
