import { motion } from "motion/react";
import Header from "./Header";
import Tasks from "./Tasks";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <Header />
      <div className="flex-1">
        <Tasks />
      </div>
      <Navbar />
      <Footer />
    </div>
  );
}
