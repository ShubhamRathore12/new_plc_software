import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface ConnectionStatusProps {
  isConnected: boolean;
  error: string | null;
}

export function ConnectionStatus({
  isConnected,
  error,
}: ConnectionStatusProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 right-4 z-50"
    >
      <Badge
        variant={isConnected ? "default" : "destructive"}
        className="flex items-center gap-2 px-3 py-1"
      >
        <div
          className={`w-2 h-2 rounded-full ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span className="text-sm">
          {isConnected ? "Connected" : error || "Disconnected"}
        </span>
      </Badge>
    </motion.div>
  );
}
