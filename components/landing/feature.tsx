"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaClock, FaWallet } from "react-icons/fa";
import { VscMilestone } from "react-icons/vsc";
import { GridBackground } from "@/components/ui/grid-background";

const featureColors = [
  { icon: "text-[#2C65F4]", glow: "shadow-[#2C65F4]/20" },
  { icon: "text-[#AA3FF8]", glow: "shadow-[#AA3FF8]/20" },
  { icon: "text-[#FF44A1]", glow: "shadow-[#FF44A1]/20" },
];

const features = [
  {
    icon: VscMilestone,
    title: "Contract Milestones",
    description: "Break down work into structured, trackable payment stages.",
    benefits: [
      "Define deliverables and amounts per phase",
      "Funds are locked until milestones are triggered",
      "One contract, multiple payouts",
    ],
  },
  {
    icon: FaClock,
    title: "Time-Based Automation",
    description: "Set conditions once—let payments run on autopilot.",
    benefits: [
      "Release funds after preset durations",
      "Combine time + milestone logic",
      "Reduce manual oversight",
    ],
  },
  {
    icon: FaWallet,
    title: "Wallet-Native Escrow",
    description: "Trustless contracts with direct wallet-to-wallet flow.",
    benefits: [
      "Lock funds in smart contracts, not platforms",
      "No middlemen or third-party custody",
      "Built entirely on Stellar + Soroban",
    ],
  },
];

function FeatureCard({ feature, index, isActive, onHover }: any) {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      className="backdrop-blur-md bg-white/8 border border-white/10 rounded-xl p-6 hover:bg-white/12 transition-all duration-300 relative group overflow-hidden"
      role="listitem"
      aria-expanded={isActive}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div
          className={`bg-[#0B0F19]/60 border border-white/15 p-4 rounded-xl w-16 h-16 flex items-center justify-center flex-shrink-0 ${featureColors[index].glow}`}
          aria-hidden="true"
        >
          <feature.icon
            className={`h-8 w-8 ${featureColors[index].icon} filter drop-shadow-md`}
          />
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2 text-white transition-colors duration-300">
            {feature.title}
          </h3>
          <p className="text-[#A3B3CC] mb-4">{feature.description}</p>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              isActive ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
            }`}
            aria-hidden={!isActive}
          >
            <ul
              className="space-y-2 mt-4 border-t border-white/15 pt-4"
              role="list"
            >
              {feature.benefits.map((benefit: string, i: number) => (
                <li key={i} className="flex items-start" role="listitem">
                  <span
                    className={`${featureColors[index].icon} mr-2`}
                    aria-hidden="true"
                  >
                    •
                  </span>
                  <span className="text-[#A3B3CC]">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Features() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  return (
    <GridBackground className="bg-[#0B0F19] py-24">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6 text-white tracking-tight"
            role="heading"
            aria-level={2}
          >
            Powerful <span className="text-[#00C2FF]">Features</span> for Secure
            Payments
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-[#94A3B8] max-w-2xl mx-auto mb-16"
          >
            Everything you need for trustless transactions and secure
            milestone-based payments
          </motion.p>
        </div>

        <div className="space-y-6" role="list">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              feature={feature}
              index={index}
              isActive={activeFeature === index}
              onHover={setActiveFeature}
            />
          ))}
        </div>
      </div>
    </GridBackground>
  );
}