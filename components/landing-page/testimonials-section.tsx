"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Organisation Owner",
    testimonial: "OrganisationHub has transformed how we manage our 50-room student organisation. The automated billing system alone has saved us countless hours every month.",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "PG Manager",
    testimonial: "The tenant onboarding process is seamless. We've cut down registration time by 70% and our tenants love the digital experience.",
    rating: 5,
  },
  {
    name: "Vikram Singh",
    role: "Property Investor",
    testimonial: "As someone who owns multiple properties, the analytics dashboard gives me clear insights into occupancy and revenue trends across all locations.",
    rating: 4,
  },
  {
    name: "Anjali Desai",
    role: "Organisation Administrator",
    testimonial: "The maintenance tracking feature has improved our response times significantly. Our tenants are happier and renewal rates have increased.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-[800px] mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Trusted by organisation owners nationwide
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Don't just take our word for it. Here's what our customers have to say about OrganisationHub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-card rounded-lg p-6 shadow-sm border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < testimonial.rating ? "text-warning fill-warning" : "text-muted"}`}
                  />
                ))}
              </div>
              <hostelquote className="text-lg mb-4 italic">
                "{testimonial.testimonial}"
              </hostelquote>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-muted">
            <span className="text-sm font-medium">Trusted by 500+ organisation owners across India</span>
          </div>
        </div>
      </div>
    </section>
  );
}