"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import AddNameSheet from "./AddNameSheet";

export default function AddNameFab({
  onAdded,
}: {
  onAdded?: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <motion.button
        aria-label="Add a name"
        onClick={() => setOpen(true)}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        className="fixed right-5 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-peach-300 via-peach-500 to-lavender-500 text-white shadow-pop"
        style={{ bottom: "calc(var(--safe-bottom) + 5.5rem)" }}
      >
        <Plus size={30} strokeWidth={3} />
      </motion.button>
      <AddNameSheet
        open={open}
        onClose={() => setOpen(false)}
        onAdded={() => {
          setOpen(false);
          onAdded?.();
        }}
      />
    </>
  );
}
