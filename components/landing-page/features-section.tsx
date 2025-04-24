"use client";

import { motion } from "framer-motion";
import { Building2, User, CreditCard, PenTool as Tool, BarChart3, Calendar, Shield, Terminal } from "lucide-react";

const features = [
  {
    icon: <Building2 className="h-6 w-6" />,
    title: "Room Management",
    description: "Organize rooms by blocks, floors and categories. Assign and track room status in real-time.",
  },
  {
    icon: <User className="h-6 w-6" />,
    title: "Tenant Management",
    description: "Streamline tenant onboarding with digital forms and document collection.",
  },
  {
    icon: <CreditCard className="h-6 w-6" />,
    title: "Billing & Payments",
    description: "Automated rent collection with customizable billing cycles.",
  },
  {
    icon: <Tool className="h-6 w-6" />,
    title: "Maintenance",
    description: "Enable tenants to report issues digitally and track resolution progress.",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Analytics",
    description: "Gain insights into occupancy rates and revenue trends.",
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: "Room Booking",
    description: "Accept online booking requests and manage availability calendar.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-accent/30">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-[800px] mx-auto mb-12">
          <motion.h2 
            className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
           All the features you need
          </motion.h2>
          <motion.p 
            className="mt-4 text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Everything you need to manage your property efficiently
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-lg bg-card p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                className="mb-3 rounded-full bg-primary/10 p-2 w-fit"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {feature.icon}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>

              <motion.div 
                className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                initial={false}
                whileHover={{ opacity: 1 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}