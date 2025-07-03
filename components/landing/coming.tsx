"use client";
import { GridBackground } from "@/components/ui/grid-background";
import { useEffect, useRef, useState } from "react";

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <div
      className={`backdrop-blur-sm border rounded-xl p-6 md:p-7 w-full shadow-lg transition-all duration-700 ${className}`}
    >
      {children}
    </div>
  );
}

export function Coming() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <GridBackground className="bg-[#0B0F19] py-16 md:py-20">
      <div
        className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10"
        ref={sectionRef}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          <div className="flex items-center justify-center">
            <Card
              className={`bg-white/[0.02] border-white/[0.05] rounded-2xl shadow-black/10 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
                  Hybrid by Design
                </h2>
                <p className="text-base md:text-lg text-white/80">
                  A hybrid approach: user-facing contracts plus developer
                  infrastructure.
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-base md:text-lg leading-relaxed text-gray-300">
                  LockUp combines a user-friendly interface for trustless
                  payments with a powerful developer layer underneath.
                </p>
                <p className="text-base md:text-lg leading-relaxed text-gray-300">
                  Teams can launch contracts via the app, automate workflows
                  with SDKs, or embed smart contract logic directly into their
                  stack.
                </p>
              </div>
            </Card>
          </div>

          <div className="flex items-center justify-center">
            <Card
              className={`bg-[#131A2E] border-white/10 text-center shadow-[#23c2fd]/5 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="max-w-md mx-auto py-4">
                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-[#23c2fd]/10 text-[#23c2fd] mb-3">
                  Developer Access
                </span>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-white">
                  Want to build with LockUp?
                </h3>
                <p className="text-base md:text-lg mb-6 text-white/80">
                  Explore our GitBook for API docs, contract logic, and
                  integration guides.
                </p>
                <a
                  href="https://docs.lockup.finance"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="group relative bg-[#00C2FF]/10 backdrop-blur-sm border border-[#00C2FF]/30 text-[#00C2FF] hover:bg-[#00C2FF]/20 w-full sm:w-auto transition-all duration-300 rounded-md px-6 py-2.5 font-medium">
                    Explore the Docs →
                  </button>
                </a>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </GridBackground>
  );
}
