import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { ChatPreview } from "@/components/ChatPreview";
import { HowItWorks } from "@/components/HowItWorks";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <ChatPreview />
          <HowItWorks />
          <CTA />
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
