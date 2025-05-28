import { motion, AnimatePresence } from "framer-motion";
import Backdrop from "./Backdrop";
import React from "react";

type ModalProps = {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ show, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <Backdrop onClick={onClose}>
          <motion.div
            className="fixed z-50 inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div
              className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 max-w-sm w-full sm:max-w-sm md:max-w-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                onClick={onClose}
                aria-label="Close"
              >
                &times;
              </button>
              {children}
            </div>
          </motion.div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}
