'use client';

import { motion, AnimatePresence } from 'framer-motion';

export function Toast({ message }: { message: string | null }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          id="toast"
          role="status"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
