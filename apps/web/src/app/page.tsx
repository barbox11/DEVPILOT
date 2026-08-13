import Navbar from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Trust } from "@/components/sections/trust";
import { Problem } from "@/components/sections/problem";
import { Solution } from "@/components/sections/solution";
import { Features } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";
import { AICapabilities } from "@/components/sections/ai-capabilities";
import { Security } from "@/components/sections/security";
import { Workflow } from "@/components/sections/workflow";
import { CTA } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="contenido">
        <Hero />
        <Trust />
        <Problem />
        <Solution />
        <Features />
        <HowItWorks />
        <AICapabilities />
        <Security />
        <Workflow />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
