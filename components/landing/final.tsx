"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { GridBackground } from "@/components/ui/grid-background";
import { useRouter } from "next/navigation";

function MotionButton({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className: string;
  onClick?: () => void;
}) {
  return (
    <motion.button
      className={`px-6 py-3 rounded-md font-medium flex items-center justify-center gap-2 transition-all duration-300 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}

export function Final() {
  const router = useRouter();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <GridBackground
      className="bg-[#0B0F19] py-24"
      color="#00C2FF"
      lineOpacity={0.05}
      dotOpacity={0.1}
      spacing={40}
    >
      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="max-w-3xl mx-auto backdrop-blur-md bg-white/5 border border-white/10 p-10 rounded-xl text-center relative overflow-hidden"
        >
          <div className="relative z-10">
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold mb-6 text-white tracking-tight"
            >
              Ready to send funds{" "}
              <span className="text-[#00C2FF]">securely</span>?
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-[#94A3B8] mb-10"
            >
              Start creating trustless contracts today and experience the future
              of secure payments.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <MotionButton
                className="bg-[#00C2FF]/10 hover:bg-[#00C2FF]/20 border border-[#00C2FF]/30 text-[#00C2FF] backdrop-blur-sm sm:w-auto w-full"
                onClick={() => router.push("/app")}
              >
                Launch App
                <FaArrowRight className="ml-2 h-5 w-5" />
              </MotionButton>
              <MotionButton className="bg-white/5 hover:bg-white/10 border border-white/20 text-white backdrop-blur-sm">
                Explore the Docs
                <FaArrowRight className="ml-2 h-5 w-5" />
              </MotionButton>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </GridBackground>
  );
}
