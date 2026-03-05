import { useState, useEffect, useRef } from "react";
import { Send, Brain, User, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const demoMessages = [
  {
    role: "user" as const,
    content: "Can you explain photosynthesis in simple terms?",
  },
  {
    role: "assistant" as const,
    content: "Of course! Think of photosynthesis like a plant's way of cooking. 🌱\n\nPlants use three ingredients:\n• Sunlight (energy)\n• Water (from roots)\n• Carbon dioxide (from air)\n\nThey mix these to create glucose (food) and oxygen (which they release). It's like they're little solar-powered food factories!",
  },
  {
    role: "user" as const,
    content: "What happens if there's no sunlight?",
  },
  {
    role: "assistant" as const,
    content: "Great question! Without sunlight, plants can't photosynthesize - it's like trying to cook without turning on the stove.\n\nThey'll use stored energy for a while, but eventually they'll weaken. That's why houseplants near dark corners often look sad! 🪴\n\nWant me to create a quick quiz on this topic?",
  },
];

export const ChatPreview = () => {
  const [visibleMessages, setVisibleMessages] = useState<typeof demoMessages>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messageIndexRef = useRef(0);

  useEffect(() => {
    const showNextMessage = () => {
      const currentIndex = messageIndexRef.current;
      if (currentIndex >= demoMessages.length) return;

      const currentMessage = demoMessages[currentIndex];
      
      if (currentMessage.role === "assistant") {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setVisibleMessages(prev => [...prev, currentMessage]);
          messageIndexRef.current += 1;
          setTimeout(showNextMessage, 2000);
        }, 1500);
      } else {
        setVisibleMessages(prev => [...prev, currentMessage]);
        messageIndexRef.current += 1;
        setTimeout(showNextMessage, 1000);
      }
    };

    const timer = setTimeout(showNextMessage, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-28 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(195_35%_42%/0.06)_0%,transparent_60%)]" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text content */}
          <div className="order-2 lg:order-1">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 border border-primary/20 px-5 py-2 rounded-full mb-6">
              <Brain className="w-3.5 h-3.5" />
              Conversational AI
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
              Learn Through Natural Conversation
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Ask anything, the way you'd ask a friend. EchoLearn explains complex topics 
              using analogies and examples that make sense to you.
            </p>
            <ul className="space-y-5">
              {[
                "Patient explanations, never judgmental",
                "Adapts to your learning style",
                "Creates personalized examples",
                "Remembers your progress",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Chat mockup */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              {/* Glow effect behind card */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10 rounded-3xl blur-2xl scale-95" />
              
              <div className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-elevated max-w-md mx-auto">
                {/* Chat header */}
                <div className="flex items-center gap-3 pb-4 border-b border-border/50 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">EchoMind Tutor</h4>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <p className="text-xs text-muted-foreground">Always here to help</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="space-y-4 min-h-[320px] max-h-[320px] overflow-y-auto">
                  {visibleMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""} animate-fade-in`}
                    >
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.role === "user" 
                            ? "bg-gradient-to-br from-accent to-accent/80" 
                            : "bg-gradient-to-br from-primary to-primary/80"
                        } shadow-md`}
                      >
                        {message.role === "user" ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Brain className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div 
                        className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-accent to-accent/90 text-accent-foreground rounded-tr-sm"
                            : "bg-secondary/80 text-secondary-foreground rounded-tl-sm border border-border/30"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-3 animate-fade-in">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0 shadow-md">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-secondary/80 border border-border/30 rounded-2xl rounded-tl-sm px-4 py-3">
                        <div className="flex gap-1.5">
                          <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask anything..."
                    className="flex-1 bg-background/60 backdrop-blur-sm border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                    disabled
                  />
                  <Button size="icon" className="rounded-xl w-12 h-12 bg-gradient-to-br from-primary to-accent shadow-lg hover:shadow-xl transition-shadow">
                    <Send className="w-5 h-5 text-white" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
