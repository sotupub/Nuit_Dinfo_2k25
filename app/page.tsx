import { LockKeyhole } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="flex items-center space-x-3">
            <LockKeyhole className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold">CyberSafe Hub</h1>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-2xl">
            Your interactive platform for cybersecurity awareness through gamification,
            interactive learning, and real-world scenarios.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mt-12">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative bg-card hover:bg-accent transition-colors rounded-lg p-6 space-y-4"
              >
                <feature.icon className="w-8 h-8 text-primary" />
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-8">
            <Link
              href="/register"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-lg font-medium"
            >
              Get Started
            </Link>
            <Link
              href="/demo"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-8 py-3 rounded-lg font-medium"
            >
              Try Demo
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

const features = [
  {
    title: "Interactive Scenarios",
    description: "Engage in real-world cybersecurity situations through immersive simulations.",
    icon: LockKeyhole,
  },
  {
    title: "AI-Powered Chatbot",
    description: "Get 24/7 guidance from our intelligent cybersecurity assistant.",
    icon: LockKeyhole,
  },
  {
    title: "Video Learning",
    description: "Watch interactive tutorials with practical cybersecurity tips.",
    icon: LockKeyhole,
  },
  {
    title: "Progress Tracking",
    description: "Monitor your learning journey with detailed analytics and achievements.",
    icon: LockKeyhole,
  },
];