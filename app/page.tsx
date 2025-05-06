"use client";

import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { LandingHeader } from "@/components/landing-page/landing-header";
import { LandingHero } from "@/components/landing-page/landing-hero";
import { FeaturesSection } from "@/components/landing-page/features-section";
import { WorkflowSection } from "@/components/landing-page/workflow-section";
import { TestimonialsSection } from "@/components/landing-page/testimonials-section";
import { PricingSection } from "@/components/landing-page/pricing-section";
import { CtaSection } from "@/components/landing-page/cta-section";
import { LandingFooter } from "@/components/landing-page/landing-footer";

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const { clientX, clientY } = e;
      const elements = document.querySelectorAll('.animate-with-mouse');

      elements.forEach((el) => {
        const rect = (el as HTMLElement).getBoundingClientRect();
        const x = (clientX - rect.left) / rect.width - 0.5;
        const y = (clientY - rect.top) / rect.height - 0.5;

        (el as HTMLElement).style.transform = `
          perspective(1000px)
          rotateY(${x * 10}deg)
          rotateX(${-y * 10}deg)
          translateZ(20px)
        `;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="flex min-h-screen flex-col" ref={containerRef}>
      <motion.div
        style={{ opacity }}
        className="fixed inset-0 pointer-events-none bg-gradient-to-b from-primary/20 to-transparent"
      />
      
      <LandingHeader />
      
      <main className="flex-1">
        <motion.div style={{ scale, opacity }}>
          <LandingHero />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <FeaturesSection />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <WorkflowSection />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <TestimonialsSection />
        </motion.div>
        
        {/* <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <PricingSection />
        </motion.div> */}
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <CtaSection />
        </motion.div>
      </main>
      
      <LandingFooter />
    </div>
  );
}