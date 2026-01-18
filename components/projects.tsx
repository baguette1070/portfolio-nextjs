"use client";

import golf from "@/app/assets/golf.png";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export function Projects() {
  const projects = [
    {
      title: "WolfCars",
      description:
        "A car dealership website where you can buy location and rent cars",

      technologies: [
        "Next.js",
        "TypeScript",
        "Stripe",
        "Prisma - SQLite",
        "Tailwind CSS",
      ],
      github: "https://github.com/baguette1070",
      live: "https://ecommerce-platform.vercel.app",
      featured: true,
    },
  ];

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation direction="up" delay={0.2}>
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              My project
            </h2>
            <p className="font-mono text-xl text-gray-600 max-w-3xl mx-auto">
              Discover my recent projects
            </p>
          </div>
        </ScrollAnimation>

        {/* Featured Projects */}
        <div className="mb-16 ">
          <div className="flex justify-center">
            <ScrollAnimation
              delay={0.2}
              className="w-1/2 gap-8 hover:shadow-xl transition duration-300"
            >
              {projects
                .filter((p) => p.featured)
                .map((project) => (
                  <div
                    key={project.title}
                    className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={golf}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="p-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-3">
                        {project.title}
                      </h4>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex space-x-3">
                        <Link className="cursor-pointer" href={project.live}>
                          <Button className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            <Eye className="h-4 w-4 mr-2" />
                            View project
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </section>
  );
}
