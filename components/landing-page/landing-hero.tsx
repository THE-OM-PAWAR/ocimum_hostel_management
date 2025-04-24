"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";

export function LandingHero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const { isSignedIn } = useAuth();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouseX.set(x);
      mouseY.set(y);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => container.removeEventListener("mousemove", handleMouseMove);
    }
  }, [mouseX, mouseY]);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  return (
    <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div 
          className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] translate-x-1/2 -translate-y-1/4 rounded-full bg-accent/30 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="absolute left-0 bottom-0 -z-10 h-[400px] w-[400px] -translate-x-1/3 translate-y-1/4 rounded-full bg-primary/30 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>
      
      <div className="container px-4 md:px-6" ref={containerRef}>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              x: useTransform(x, (value) => (value - (containerRef.current?.offsetWidth ?? 0) / 2) * -0.02),
              y: useTransform(y, (value) => (value - (containerRef.current?.offsetHeight ?? 0) / 2) * -0.02),
            }}
          >
            <motion.div 
              className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="text-muted-foreground">Simplify hostel management</span>
              <motion.span 
                className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3 }}
              >
                New
              </motion.span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Manage your hostel with ease and efficiency
            </motion.h1>
            
            <motion.p 
              className="max-w-[700px] text-lg text-muted-foreground md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              HostelHub streamlines room management, tenant onboarding, rent collection, and maintenance tracking in one seamless platform.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {isSignedIn ? (
                <Button 
                  size="lg" 
                  className="relative overflow-hidden group" 
                  variant="outline"
                  asChild
                >
                  <Link href="/dashboard">
                    <motion.span
                      className="absolute inset-0 bg-primary/20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                    <span className="relative z-10 flex items-center">
                      Go to Dashboard
                      <motion.span
                        className="ml-2"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.span>
                    </span>
                  </Link>
                </Button>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    className="relative overflow-hidden group" 
                    asChild
                  >
                    <Link href="/register">
                      <motion.span
                        className="absolute inset-0 bg-primary/20"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                      />
                      <span className="relative z-10 flex items-center">
                        Get Started
                        <motion.span
                          className="ml-2"
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </motion.span>
                      </span>
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="relative overflow-hidden group"
                    asChild
                  >
                    <Link href="/login">
                      <motion.span
                        className="absolute inset-0 bg-accent/20"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                      />
                      <span className="relative z-10">Sign In</span>
                    </Link>
                  </Button>
                </>
              )}
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-4 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.div 
                className="flex -space-x-2"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                {[...Array(4)].map((_, i) => (
                  <motion.div 
                    key={i}
                    className="inline-block h-8 w-8 rounded-full border-2 border-background bg-muted overflow-hidden"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
                  >
                    <span className="sr-only">User {i+1}</span>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div 
                className="text-muted-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                Trusted by <span className="font-medium text-foreground">500+</span> hostel owners
              </motion.div>
            </motion.div>
          </motion.div>
          
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              x: useTransform(x, (value) => (value - (containerRef.current?.offsetWidth ?? 0) / 2) * 0.02),
              y: useTransform(y, (value) => (value - (containerRef.current?.offsetHeight ?? 0) / 2) * 0.02),
            }}
          >
            <motion.div 
              className="relative mx-auto aspect-video overflow-hidden rounded-xl border bg-background shadow-xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <div className="p-6 flex flex-col h-full">
                <motion.div 
                  className="mb-4 flex items-center justify-between"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="h-6 w-6" />
                    <span className="font-semibold">Dashboard Overview</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <motion.div 
                      className="h-3 w-3 rounded-full bg-destructive"
                      whileHover={{ scale: 1.2 }}
                    />
                    <motion.div 
                      className="h-3 w-3 rounded-full bg-warning"
                      whileHover={{ scale: 1.2 }}
                    />
                    <motion.div 
                      className="h-3 w-3 rounded-full bg-success"
                      whileHover={{ scale: 1.2 }}
                    />
                  </div>
                </motion.div>
                
                <div className="grid grid-cols-3 gap-4 flex-1">
                  <motion.div 
                    className="col-span-2 rounded-lg border bg-card p-4 shadow-sm flex flex-col"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className="text-sm font-medium mb-2">Hostel Occupancy</h3>
                    <div className="flex-1 flex items-end">
                      <div className="w-full grid grid-cols-7 gap-1 h-32">
                        {[65, 78, 92, 84, 88, 95, 89].map((height, i) => (
                          <motion.div 
                            key={i} 
                            className="flex items-end"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                          >
                            <motion.div 
                              className="w-full rounded-sm bg-primary/80"
                              style={{ height: `${height}%` }}
                              whileHover={{ backgroundColor: "var(--primary)" }}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                  <div className="flex flex-col gap-4">
                    <motion.div 
                      className="rounded-lg border bg-card p-4 shadow-sm"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <h3 className="text-sm font-medium">Rooms</h3>
                      <motion.p 
                        className="text-2xl font-bold"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                      >
                        42
                      </motion.p>
                    </motion.div>
                    <motion.div 
                      className="rounded-lg border bg-card p-4 shadow-sm"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9, duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <h3 className="text-sm font-medium">Tenants</h3>
                      <motion.p 
                        className="text-2xl font-bold"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                      >
                        38
                      </motion.p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}