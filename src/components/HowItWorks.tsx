import { Camera, Brain, Repeat, Trophy } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Camera,
    step: "01",
    title: "Capture Your Notes",
    description: "Take a photo of your handwritten notes, textbook pages, or diagrams. EchoLearn's advanced OCR extracts every detail.",
    gradient: "from-primary to-primary/70",
  },
  {
    icon: Brain,
    step: "02",
    title: "AI Processes & Organizes",
    description: "Our AI identifies key concepts, creates summaries, and generates study materials tailored to your needs.",
    gradient: "from-primary/80 to-accent",
  },
  {
    icon: Repeat,
    step: "03",
    title: "Learn & Review",
    description: "Engage with interactive quizzes, flashcards, and conversations. The system adapts to your progress.",
    gradient: "from-accent to-primary",
  },
  {
    icon: Trophy,
    step: "04",
    title: "Master the Material",
    description: "Track your understanding and get reminded to review at the perfect time for long-term retention.",
    gradient: "from-accent to-accent/70",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-28 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-card" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 border border-primary/20 px-5 py-2 rounded-full mb-6">
            Simple Process
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-5 tracking-tight">
            How EchoLearn Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From notes to knowledge in four simple steps
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              className="relative group"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: index * 0.1, ease: "easeOut" }}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-14 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary/30 to-transparent" />
              )}
              
              <div className="text-center">
                {/* Step icon */}
                <div className="relative inline-block mb-8">
                  <div className={`w-28 h-28 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-elevated group-hover:scale-105 transition-transform duration-300`}>
                    <step.icon className="w-12 h-12 text-white" />
                  </div>
                  <span className="absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-background border-2 border-border text-foreground text-sm font-bold flex items-center justify-center shadow-card">
                    {step.step}
                  </span>
                </div>
                
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
