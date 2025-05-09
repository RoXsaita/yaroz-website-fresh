"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionDividerProps {
  className?: string;
  inverted?: boolean;
  variant?: "wave" | "dots" | "minimal";
  color?: "light" | "primary" | "secondary";
}

export function SectionDivider({ 
  className, 
  inverted = false, 
  variant = "wave",
  color = "light"
}: SectionDividerProps) {
  // Define color classes based on the color prop
  const colorClasses = {
    light: "from-white to-white",
    primary: "from-primary-50 to-primary-50",
    secondary: "from-secondary-50 to-secondary-50",
  };
  
  // For minimal variant - just a subtle gradient transition
  if (variant === "minimal") {
    return (
      <motion.div 
        className={cn(
          "relative h-16 w-full overflow-hidden",
          inverted && "rotate-180",
          className
        )}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className={cn(
          "absolute inset-0 bg-gradient-to-b opacity-80",
          colorClasses[color]
        )} />
      </motion.div>
    );
  }
  
  // For dots variant - decorative dots pattern
  if (variant === "dots") {
    return (
      <motion.div 
        className={cn(
          "relative h-16 w-full overflow-hidden",
          inverted && "rotate-180",
          className
        )}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex justify-center gap-3 py-6">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                "h-2 w-2 rounded-full",
                i % 2 === 0 ? "bg-primary-300" : "bg-secondary-300"
              )}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  // Default wave variant
  return (
    <motion.div 
      className={cn(
        "relative h-16 w-full overflow-hidden",
        inverted && "rotate-180",
        className
      )}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      aria-hidden="true"
    >
      <img 
        src="/images/frosting-swirl_file.svg" 
        alt="" 
        className="absolute inset-0 h-full w-full object-cover"
      />
    </motion.div>
  );
} 