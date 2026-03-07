import { useState, useRef, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, ScanLine, FileText, X, Loader2, Brain, BookOpen, Save, Camera, SwitchCamera, XCircle } from "lucide-react";

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
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOpen(true);
    } catch (err) {
      toast({ title: "Camera error", description: "Could not access camera. Please check permissions.", variant: "destructive" });
    }
  };

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setIsCameraOpen(false);
  }, []);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    canvas.toBlob((blob) => {
      if (blob) setSelectedFile(new File([blob], `scan-${Date.now()}.jpg`, { type: "image/jpeg" }));
    }, "image/jpeg", 0.9);

    setSelectedImage(dataUrl);
    setExtractedText(null);
    setAiExplanation(null);
    stopCamera();
  };

  const switchCamera = async () => {
    stopCamera();
    const newMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(newMode);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsCameraOpen(true);
    } catch {
      toast({ title: "Camera error", description: "Could not switch camera.", variant: "destructive" });
    }
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
    if (!aiExplanation) {
      toast({ title: "No explanation", description: "Please wait for AI explanation to complete", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const noteTitle = title.trim() || "AI Explanation - " + new Date().toLocaleDateString();
      const noteContent = `## Original Content\n${extractedText}\n\n---\n\n## AI Explanation\n${aiExplanation}`;

      const { data, error } = await supabase.from("study_notes").insert({
        user_id: user.id,
        title: noteTitle,
        content: noteContent,
        tags: ["ai-explained", "scan"],
      }).select();

      if (error) {
        console.error("Save error:", error);
        throw error;
      }

      console.log("Note saved successfully:", data);
      toast({ title: "Note saved!", description: "AI explanation saved to your study notes. Check 'My Notes' to view it." });
      handleClear();
    } catch (error: any) {
      console.error("Failed to save note:", error);
      toast({
        title: "Error saving note",
        description: error.message || "Failed to save note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
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
          {/* Hidden elements */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Camera view */}
          {isCameraOpen && (
            <div className="relative border-2 border-primary rounded-2xl overflow-hidden bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full max-h-72 object-cover"
              />
              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-3">
                <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 bg-background/80 backdrop-blur-sm" onClick={switchCamera}>
                  <SwitchCamera className="w-5 h-5" />
                </Button>
                <Button size="lg" className="rounded-full h-14 w-14 bg-primary shadow-lg hover:scale-105 transition-transform" onClick={capturePhoto}>
                  <Camera className="w-6 h-6 text-primary-foreground" />
                </Button>
                <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 bg-background/80 backdrop-blur-sm" onClick={stopCamera}>
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Selected image preview */}
          {selectedImage && !isCameraOpen && (
            <div className="relative border-2 border-primary border-dashed rounded-2xl p-8 bg-primary/5">
              <img
                src={selectedImage}
                alt="Selected"
                className="max-h-64 mx-auto rounded-lg object-contain"
              />
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleClear}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Upload / Camera buttons */}
          {!selectedImage && !isCameraOpen && (
            <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 hover:bg-card transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <ScanLine className="w-8 h-8 text-primary" />
              </div>
              <p className="text-foreground font-medium mb-1">Scan your notes</p>
              <p className="text-sm text-muted-foreground mb-4">Use camera or upload an image</p>
              <div className="flex gap-3 justify-center">
                <Button variant="hero" onClick={startCamera} className="gap-2">
                  <Camera className="w-4 h-4" />
                  Open Camera
                </Button>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload File
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">PNG, JPG up to 10MB</p>
            </div>
          )}

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
                  disabled={isExplaining || !aiExplanation || isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4 mr-2" />
                      Save as Study Note
                    </>
                  )}
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
