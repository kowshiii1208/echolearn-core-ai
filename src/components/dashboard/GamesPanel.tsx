import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SudokuGame } from "@/components/games/SudokuGame";
import { QueensGame } from "@/components/games/QueensGame";
import { ZipGame } from "@/components/games/ZipGame";
import { Gamepad2, Grid3X3, Crown, Zap } from "lucide-react";

export const GamesPanel = () => {
  const [activeGame, setActiveGame] = useState("sudoku");

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-primary/10">
          <Gamepad2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Brain Games</h1>
          <p className="text-muted-foreground">Take a break and challenge your mind!</p>
        </div>
      </div>

      <Tabs value={activeGame} onValueChange={setActiveGame} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="sudoku" className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4" />
            Sudoku
          </TabsTrigger>
          <TabsTrigger value="queens" className="flex items-center gap-2">
            <Crown className="w-4 h-4" />
            Queens
          </TabsTrigger>
          <TabsTrigger value="zip" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Zip
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sudoku">
          <SudokuGame />
        </TabsContent>

        <TabsContent value="queens">
          <QueensGame />
        </TabsContent>

        <TabsContent value="zip">
          <ZipGame />
        </TabsContent>
      </Tabs>
    </div>
  );
};
