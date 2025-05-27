import { motion } from "motion/react";
import Header from "./Header";
import Footer from "./Footer";
import Tasks from "./Tasks";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Header />
      <Tasks />
      <Footer />
    </div>
  );
}
