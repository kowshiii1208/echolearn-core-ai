import { Camera, MessageCircle, RefreshCw, Mic, Heart, Zap } from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Image to Knowledge",
    description: "Snap photos of your notes, textbooks, or diagrams. Our AI extracts and organizes key concepts instantly.",
    gradient: "from-primary/15 to-primary/5",
    iconGradient: "from-primary to-primary/70",
    glow: "group-hover:shadow-[0_0_40px_hsl(195_35%_42%/0.15)]",
  },
  {
    icon: MessageCircle,
    title: "Conversational Tutor",
    description: "Ask questions naturally and get clear, patient explanations tailored to your understanding level.",
    gradient: "from-accent/15 to-accent/5",
    iconGradient: "from-accent to-primary",
    glow: "group-hover:shadow-[0_0_40px_hsl(200_85%_8%/0.15)]",
  },
  {
    icon: RefreshCw,
    title: "Adaptive Echo Loops",
    description: "Smart spaced repetition that learns your patterns. Review exactly when you need to remember.",
    gradient: "from-primary/15 to-accent/5",
    iconGradient: "from-primary to-accent",
    glow: "group-hover:shadow-[0_0_40px_hsl(195_35%_42%/0.12)]",
  },
  {
    icon: Mic,
    title: "Voice Interaction",
    description: "Learn hands-free with natural voice conversations. Perfect for reviewing while multitasking.",
    gradient: "from-accent/10 to-primary/5",
    iconGradient: "from-accent to-primary/70",
    glow: "group-hover:shadow-[0_0_40px_hsl(200_85%_8%/0.12)]",
  },
  {
    icon: Heart,
    title: "Wellbeing Mode",
    description: "Detects when you're stressed and adjusts the pace. Encourages healthy study habits and breaks.",
    gradient: "from-primary/10 to-primary/5",
    iconGradient: "from-primary/80 to-primary",
    glow: "group-hover:shadow-[0_0_40px_hsl(195_35%_42%/0.12)]",
  },
  {
    icon: Zap,
    title: "Instant Flashcards",
    description: "Automatically generates flashcards from your materials. Study smarter, not harder.",
    gradient: "from-accent/15 to-accent/5",
    iconGradient: "from-accent to-accent/70",
    glow: "group-hover:shadow-[0_0_40px_hsl(200_85%_8%/0.15)]",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-28 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-card" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-20">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 border border-primary/20 px-5 py-2 rounded-full mb-6">
            <Zap className="w-3.5 h-3.5" />
            Powerful Features
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-5 tracking-tight">
            Everything You Need to Excel
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            EchoLearn combines cutting-edge AI with proven learning science to help you master any subject.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group relative bg-background/80 backdrop-blur-sm border border-border/50 p-8 rounded-2xl transition-all duration-500 hover:-translate-y-1.5 ${feature.glow}`}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                opacity: 0,
                animation: "fade-in 0.6s ease-out forwards"
              }}
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.iconGradient} mb-6 transition-transform duration-300 group-hover:scale-110 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
