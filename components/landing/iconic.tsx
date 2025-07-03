"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import { useRef } from "react"

function ListItem({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <li className="flex items-start">
      <div
        className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full mr-3 mt-1"
        style={{ backgroundColor: "#C68D2C" }}
      >
        <span className="text-white font-bold text-sm">{number}</span>
      </div>
      <span className="text-gray-200">
        <strong className="text-white">{title}</strong> — {description}
      </span>
    </li>
  )
}

function BackgroundLayer({ className, style }: { className: string; style: React.CSSProperties }) {
  return <div className={`absolute inset-0 ${className}`} style={style} />
}

export function Iconic() {
  const sectionRef = useRef<HTMLDivElement>(null)

  return (
    <section ref={sectionRef} className="relative w-full py-24 overflow-hidden">
      <BackgroundLayer
        className="z-0"
        style={{ background: "linear-gradient(to bottom right, #2B1E11, #3A2A17)" }}
      />

      <BackgroundLayer
        className="z-[1]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(90, 70, 45, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(90, 70, 45, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          backgroundPosition: "center center",
        }}
      />

      <BackgroundLayer
        className="z-[2] pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.8) 100%),
            linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.5) 100%),
            linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.5) 100%)
          `,
        }}
      />

      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
        <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12 lg:gap-16">
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="relative w-full max-w-[500px] mx-auto">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/May%201%2C%202025%2C%2011_37_14%20PM.jpg-NyYXpdum7DSbWbw6CXVsRBqNedd9yN.jpeg"
                alt="Armored bull carrying Stellar coin"
                width={800}
                height={800}
                className="w-full h-auto rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
                priority
              />
            </div>
          </motion.div>

          <motion.div
            className="w-full md:w-1/2 text-center md:text-left"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6" style={{ letterSpacing: "0.02em" }}>
              A New Era of Trust
            </h2>

            <p className="text-xl md:text-2xl text-gray-300 font-light mb-8" style={{ lineHeight: "1.4" }}>
              Stellar is forging the future of secure, trustless payments built to power a new financial era.
            </p>

            <ul className="space-y-4 mb-8">
              <ListItem
                number={1}
                title="Trustless Payments"
                description="Eliminate intermediaries with secure, direct transactions between parties."
              />
              <ListItem
                number={2}
                title="New Financial Primitives"
                description="Build the foundation for next-generation financial applications."
              />
              <ListItem
                number={3}
                title="Decentralized Infrastructure"
                description="Access a global network built for transparency and security."
              />
            </ul>

            <p className="text-gray-400 uppercase text-sm tracking-widest">Secure. Transparent. Decentralized.</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}