'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import Link from 'next/link';

export const MotionButton = React.forwardRef<
  HTMLButtonElement,
  HTMLMotionProps<'button'>
>(({ whileTap = { scale: 0.96 }, ...props }, ref) => {
  return <motion.button ref={ref} whileTap={whileTap} {...props} />;
});
MotionButton.displayName = 'MotionButton';

export const MotionLink = motion.create(Link);
