"use client";

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateBlockDialog } from "@/components/create-block-dialog";
import { useRouter } from "next/navigation";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

interface BlockCardProps {
  index: number;
  name: string;
  description?: string;
  id: string;
}

interface Block {
  _id: string;
  name: string;
  description?: string;
}

function CreateBlockCard({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      className="bg-card p-6 rounded-lg border border-dashed shadow-sm cursor-pointer flex flex-col items-center justify-center h-[200px]"
      onClick={onClick}
    >
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Plus className="h-6 w-6 text-primary" />
      </div>
      <h3 className="font-medium text-center">Create New Block</h3>
      <p className="text-sm text-muted-foreground mt-2 text-center">
        Add a new block to your hostel
      </p>
    </motion.div>
  );
}

function BlockCard({ index, name, description, id }: BlockCardProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 h-[200px] flex flex-col cursor-pointer"
      onClick={() => router.push(`/dashboard/${id}`)}
    >
      <h3 className="font-medium">{name}</h3>
      <div className="flex-1 mt-2">
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Click to manage rooms and tenants
          </p>
        )}
      </div>
      <div className="mt-auto pt-4">
        <div className="text-sm text-muted-foreground">
          Click to view details
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { user } = useUser();
  const [hostelName, setHostelName] = useState<string>("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const fetchBlocks = async () => {
    try {
      const response = await fetch(`/api/users/${user?.id}/blocks?userId=${user?.id}`);
      const data = await response.json();
      setBlocks(data);
    } catch (error) {
      console.error("Error fetching blocks:", error);
    }
  };

  useEffect(() => {
    const fetchHostelInfo = async () => {
      try {
        const response = await fetch(`/api/users/${user?.id}/hostel-info`);
        const data = await response.json();
        setHostelName(data.hostelName);
        await fetchBlocks();
      } catch (error) {
        console.error("Error fetching hostel info:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchHostelInfo();
    }
  }, [user?.id]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <LoadingSkeleton className="h-10 w-64" />
          <LoadingSkeleton className="h-6 w-96 mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <LoadingSkeleton className="h-[200px]" />
          {[1, 2, 3].map((i) => (
            <LoadingSkeleton key={i} className="h-[200px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{hostelName}</h1>
        <p className="text-muted-foreground mt-2">
          Manage your hostel blocks and rooms
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <CreateBlockCard onClick={() => setIsCreateDialogOpen(true)} />
        {(blocks.length >= 1) && blocks.map((block, i) => (
          <BlockCard
            key={block._id}
            index={i}
            name={block.name}
            description={block.description}
            id={block._id}
          />
        ))}
      </div>

      <CreateBlockDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={fetchBlocks}
        userId={user?.id || ""}
        hostelId={hostelName}
      />
    </div>
  );
}