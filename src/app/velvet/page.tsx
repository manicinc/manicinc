export const metadata = {
    title: "Velvet Web - AI-Powered Community for Innovators",
    description: "Join an innovative community of founders, creators, and developers. Get AI-powered insights, project management, and advanced code analysis tools.",
  };
  
  import VelvetHero from "@/components/VelvetHero";
  import VelvetFeatures from "@/components/VelvetFeatures";
  import VelvetPricing from "@/components/VelvetPricing";
  import DefaultLayout from "@/app/velvet/layout";
  
  export default function Home() {
    return (
      <DefaultLayout>
        <VelvetHero />
        <VelvetFeatures />
        <VelvetPricing />
      </DefaultLayout>
    );
  }
    
  
