"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Building2, ArrowRight, CheckCircle2 } from "lucide-react";

interface WelcomeStepProps {
  onContinue: () => void;
}

export function WelcomeStep({ onContinue }: WelcomeStepProps) {
  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="text-center space-y-8"
    >
      <div className="space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
            <div className="relative bg-primary/10 p-6 rounded-2xl">
              <Building2 className="h-12 w-12 text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to Getstay
          </h1>
          <p className="text-muted-foreground text-lg">
            Let's get you set up in just a few steps
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex flex-col gap-3 pt-4"
        >
          <div className="flex items-center gap-3 text-left p-4 rounded-lg bg-muted/50">
            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
            <span className="text-sm text-muted-foreground">
              Manage your organisation effortlessly
            </span>
          </div>
          <div className="flex items-center gap-3 text-left p-4 rounded-lg bg-muted/50">
            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
            <span className="text-sm text-muted-foreground">
              Streamline tenant operations
            </span>
          </div>
          <div className="flex items-center gap-3 text-left p-4 rounded-lg bg-muted/50">
            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
            <span className="text-sm text-muted-foreground">
              Track everything in one place
            </span>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        <Button
          onClick={onContinue}
          size="lg"
          className="w-full group"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>
    </motion.div>
  );
}

