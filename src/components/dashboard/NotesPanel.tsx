import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileText, Trash2, Calendar, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface ScannedDocument {
  id: string;
  title: string;
  image_url: string | null;
  extracted_text: string | null;
  created_at: string;
}

interface NotesPanelProps {
  user: User;
}

export const NotesPanel = ({ user }: NotesPanelProps) => {
  const [documents, setDocuments] = useState<ScannedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<ScannedDocument | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadDocuments();
  }, [user.id]);

  const loadDocuments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("scanned_documents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to load notes", variant: "destructive" });
    } else {
      setDocuments(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("scanned_documents").delete().eq("id", id);
    
    if (error) {
      toast({ title: "Error", description: "Failed to delete note", variant: "destructive" });
    } else {
      setDocuments(prev => prev.filter(d => d.id !== id));
      if (selectedDoc?.id === id) setSelectedDoc(null);
      toast({ title: "Deleted", description: "Note has been removed" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-foreground">My Notes</h2>
        <p className="text-muted-foreground">All your scanned documents in one place</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-2xl">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No notes yet</h3>
          <p className="text-muted-foreground">Scan your first document to get started</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Documents list */}
          <div className="lg:col-span-1 space-y-3">
            {documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedDoc?.id === doc.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">{doc.title}</h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(doc.created_at), "MMM d, yyyy")}
                    </div>
                  </div>
                  {doc.image_url && (
                    <img
                      src={doc.image_url}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Document detail */}
          <div className="lg:col-span-2">
            {selectedDoc ? (
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{selectedDoc.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(selectedDoc.created_at), "MMMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {selectedDoc.image_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(selectedDoc.image_url!, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View Image
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(selectedDoc.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {selectedDoc.image_url && (
                  <img
                    src={selectedDoc.image_url}
                    alt={selectedDoc.title}
                    className="w-full max-h-64 object-contain rounded-lg bg-secondary mb-4"
                  />
                )}

                <div className="prose prose-sm max-w-none">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Extracted Content</h4>
                  <div className="bg-secondary/50 rounded-xl p-4 max-h-96 overflow-y-auto">
                    <p className="whitespace-pre-wrap text-foreground text-sm">
                      {selectedDoc.extracted_text || "No text extracted"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-card border border-border rounded-2xl">
                <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Select a note to view its contents</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
