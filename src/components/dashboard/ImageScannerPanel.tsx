import { useState, useRef } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, ScanLine, FileText, X, Loader2, Brain, BookOpen, Save } from "lucide-react";

interface ImageScannerPanelProps {
  user: User;
}

export const ImageScannerPanel = ({ user }: ImageScannerPanelProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [title, setTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please select an image file", variant: "destructive" });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please select an image under 10MB", variant: "destructive" });
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setSelectedImage(e.target?.result as string);
    reader.readAsDataURL(file);
    setExtractedText(null);
    setAiExplanation(null);
  };

  const handleScan = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/extract-text`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ imageBase64: selectedImage }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to extract text");
      }

      const data = await response.json();
      setExtractedText(data.extractedText);
      toast({ title: "Text extracted!", description: "Now getting AI explanation..." });
      
      // Automatically get AI explanation
      await getAiExplanation(data.extractedText);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process image",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getAiExplanation = async (text: string) => {
    setIsExplaining(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-tutor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionData.session?.access_token}`,
          },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: `Please analyze the following content from my notes/textbook and provide a detailed explanation. If it contains a question or problem, solve it step by step. If it contains notes or concepts, explain them clearly with examples.\n\nContent:\n${text}`
              }
            ]
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get AI explanation");
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let explanation = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");
          
          for (const line of lines) {
            if (line.startsWith("data: ") && line !== "data: [DONE]") {
              try {
                const jsonStr = line.slice(6).trim();
                if (jsonStr && jsonStr !== "[DONE]") {
                  const parsed = JSON.parse(jsonStr);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    explanation += content;
                    setAiExplanation(explanation);
                  }
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      toast({ title: "Explanation ready!", description: "You can now save this as notes" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to get AI explanation",
        variant: "destructive",
      });
    } finally {
      setIsExplaining(false);
    }
  };

  const handleSaveAsDocument = async () => {
    if (!extractedText) return;

    try {
      let imageUrl = null;

      if (selectedFile) {
        const filePath = `${user.id}/${Date.now()}-${selectedFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("scanned-images")
          .upload(filePath, selectedFile);

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from("scanned-images")
            .getPublicUrl(filePath);
          imageUrl = publicUrl;
        }
      }

      const { error } = await supabase.from("scanned_documents").insert({
        user_id: user.id,
        title: title || "Untitled Scan",
        image_url: imageUrl,
        extracted_text: extractedText,
      });

      if (error) throw error;

      toast({ title: "Saved!", description: "Original scan saved to documents" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save document",
        variant: "destructive",
      });
    }
  };

  const handleSaveExplanationAsNote = async () => {
    if (!aiExplanation) return;

    try {
      const noteTitle = title || "AI Explanation";
      const noteContent = `## Original Content\n${extractedText}\n\n---\n\n## AI Explanation\n${aiExplanation}`;

      const { error } = await supabase.from("study_notes").insert({
        user_id: user.id,
        title: noteTitle,
        content: noteContent,
        tags: ["ai-explained", "scan"],
      });

      if (error) throw error;

      toast({ title: "Note saved!", description: "AI explanation saved to your study notes" });
      handleClear();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save note",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setExtractedText(null);
    setAiExplanation(null);
    setTitle("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-foreground">Scan & Explain</h2>
        <p className="text-muted-foreground">Upload notes or problems - get instant AI explanations</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload area */}
        <div className="space-y-4">
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer ${
              selectedImage ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-card"
            }`}
            onClick={() => !selectedImage && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {selectedImage ? (
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="max-h-64 mx-auto rounded-lg object-contain"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="py-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <p className="text-foreground font-medium mb-1">Click to upload an image</p>
                <p className="text-sm text-muted-foreground">or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-2">PNG, JPG up to 10MB</p>
              </div>
            )}
          </div>

          {selectedImage && !extractedText && (
            <Button
              variant="hero"
              className="w-full"
              onClick={handleScan}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Extracting text...
                </>
              ) : (
                <>
                  <ScanLine className="w-4 h-4 mr-2" />
                  Scan & Explain
                </>
              )}
            </Button>
          )}

          {/* Extracted text preview */}
          {extractedText && (
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Extracted Text</span>
              </div>
              <p className="text-sm text-foreground whitespace-pre-wrap line-clamp-6">{extractedText}</p>
            </div>
          )}
        </div>

        {/* AI Explanation area */}
        <div className="space-y-4">
          {aiExplanation || isExplaining ? (
            <>
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">AI Explanation</span>
                {isExplaining && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
              </div>
              
              <Input
                placeholder="Give this note a title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-card border-border"
              />
              
              <div className="bg-card border border-border rounded-2xl p-4 max-h-80 overflow-y-auto">
                <p className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
                  {aiExplanation || "Generating explanation..."}
                </p>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button 
                  variant="hero" 
                  className="w-full" 
                  onClick={handleSaveExplanationAsNote}
                  disabled={isExplaining || !aiExplanation}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Save as Study Note
                </Button>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={handleSaveAsDocument}
                    disabled={isExplaining}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Original Only
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={handleClear}>
                    Scan Another
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-card border border-border rounded-2xl min-h-[300px]">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">AI-Powered Analysis</h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                Upload an image of your notes, questions, or problems. Our AI will explain the content in detail and help you understand it better.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
