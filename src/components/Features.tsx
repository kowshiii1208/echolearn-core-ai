import { Camera, MessageCircle, RefreshCw, Mic, Heart, Zap } from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Image to Knowledge",
    description: "Snap photos of your notes, textbooks, or diagrams. Our AI extracts and organizes key concepts instantly.",
    color: "primary" as const,
  },
  {
    icon: MessageCircle,
    title: "Conversational Tutor",
    description: "Ask questions naturally and get clear, patient explanations tailored to your understanding level.",
    color: "accent" as const,
  },
  {
    icon: RefreshCw,
    title: "Adaptive Echo Loops",
    description: "Smart spaced repetition that learns your patterns. Review exactly when you need to remember.",
    color: "primary" as const,
  },
  {
    icon: Mic,
    title: "Voice Interaction",
    description: "Learn hands-free with natural voice conversations. Perfect for reviewing while multitasking.",
    color: "accent" as const,
  },
  {
    icon: Heart,
    title: "Wellbeing Mode",
    description: "Detects when you're stressed and adjusts the pace. Encourages healthy study habits and breaks.",
    color: "primary" as const,
  },
  {
    icon: Zap,
    title: "Instant Flashcards",
    description: "Automatically generates flashcards from your materials. Study smarter, not harder.",
    color: "accent" as const,
  },
];

export const Features = () => {
  return (
    <section className="py-24 px-4 bg-card">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-medium text-primary bg-secondary px-4 py-1.5 rounded-full mb-4">
            Powerful Features
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything You Need to Excel
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            EchoLearn combines cutting-edge AI with proven learning science to help you master any subject.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-background p-8 rounded-2xl shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                opacity: 0,
                animation: "fade-in 0.6s ease-out forwards"
              }}
            >
              <div 
                className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-6 transition-transform duration-300 group-hover:scale-110 ${
                  feature.color === "primary" 
                    ? "bg-secondary text-primary" 
                    : "bg-coral-light text-accent"
                }`}
              >
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
