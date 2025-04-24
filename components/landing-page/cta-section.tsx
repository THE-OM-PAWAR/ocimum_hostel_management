"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <motion.div 
          className="relative rounded-3xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent z-0 opacity-30"></div>
          
          <div className="relative z-10 py-12 px-6 md:py-24 md:px-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to transform your hostel management?
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-[600px] mx-auto text-muted-foreground">
              Join hundreds of hostel owners who are saving time, increasing occupancy rates, and delivering better tenant experiences with HostelHub.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-base" asChild>
                <Link href="/register">
                  Start Your Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base" asChild>
                <Link href="/demo">Schedule a Demo</Link>
              </Button>
            </div>
            
            <p className="mt-6 text-sm text-muted-foreground">
              No credit card required. 14-day free trial.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}