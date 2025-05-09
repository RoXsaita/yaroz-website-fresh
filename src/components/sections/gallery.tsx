"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { motion } from "framer-motion";
import { cn, getGithubPagesUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MediaGallery } from "@/components/ui/media-gallery";
import { Cake, Coffee, UtensilsCrossed } from "lucide-react";

interface GalleryProps {
  className?: string;
}

export function Gallery({ className }: GalleryProps) {
  // State for each category
  const [cakesVisibleCount, setCakesVisibleCount] = useState(8);
  const [sweetsVisibleCount, setSweetsVisibleCount] = useState(8);
  const [cateringVisibleCount, setCateringVisibleCount] = useState(8);
  
  // Helper function to generate image/video paths
  const generateMediaPaths = (
    category: string,
    prefix: string,
    count: number,
    videoIndices: number[] = []
  ) => {
    return Array.from({ length: count }, (_, i) => {
      const fileIndex = i + 1;
      // Check if this index should be a video file
      if (videoIndices.includes(fileIndex)) {
        return getGithubPagesUrl(`images/${category}/${prefix}_${fileIndex}.mp4`);
      }
      return getGithubPagesUrl(`images/${category}/${prefix}_${fileIndex}.jpg`);
    });
  };

  // Generate gallery media items by category
  const cakesItems = generateMediaPaths("Cakes", "cake", 64, [54, 55, 62, 63, 64]); // These are MP4 files
  const sweetsItems = generateMediaPaths("Sweets", "Sweets", 14, [14]); // Sweets_14.mp4 is a video
  const cateringItems = generateMediaPaths("Catering", "catering", 10);

  // Function to determine if a media item is a video
  const isVideo = (src: string) => {
    return src.toLowerCase().endsWith('.mp4') || src.toLowerCase().endsWith('.webm');
  };

  // Category section component to avoid repetition
  const CategorySection = ({ 
    title, 
    icon,
    description,
    items, 
    visibleCount, 
    setVisibleCount,
    accentColor = "pink"
  }: { 
    title: string; 
    icon: React.ReactNode;
    description: string;
    items: string[]; 
    visibleCount: number; 
    setVisibleCount: (count: number) => void;
    accentColor?: "pink" | "purple" | "default";
  }) => {
    const hasMoreItems = visibleCount < items.length;
    
    return (
      <div className="mb-20">
        <div className="flex items-center space-x-3 mb-6">
          <div className={`p-3 rounded-full ${accentColor === "pink" ? "bg-primary-100 text-primary-600" : accentColor === "purple" ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-600"}`}>
            {icon}
          </div>
          <h3 className="text-2xl font-bold">{title}</h3>
        </div>
        <p className="text-gray-600 mb-8 max-w-2xl">{description}</p>
        
        <MediaGallery
          items={items.slice(0, visibleCount).map((src) => ({
            type: isVideo(src) ? 'video' : 'image',
            src: src,
            alt: `${title} gallery item`,
          }))}
          className="mb-8"
        />

        {hasMoreItems ? (
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <Button
                size="default"
                onClick={() => setVisibleCount(Math.min(visibleCount + 8, items.length))}
                className={accentColor === "pink" ? "bg-primary-600 hover:bg-primary-700" : accentColor === "purple" ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-600 hover:bg-gray-700"}
              >
                Show More {title}
              </Button>
            </motion.div>
          </div>
        ) : (
          items.length > 4 && (
            <div className="text-center">
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                onClick={() => setVisibleCount(4)}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Show Less
              </motion.button>
            </div>
          )
        )}
      </div>
    );
  };

  return (
    <section
      id="gallery"
      className={cn("relative overflow-hidden py-20", className)}
    >
      <div className="container mx-auto max-w-6xl px-4">
        <SectionHeading
          title="Our Gallery"
          subtitle="A glimpse of our sweet creations"
        />

        <div className="mt-12">
          {/* Cakes Section */}
          <section id="gallery-cakes" className="scroll-mt-24 mb-20">
            <CategorySection
              title="Custom Cakes"
              icon={<Cake size={24} />}
              description="Our artfully designed custom cakes for birthdays, weddings, and special celebrations, crafted with premium ingredients and attention to detail."
              items={cakesItems}
              visibleCount={cakesVisibleCount}
              setVisibleCount={setCakesVisibleCount}
              accentColor="pink"
            />
          </section>
          
          {/* Sweets Section */}
          <section id="gallery-sweets" className="scroll-mt-24 mb-20">
            <CategorySection
              title="Delightful Sweets"
              icon={<Coffee size={24} />}
              description="Our delightful selections of pastries, cookies, and treats perfect for corporate gatherings, family celebrations, and special occasions."
              items={sweetsItems}
              visibleCount={sweetsVisibleCount}
              setVisibleCount={setSweetsVisibleCount}
              accentColor="purple"
            />
          </section>
          
          {/* Catering Section */}
          <section id="gallery-catering" className="scroll-mt-24">
            <CategorySection
              title="Full-Service Catering"
              icon={<UtensilsCrossed size={24} />}
              description="Complete catering solutions for weddings and large celebrations, featuring our signature sweets and coordinated service."
              items={cateringItems}
              visibleCount={cateringVisibleCount}
              setVisibleCount={setCateringVisibleCount}
              accentColor="default"
            />
          </section>
        </div>
      </div>
    </section>
  );
}