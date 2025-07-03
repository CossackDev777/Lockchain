export interface FAQItem {
    question: string
    answer: string
  }
  
  export const faqItems: FAQItem[] = [
    {
      question: "What happens when a proposal is accepted?",
      answer:
        "Once a proposal is accepted, funds are locked in a Soroban smart contract until released manually or on the set schedule. This creates a secure escrow that protects both parties while ensuring funds are available when conditions are met.",
    },
    {
      question: "Can I cancel or dispute a contract?",
      answer:
        "If the contract has not yet been completed or all milestones haven't been released, you can file a dispute through our support ticket system. Our team will review the contract terms and communication history to help resolve the issue fairly.",
    },
    {
      question: "How does fund release work?",
      answer:
        "Funds can be released manually by the sender or automatically based on a schedule, depending on how the contract was set up. For manual release, the sender approves each milestone. For scheduled releases, the smart contract automatically transfers funds on the specified dates unless canceled.",
    },
    {
      question: "What if the recipient didn't deliver the work?",
      answer:
        "Submit a ticket under \"Recipient Didn't Complete Work\" so our team can assist in resolving the dispute. We'll review the contract terms, any submitted evidence, and work with both parties to reach a fair resolution. In cases where work clearly wasn't delivered, funds can be returned to the sender.",
    },
    {
      question: "What blockchain does LockUp use?",
      answer:
        "LockUp contracts run on the Stellar network using Soroban smart contracts for secure, trustless agreement enforcement. Stellar provides fast, low-cost transactions while Soroban smart contracts ensure that contract terms are executed exactly as specified without requiring trust between parties.",
    },
    {
      question: "How secure are LockUp contracts?",
      answer:
        "LockUp contracts are built on Soroban smart contracts which undergo rigorous security audits. The code is immutable once deployed, meaning no one (not even us) can alter the terms after creation. All transactions are verified by the Stellar network's consensus protocol, providing multiple layers of security.",
    },
  ] 