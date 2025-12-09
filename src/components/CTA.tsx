import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-primary rounded-3xl p-12 md:p-16 overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-sage-dark rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/4" />
          
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
              <span className="text-sm font-medium text-primary-foreground">
                Start learning smarter today
              </span>
            </div>
            
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
              Ready to Transform Your Studies?
            </h2>
            
            <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-10">
              Join thousands of students who are learning more effectively with EchoLearn. 
              Your AI study companion is just a click away.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="xl" 
                className="bg-background text-primary hover:bg-background/90 shadow-elevated"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
              <span className="text-sm text-primary-foreground/60">
                No credit card required
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
