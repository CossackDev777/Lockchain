import { GridBackground } from "@/components/ui/grid-background";
import { PhoneMockup } from "@/components/ui/phone-mockup";
import { usePathname, useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import { FaCheckCircle, FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  const router = useRouter();
  const fadeInUp: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const fadeInRight: Variants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
  };

  return (
    <GridBackground className="bg-[#0B0F19] py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl pt-16 md:pt-20 lg:pt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[75vh] lg:min-h-[65vh]">
          {/* Left column - Text content */}
          <motion.div
            className="text-left flex flex-col justify-center"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            {/* Award announcement pill */}
            <motion.a
              href="https://medium.com/stellar-community/scf-kickstart-10-recap-851a85e74639"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-3 py-1 mb-5 md:mb-6 max-w-max mx-auto lg:mx-0 bg-[#1A2138] border border-[#00C2FF]/30 rounded-full text-[#00C2FF] font-medium text-xs animate-subtle-pulse relative"
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{
                boxShadow: "0 0 10px rgba(0, 194, 255, 0.15)",
              }}
            >
              <FaCheckCircle
                className="mr-1.5 h-3.5 w-3.5 text-[#00C2FF]"
                strokeWidth={1.5}
              />
              <span className="relative z-10">
                SCF Kickstart #10 Award Winner
              </span>
              <FaArrowRight
                className="ml-1.5 h-3.5 w-3.5 text-[#00C2FF]"
                strokeWidth={1.5}
              />
              <span className="absolute inset-0 rounded-full bg-[#00C2FF]/5 animate-pulse-glow"></span>
            </motion.a>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white tracking-tight">
              Lock funds with <span style={{ color: "#00D0FF" }}>trust</span>.
            </h1>

            <p className="mt-5 md:mt-6 text-lg md:text-xl text-[#94A3B8] max-w-lg">
              Create milestone-based contracts on Stellar blockchain and share
              payment links to send or receive funds securely.
            </p>

            <div className="mt-7 md:mt-8 flex flex-wrap gap-4">
              <motion.button
                onClick={() => router.push("/contracts")}
                className="bg-[#00C2FF]/10 backdrop-blur-sm border border-[#00C2FF]/30 text-[#00C2FF] rounded-md px-8 py-4 font-medium text-lg flex items-center hover:bg-[#00C2FF]/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                
              >
                Connect Wallet to Get Started
                <FaArrowRight className="ml-2 h-5 w-5" />
              </motion.button>

              <motion.button
                onClick={() =>
                  window.open("https://docs.lockup.finance/", "_blank")
                }
                className="border border-white/10 text-white rounded-md px-8 py-4 font-medium text-lg flex items-center hover:bg-white/5 hover:border-white/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Build Now
              </motion.button>
            </div>

            {/* Powered by Stellar */}
            <div className="mt-8 md:mt-10">
              <Link
                href="https://stellar.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Powered%20by-1zngnoCH5nizpT5YGK5sunx85Hq5uW.png"
                  alt="Powered by Stellar"
                  width={180}
                  height={30}
                  className="h-auto opacity-70 hover:opacity-100 transition-opacity"
                  priority
                  onError={(e) => {
                    console.error("Failed to load Stellar image");
                    e.currentTarget.style.display = "none";
                  }}
                />
              </Link>
            </div>
          </motion.div>

          {/* Right column - Phone mockup */}
          <motion.div
            className="hidden lg:flex justify-center lg:justify-end items-center h-full"
            variants={fadeInRight}
            initial="initial"
            animate="animate"
            style={{ position: "relative", zIndex: 5 }}
          >
            <PhoneMockup />
          </motion.div>
        </div>
      </div>
    </GridBackground>
  );
}
