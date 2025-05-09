"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn, getGithubPagesUrl } from "@/lib/utils";

interface HeroProps {
  className?: string;
}

export function Hero({ className }: HeroProps) {
  return (
    <section
      className={cn(
        "relative w-full overflow-hidden pt-24 pb-32 md:pt-28 md:pb-32 lg:min-h-[90vh] lg:flex lg:items-center",
        className
      )}
    >
      {/* Background gradient and patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-primary-50/90 to-secondary-50"></div>
      <div className="absolute inset-0 bg-sprinkle-pattern opacity-10"></div>
      
      {/* Decorative blurred circles */}
      <div className="absolute top-1/4 left-0 w-64 h-64 rounded-full bg-primary-200 mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-purple-200 mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid gap-10 md:grid-cols-[1.2fr,1fr] lg:grid-cols-[1.2fr,1fr] md:gap-12 items-center max-w-7xl mx-auto">
          {/* Content side */}
          <motion.div
            className="text-center md:text-left order-2 md:order-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="relative z-10"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15,
                    delayChildren: 0.3
                  }
                }
              }}
            >
              <motion.h1
                className="mb-6 text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-900 tracking-tight leading-tight"
                variants={{
                  hidden: { y: 40, opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { duration: 0.8 } }
                }}
              >
                <span className="inline relative">
                  <span className="relative z-10">Yaroz Sweets</span>
                  <span className="absolute -z-10 bottom-2 left-0 right-0 h-3 bg-primary-200 opacity-50 transform -skew-x-6"></span>
                </span>
              </motion.h1>
              
              <motion.p
                className="mb-6 text-lg md:text-xl lg:text-2xl font-display text-neutral-800"
                variants={{
                  hidden: { y: 40, opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { duration: 0.8 } }
                }}
              >
                <span className="text-gradient font-medium">Taste the Art</span>
              </motion.p>
              
              <motion.p
                className="mb-10 text-neutral-700 max-w-lg mx-auto md:mx-0 text-balance"
                variants={{
                  hidden: { y: 40, opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { duration: 0.8 } }
                }}
              >
                Crafting exquisite cakes and confections for your most cherished moments and celebrations with premium ingredients and artistic flair.
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
                variants={{
                  hidden: { y: 40, opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
                }}
              >
                <Button 
                  href="#about" 
                  variant="default" 
                  size="lg"
                  className="bg-primary-600 hover:bg-primary-700 text-white w-full sm:w-auto rounded-xl shadow-md hover:shadow-lg transition-all duration-300 px-8 py-6 relative overflow-hidden group"
                >
                  <span className="relative z-10">About Us</span>
                  <span className="absolute inset-0 bg-gradient-to-tr from-primary-700 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Button>
                <Button 
                  href="#contact" 
                  variant="secondary" 
                  size="lg"
                  className="bg-white hover:bg-white/90 border border-primary-100 text-primary-700 w-full sm:w-auto rounded-xl shadow-md hover:shadow-lg transition-all duration-300 px-8 py-6"
                >
                  Contact Us
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Video/image container */}
          <motion.div
            className="order-1 md:order-2 flex justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          >
            <div className="relative w-11/12 max-w-[280px] sm:max-w-[320px] rounded-2xl overflow-hidden shadow-elegant mx-auto">
              {/* Custom aspect ratio container (9:16 portrait ratio) */}
              <div className="relative" style={{ paddingBottom: "177.78%" }}>
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                >
                  <source src={getGithubPagesUrl("images/hero/hero_video_file.mp4")} type="video/mp4" />
                </video>
                
                {/* Decorative animated frame */}
                <div className="absolute inset-0 pointer-events-none">
                  <motion.span 
                    className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-white/60 rounded-tl-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                  ></motion.span>
                  <motion.span 
                    className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white/60 rounded-tr-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.4, duration: 0.6 }}
                  ></motion.span>
                  <motion.span 
                    className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-white/60 rounded-bl-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.6, duration: 0.6 }}
                  ></motion.span>
                  <motion.span
                    className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-white/60 rounded-br-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.8, duration: 0.6 }}
                  ></motion.span>
                </div>
              </div>
              
              {/* Decorative elements under the video */}
              <motion.div
                className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-secondary-100 opacity-80"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.8 }}
                transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
              />
              
              <motion.div
                className="absolute -top-4 -left-4 h-16 w-16 rounded-full bg-primary-100 opacity-80"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.8 }}
                transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative wavy bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-20 z-10">
        <svg viewBox="0 0 1440 100" className="w-full h-full" preserveAspectRatio="none">
          <motion.path 
            fill="white" 
            fillOpacity="1" 
            d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,58.7C840,64,960,96,1080,96C1200,96,1320,64,1380,48L1440,32L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          ></motion.path>
        </svg>
      </div>
    </section>
  );
} 