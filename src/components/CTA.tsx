import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-28 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-[2rem] overflow-hidden">
          {/* Multi-layer gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent via-primary to-primary/90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,hsl(195_40%_55%/0.4)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,hsl(200_85%_8%/0.3)_0%,transparent_50%)]" />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />

          {/* Floating orbs */}
          <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-5%] w-48 h-48 bg-white/5 rounded-full blur-3xl" />
          
          <div className="relative z-10 p-12 md:p-20 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-2.5 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-semibold text-white">
                Start learning smarter today
              </span>
            </div>
            
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Ready to Transform
              <br />
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                Your Studies?
              </span>
            </h2>
            
            <p className="text-lg text-white/70 max-w-xl mx-auto mb-12 leading-relaxed">
              Join thousands of students who are learning more effectively with EchoLearn. 
              Your AI study companion is just a click away.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth">
                <Button 
                  size="xl" 
                  className="bg-white text-accent hover:bg-white/90 shadow-elevated font-semibold group"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <span className="text-sm text-white/50">
                No credit card required
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
