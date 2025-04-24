"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Starter",
    price: "₹1,999",
    description: "Perfect for small hostels with basic management needs",
    features: [
      "Up to 20 rooms",
      "Basic tenant management",
      "Digital rent collection",
      "Email support",
      "Mobile responsive access",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    price: "₹3,999",
    description: "Ideal for growing hostels with advanced requirements",
    features: [
      "Up to 50 rooms",
      "Advanced tenant management",
      "Multiple payment methods",
      "Maintenance tracking",
      "Analytics dashboard",
      "Priority email support",
      "API access",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large hostels and multi-property management companies",
    features: [
      "Unlimited rooms",
      "Multiple property management",
      "Advanced analytics & reporting",
      "Custom integrations",
      "Dedicated account manager",
      "24/7 priority support",
      "Staff role management",
      "White-label option",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section className="py-20" id="pricing">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-[800px] mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the plan that's right for your hostel. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <motion.div
              key={index}
              className={`rounded-lg overflow-hidden border ${
                tier.popular ? "border-primary relative" : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                  Most Popular
                </div>
              )}
              <div className="p-6 bg-card">
                <h3 className="text-xl font-bold">{tier.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  {tier.price !== "Custom" && (
                    <span className="ml-1 text-sm text-muted-foreground">/month</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>

                <Button
                  className={`mt-6 w-full ${tier.popular ? "" : "bg-secondary hover:bg-secondary/80"}`}
                  asChild
                >
                  <Link href={tier.name === "Enterprise" ? "/contact" : "/register"}>
                    {tier.cta}
                  </Link>
                </Button>
              </div>
              <div className="p-6 bg-muted/30 space-y-4">
                <h4 className="text-sm font-medium">What's included:</h4>
                <ul className="space-y-3">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          All prices are in INR and exclude applicable taxes. By subscribing, you agree to our
          <Link href="/terms" className="text-primary hover:underline mx-1">
            Terms of Service
          </Link>
          and
          <Link href="/privacy" className="text-primary hover:underline ml-1">
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </section>
  );
}