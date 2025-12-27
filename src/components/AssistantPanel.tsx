import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Fuel, Trophy, Zap } from "lucide-react";
import assistantButton from "@/assets/assistant-button.png";
import wifiDisplayButton from "@/assets/wifi-display-button.png";

interface AssistantPanelProps {
  score: number;
  fuel: number;
  boosts: number;
}

export const AssistantPanel = ({ score, fuel, boosts }: AssistantPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* WiFi Display button */}
        <motion.button
          onClick={() => {/* WiFi display functionality */}}
          className="w-14 h-14 rounded-full bg-transparent flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={wifiDisplayButton} alt="WiFi Display" className="w-full h-full object-contain" />
        </motion.button>
        
        {/* Assistant trigger button */}
        <motion.button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-transparent flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={assistantButton} alt="Assistant" className="w-full h-full object-contain" />
        </motion.button>
      </div>

      {/* Panel overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/50"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 z-50 h-full w-80 bg-background border-l border-border p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Game Stats</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Score</p>
                      <p className="text-2xl font-bold text-foreground">{score}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center gap-3">
                    <Fuel className="w-6 h-6 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Fuel</p>
                      <p className="text-2xl font-bold text-foreground">{fuel}%</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Boosts</p>
                      <p className="text-2xl font-bold text-foreground">{boosts}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
