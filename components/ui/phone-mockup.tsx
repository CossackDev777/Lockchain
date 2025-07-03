"use client"

import { motion } from "framer-motion"
import { useRef, useEffect, useState, useCallback, memo } from "react"
import Image from "next/image"
import { useInView } from "framer-motion"

// Memoized cursor component
const Cursor = memo(({ visible }: { visible: boolean }) => (
  <motion.div
    className={`w-[1px] h-4 bg-black ml-[1px] ${visible ? "opacity-100" : "opacity-0"}`}
  />
))
Cursor.displayName = 'Cursor'

// Memoized release method option component
const ReleaseMethodOption = memo(({ 
  type, 
  isSelected, 
  title, 
  description 
}: { 
  type: "manual" | "automated"
  isSelected: boolean
  title: string
  description: string 
}) => (
  <div
    className={`p-3 border rounded-md transition-all duration-300 ${
      isSelected ? "border-[#23c2fd] bg-[#23c2fd]/5" : "border-gray-200 bg-white"
    }`}
  >
    <div className="flex items-start">
      <div
        className={`w-4 h-4 mt-0.5 rounded-full border-2 flex items-center justify-center transition-colors ${
          isSelected ? "border-[#23c2fd]" : "border-gray-300"
        }`}
      >
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 rounded-full bg-[#23c2fd]"
          />
        )}
      </div>
      <div className="ml-2">
        <div className="text-xs font-medium text-[#222]">{title}</div>
        <p className="text-[10px] text-gray-600">{description}</p>
      </div>
    </div>
  </div>
))
ReleaseMethodOption.displayName = 'ReleaseMethodOption'

// Memoized input field component
const InputField = memo(({ 
  label, 
  value, 
  placeholder, 
  showCursor, 
  cursorVisible,
  suffix
}: { 
  label: string
  value: string
  placeholder: string
  showCursor: boolean
  cursorVisible: boolean
  suffix?: string
}) => (
  <div className="mb-4">
    <label className="block text-xs font-medium text-[#222] mb-1">{label}</label>
    <div className="h-10 rounded-md border border-gray-300 px-3 py-2 bg-white flex items-center">
      <span className="text-sm text-[#111] font-medium">{value}</span>
      {showCursor && <Cursor visible={cursorVisible} />}
      {!value && !showCursor && <span className="text-sm text-gray-400">{placeholder}</span>}
      {value && suffix && <span className="text-sm text-[#111] ml-1">{suffix}</span>}
    </div>
  </div>
))
InputField.displayName = 'InputField'

// Memoized textarea field component
const TextareaField = memo(({ 
  label, 
  value, 
  placeholder, 
  showCursor, 
  cursorVisible 
}: { 
  label: string
  value: string
  placeholder: string
  showCursor: boolean
  cursorVisible: boolean
}) => (
  <div className="mb-4">
    <label className="block text-xs font-medium text-[#222] mb-1">{label}</label>
    <div className="h-20 rounded-md border border-gray-300 px-3 py-2 bg-white">
      <span className="text-sm text-[#111] font-medium">{value}</span>
      {showCursor && <Cursor visible={cursorVisible} />}
      {!value && !showCursor && <span className="text-sm text-gray-400">{placeholder}</span>}
    </div>
  </div>
))
TextareaField.displayName = 'TextareaField'

// Memoized button component
const Button = memo(({ 
  primary, 
  children 
}: { 
  primary?: boolean
  children: React.ReactNode 
}) => (
  <button 
    className={`${
      primary 
        ? "bg-[#23c2fd] text-white shadow-md" 
        : "bg-gray-100 text-gray-700"
    } text-sm py-2.5 rounded-full font-medium`}
  >
    {children}
  </button>
))
Button.displayName = 'Button'

export function PhoneMockup() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, margin: "-5%" })
  const [animationStep, setAnimationStep] = useState(0)
  const [contractTitle, setContractTitle] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [releaseMethod, setReleaseMethod] = useState<"manual" | "automated">("manual")
  const [cursorVisible, setCursorVisible] = useState(true)

  const typeText = useCallback(async (
    text: string,
    setter: (text: string) => void,
    delay: number = 25
  ) => {
    for (let i = 0; i <= text.length; i++) {
      setter(text.substring(0, i))
      await new Promise((r) => setTimeout(r, delay + Math.random() * 15))
    }
  }, [])

  useEffect(() => {
    if (!isInView) return

    let isMounted = true
    let animationTimeout: NodeJS.Timeout

    const cursorInterval = setInterval(() => {
      if (isMounted) {
        setCursorVisible((prev) => !prev)
      }
    }, 530)

    const sequence = async () => {
      if (!isMounted) return

      setContractTitle("")
      setDescription("")
      setAmount("")
      setReleaseMethod("manual")
      setAnimationStep(0)

      await new Promise((r) => setTimeout(r, 300))

      if (!isMounted) return
      setAnimationStep(1)
      await typeText("Website Design", setContractTitle)
      await new Promise((r) => setTimeout(r, 400))

      if (!isMounted) return
      setAnimationStep(2)
      await typeText("Design and build responsive site", setDescription, 20)
      await new Promise((r) => setTimeout(r, 400))

      if (!isMounted) return
      setAnimationStep(3)
      await typeText("2500", setAmount, 35)
      await new Promise((r) => setTimeout(r, 400))

      if (!isMounted) return
      setAnimationStep(4)
      setReleaseMethod("automated")
      await new Promise((r) => setTimeout(r, 500))
      if (!isMounted) return
      setReleaseMethod("manual")
      await new Promise((r) => setTimeout(r, 700))

      if (!isMounted) return
      await new Promise((r) => setTimeout(r, 800))

      if (isMounted) {
        animationTimeout = setTimeout(sequence, 300)
      }
    }

    sequence()

    return () => {
      isMounted = false
      clearTimeout(animationTimeout)
      clearInterval(cursorInterval)
      setContractTitle("")
      setDescription("")
      setAmount("")
      setReleaseMethod("manual")
      setAnimationStep(0)
    }
  }, [isInView, typeText])

  return (
    <motion.div
      className="relative w-[320px] h-[650px]"
      ref={containerRef}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <div className="absolute inset-0 bg-[#1A1A1A] rounded-[55px] shadow-[0_0_60px_rgba(0,0,0,0.3)] overflow-hidden">
        <div className="absolute inset-[3px] rounded-[52px] border-[14px] border-black overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#23c2fd]/20 to-[#23c2fd]/10 z-0">
            <div className="absolute inset-0 animate-pulse bg-[#23c2fd]/10"></div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 z-10 pointer-events-none"></div>

          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[160px] h-[34px] bg-black rounded-b-[18px] z-20 flex items-center justify-center">
            <div className="w-[10px] h-[10px] rounded-full bg-gray-700 mr-8"></div>
            <div className="w-[40px] h-[5px] bg-gray-700 rounded-full"></div>
            <div className="w-[10px] h-[10px] rounded-full bg-gray-700 ml-8"></div>
          </div>

          <div className="absolute top-0 left-0 right-0 h-[44px] bg-black z-10 flex justify-between px-8 items-center">
            <div className="text-white text-[12px] font-medium">9:41</div>
            <div className="flex items-center space-x-2">
              <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M1 4.5C1 2.567 2.567 1 4.5 1H13.5C15.433 1 17 2.567 17 4.5V7.5C17 9.433 15.433 11 13.5 11H4.5C2.567 11 1 9.433 1 7.5V4.5Z"
                  stroke="white"
                  strokeWidth="2"
                />
                <rect x="2" y="2" width="14" height="8" rx="2.5" fill="white" />
              </svg>
              <div className="text-white text-[12px] font-medium">100%</div>
            </div>
          </div>

          <div className="absolute inset-0 bg-white overflow-hidden shadow-[inset_0_0_30px_rgba(35,194,253,0.15)]">
            <div className="relative w-full h-full overflow-hidden pt-[44px]">
              <div className="w-full bg-white px-4 py-2 flex items-center border-b">
                <div className="w-6 h-6 mr-2">
                  <Image
                    src="/logo/lockup-logo.png"
                    alt="LockUp Logo"
                    width={24}
                    height={24}
                    style={{
                      filter:
                        "brightness(0) saturate(100%) invert(59%) sepia(83%) saturate(1582%) hue-rotate(165deg) brightness(101%) contrast(101%)",
                    }}
                    priority
                  />
                </div>
                <div className="text-base font-semibold text-black">Create Contract</div>
              </div>

              <div className="px-4 py-4">
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-[#111] mb-2">Contract Details</h3>
                  <p className="text-xs text-gray-500 mb-4">Enter the details for your escrow contract</p>

                  <InputField
                    label="Contract Title"
                    value={contractTitle}
                    placeholder="Enter contract title"
                    showCursor={animationStep === 1}
                    cursorVisible={cursorVisible}
                  />

                  <TextareaField
                    label="Description"
                    value={description}
                    placeholder="Enter description"
                    showCursor={animationStep === 2}
                    cursorVisible={cursorVisible}
                  />

                  <InputField
                    label="Total Amount (XLM)"
                    value={amount}
                    placeholder="Enter amount"
                    showCursor={animationStep === 3}
                    cursorVisible={cursorVisible}
                    suffix="XLM"
                  />
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-[#111] mb-2">Release Method</h3>

                  <ReleaseMethodOption
                    type="manual"
                    isSelected={releaseMethod === "manual"}
                    title="Manual Release"
                    description="You manually release funds when work is completed"
                  />

                  <ReleaseMethodOption
                    type="automated"
                    isSelected={releaseMethod === "automated"}
                    title="Automated Release"
                    description="Funds will be released automatically on the specified date"
                  />

                  {animationStep === 4 && (
                    <motion.div
                      className={`absolute bottom-4 right-4 w-3 h-3 rounded-full bg-[#23c2fd] ${
                        cursorVisible ? "opacity-70" : "opacity-100"
                      }`}
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 1.5,
                      }}
                    />
                  )}
                </div>

                <div className="flex flex-col gap-3 mt-8">
                  <Button primary>Create Contract</Button>
                  <Button>Save Draft</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-[-2px] top-[120px] w-[4px] h-[30px] bg-[#1A1A1A] rounded-r-lg"></div>
      <div className="absolute left-[-2px] top-[160px] w-[4px] h-[60px] bg-[#1A1A1A] rounded-r-lg"></div>

      <div className="absolute right-[-2px] top-[140px] w-[4px] h-[40px] bg-[#1A1A1A] rounded-l-lg"></div>

      <div className="absolute inset-[17px] rounded-[38px] shadow-[inset_0_0_10px_rgba(0,0,0,0.2)] pointer-events-none z-30"></div>

      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-[80%] h-[25px] bg-black/20 blur-xl rounded-full"></div>
    </motion.div>
  )
}
