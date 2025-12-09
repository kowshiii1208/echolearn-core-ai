import { useState, useEffect } from "react";
import { Send, Sparkles, User } from "lucide-react";
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

  useEffect(() => {
    let messageIndex = 0;
    
    const showNextMessage = () => {
      if (messageIndex < demoMessages.length) {
        if (demoMessages[messageIndex].role === "assistant") {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            setVisibleMessages(prev => [...prev, demoMessages[messageIndex]]);
            messageIndex++;
            setTimeout(showNextMessage, 2000);
          }, 1500);
        } else {
          setVisibleMessages(prev => [...prev, demoMessages[messageIndex]]);
          messageIndex++;
          setTimeout(showNextMessage, 1000);
        }
      }
    };

    const timer = setTimeout(showNextMessage, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="order-2 lg:order-1">
            <span className="inline-block text-sm font-medium text-primary bg-secondary px-4 py-1.5 rounded-full mb-4">
              Conversational AI
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              Learn Through Natural Conversation
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Ask anything, the way you'd ask a friend. EchoLearn explains complex topics 
              using analogies and examples that make sense to you.
            </p>
            <ul className="space-y-4">
              {[
                "Patient explanations, never judgmental",
                "Adapts to your learning style",
                "Creates personalized examples",
                "Remembers your progress",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Chat mockup */}
          <div className="order-1 lg:order-2">
            <div className="bg-card rounded-3xl shadow-elevated p-6 max-w-md mx-auto">
              {/* Chat header */}
              <div className="flex items-center gap-3 pb-4 border-b border-border mb-4">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">EchoLearn Tutor</h4>
                  <p className="text-xs text-muted-foreground">Always here to help</p>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-4 min-h-[320px] max-h-[320px] overflow-y-auto">
                {visibleMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === "user" 
                          ? "bg-accent" 
                          : "bg-primary"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-4 h-4 text-accent-foreground" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-primary-foreground" />
                      )}
                    </div>
                    <div 
                      className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                        message.role === "user"
                          ? "bg-accent text-accent-foreground rounded-tr-sm"
                          : "bg-secondary text-secondary-foreground rounded-tl-sm"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
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
                  className="flex-1 bg-muted rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled
                />
                <Button size="icon" className="rounded-xl w-12 h-12">
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
