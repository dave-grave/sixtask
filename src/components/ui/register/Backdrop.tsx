import React from "react";
import { motion } from "framer-motion";

export default function Backdrop({
  children,
  onClick,
}: {
  children: any;
  onClick: () => void;
}) {
  return (
    <motion.div
      className="flex items-center justify-center fixed inset-0 bg-opacity-100 backdrop-blur-sm z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
