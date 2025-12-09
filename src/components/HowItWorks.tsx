import { Camera, Brain, Repeat, Trophy } from "lucide-react";

const steps = [
  {
    icon: Camera,
    step: "01",
    title: "Capture Your Notes",
    description: "Take a photo of your handwritten notes, textbook pages, or diagrams. EchoLearn's advanced OCR extracts every detail.",
  },
  {
    icon: Brain,
    step: "02",
    title: "AI Processes & Organizes",
    description: "Our AI identifies key concepts, creates summaries, and generates study materials tailored to your needs.",
  },
  {
    icon: Repeat,
    step: "03",
    title: "Learn & Review",
    description: "Engage with interactive quizzes, flashcards, and conversations. The system adapts to your progress.",
  },
  {
    icon: Trophy,
    step: "04",
    title: "Master the Material",
    description: "Track your understanding and get reminded to review at the perfect time for long-term retention.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 px-4 bg-card">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-medium text-primary bg-secondary px-4 py-1.5 rounded-full mb-4">
            Simple Process
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            How EchoLearn Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From notes to knowledge in four simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
              )}
              
              <div className="text-center">
                {/* Step number */}
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 rounded-2xl bg-background shadow-card flex items-center justify-center group hover:shadow-elevated transition-all duration-300">
                    <step.icon className="w-10 h-10 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm font-bold flex items-center justify-center">
                    {step.step}
                  </span>
                </div>
                
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
