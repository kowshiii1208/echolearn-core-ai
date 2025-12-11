import { SudokuGame } from "@/components/games/SudokuGame";
import { QueensGame } from "@/components/games/QueensGame";
import { ZipGame } from "@/components/games/ZipGame";
import { Gamepad2 } from "lucide-react";

export const GamesPanel = () => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
          <Gamepad2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Brain Games</h1>
          <p className="text-muted-foreground">Take a break and challenge your mind!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <SudokuGame />
        <QueensGame />
        <ZipGame />
      </div>
    </div>
  );
};
