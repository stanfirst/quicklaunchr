import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ForStartups } from "@/components/home/ForStartups";
import { ForInvestors } from "@/components/home/ForInvestors";
import { Features } from "@/components/home/Features";
import { Stats } from "@/components/home/Stats";
import { CTA } from "@/components/home/CTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <HowItWorks />
      <ForStartups />
      <ForInvestors />
      <Features />
      <Stats />
      <CTA />
    </main>
  );
}
