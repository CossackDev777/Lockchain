"use client"
import Image from "next/image"
import { FaCheck } from "react-icons/fa"
import { GridBackground } from "@/components/ui/grid-background"

// Reusable FeatureItem component
function FeatureItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 mt-1">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500">
          <FaCheck className="h-4 w-4 text-white" />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2 text-blue-300">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
    </div>
  )
}

export function Soroban() {
  return (
    <GridBackground className="bg-[#0B0F19] py-24">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Soroban at the Core</h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            LockUp uses Soroban to power secure, automated contracts that run on-chain—instantly, predictably, and
            without intermediaries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full opacity-30"></div>
              <div className="relative z-10">
                <Image
                  src="/soroban.png"
                  alt="Soroban Monument"
                  width={500}
                  height={500}
                  className="w-full h-auto max-w-md mx-auto rounded-lg object-cover"
                />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <FeatureItem
              title="Instant, Predictable Execution"
              description="Each milestone triggers exactly as defined—no gas fees, no bottlenecks, no delays."
            />
            <FeatureItem
              title="Composable Contract Templates"
              description="Grants, audits, royalties, and more—LockUp's contracts are modular and upgradeable by design, powered by Soroban's WebAssembly architecture."
            />
            <FeatureItem
              title="Built for Real-World Payment Flows"
              description="Whether it's scheduled releases, fiat on-ramps, or multi-user contracts, Soroban enables us to scale LockUp into a full suite of programmable agreement tools."
            />
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-lg font-medium text-blue-200">
            Everything LockUp does—from escrow to payouts—runs securely on Soroban.
          </p>
        </div>
      </div>
    </GridBackground>
  )
}