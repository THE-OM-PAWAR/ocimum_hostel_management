"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Home, Building2, Settings } from "lucide-react";

const settingsOptions = [
  {
    title: "Block Profile",
    description: "Manage block information, photos, and location details",
    href: "block-profile",
  },
  {
    title: "Room Components",
    description: "Manage room amenities, furniture, and equipment",
    href: "room-components",
  },
  {
    title: "Room Types",
    description: "Configure different room categories and their features",
    href: "room-types",
  },
  {
    title: "Payment Settings",
    description: "Set up payment schedules, late fees, and payment methods",
    href: "payment-settings",
  },
  // {
  //   title: "Maintenance",
  //   description: "Configure maintenance request types and response times",
  //   href: "maintenance",
  // },
  // {
  //   title: "Notifications",
  //   description: "Set up automated notifications and reminders",
  //   href: "notifications",
  // },
  // {
  //   title: "Access Control",
  //   description: "Manage staff access and permissions",
  //   href: "access-control",
  // },
];

export default function BlockSettingsPage() {
  const params = useParams();
  const blockId = Array.isArray(params.blockId) ? params.blockId[0] : params.blockId;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Block Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure and customize your block settings
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {settingsOptions.map((option, index) => (
          <Link key={option.href} href={`/dashboard/${blockId}/settings/${option.href}`}>
            <motion.div
              className="group relative overflow-hidden rounded-lg border bg-card p-6 hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{option.title}</h3>
                <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {option.description}
              </p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}