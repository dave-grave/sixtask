import React from "react";
import * as motion from "motion/react-client";

const box = {
  width: 200,
  height: 50,
  backgroundColor: "#9911ff",
  borderRadius: 5,
};

export default function TaskElement({ name }: { name: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      style={box}
    >
      <input type="text" placeholder={name} />
    </motion.button>
  );
}
