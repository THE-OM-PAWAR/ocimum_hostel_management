"use client";

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

interface BlockCardProps {
  index: number;
}

function BlockCard({ index }: BlockCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
    >
      <h3 className="font-medium">Block {index + 1}</h3>
      <p className="text-sm text-muted-foreground mt-2">
        User-specific block content
      </p>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.firstName}!</h1>
        <p className="text-muted-foreground mt-2">
          Here's an overview of your blocks
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <BlockCard key={i} index={i} />
        ))}
      </div>
    </div>
  );
}