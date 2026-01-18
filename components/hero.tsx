"use client";

import { Button } from "@/components/ui/button";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { Github, Linkedin, Mail } from "lucide-react";

export function Hero() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Avatar/Profile Image Placeholder */}

          {/* Main Content */}
          <ScrollAnimation direction="up" delay={0.2}>
            <div className="space-y-4">
              <h1 className="font-serif text-4xl md:text-6xl font-bold text-gray-900">
                Hi, I&apos;m{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Lamrini Nawfal
                </span>
              </h1>
              <p className="font-mono text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                Full Stack Developer with a passion for creating modern and
                performant web applications
              </p>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Specialized in{" "}
                <span className="font-bold text-blue-500">React</span> ,{" "}
                <span className="font-bold text-blue-500">Next.js</span>,{" "}
                <span className="font-bold text-blue-500">TypeScript</span> and{" "}
                <span className="font-bold text-blue-500">shadcn/ui</span>. I
                transform your ideas into exceptional digital experiences.
              </p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation direction="up" delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={() => scrollToSection("#projects")}
                className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
              >
                View my projects
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => scrollToSection("#contact")}
                className="cursor-pointer border-2 border-gray-300 hover:border-blue-600 px-8 py-3"
              >
                Contact me
              </Button>
            </div>
          </ScrollAnimation>

          {/* Social Links */}
          <ScrollAnimation direction="up" delay={0.6}>
            <div className="flex justify-center space-x-6 pt-8">
              <a
                href="https://github.com/baguette1070"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/nawfal-lamrini-52b615326/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href="mailto:lamrininawfal11@gmail.com"
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
