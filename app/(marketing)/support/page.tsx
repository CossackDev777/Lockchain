"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { AppLayout } from "@/components/layouts/app-layout";
import { LuFileText } from "react-icons/lu";
import { BiLoaderCircle, BiHelpCircle } from "react-icons/bi";
import { TbExternalLink } from "react-icons/tb";
import { PageTransition } from "@/components/ui/page-transition";
import { CleanAccordion } from "@/components/ui/clean-accordion";
import { faqItems } from "@/lib/faq";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SectionTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`text-lg lg:text-xl font-semibold mt-10 text-white ${className}`}
    >
      {children}
    </h2>
  );
}

export default function SupportPage() {
  const router = useRouter();
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [formData, setFormData] = useState({
    walletId: "",
    email: "",
    topic: "Contract Dispute",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, topic: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Support ticket submitted successfully!");
      setFormData({
        walletId: "",
        email: "",
        topic: "Contract Dispute",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting support ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <PageTransition>
        <DashboardLayout>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-[#1a1d25] p-4 sm:p-6 border border-[#23262e] rounded-lg flex flex-col">
                <div className="flex items-center mb-4">
                  <LuFileText className="h-5 w-5 text-[#00d0ff] mr-2" />
                  <h3 className="text-white font-medium">Documentation</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Our comprehensive documentation covers everything from getting
                  started to advanced contract features.
                </p>
                <Button
                  variant="outline" // Use the outline variant for the button
                  size="default" // Default size for the button
                  className="mt-auto border-[#4699ac] text-[#00d0ff] hover:bg-[#2f3b4e]" // Custom styles for border and hover effects
                  onClick={() =>
                    window.open("https://docs.lockup.com", "_blank")
                  }
                >
                  View Documentation
                  <TbExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-8">
              <SectionTitle>Frequently Asked Questions</SectionTitle>
              <div className="mt-4">
                <CleanAccordion items={faqItems} />
              </div>
            </div>

            <div className="mt-8">
              <SectionTitle>Submit a Support Ticket</SectionTitle>
              <div className="mt-4 bg-[#1a1d25] p-4 sm:p-6 border border-[#23262e] rounded-lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label
                      htmlFor="walletId"
                      className="block text-sm font-medium text-white"
                    >
                      Wallet ID
                    </label>
                    <Input
                      id="walletId"
                      name="walletId"
                      value={formData.walletId}
                      onChange={handleInputChange}
                      className="w-full bg-[#1e293b] text-white border-[#23262e] placeholder:text-gray-400"
                      placeholder="Your wallet address"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-white"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-[#1e293b] text-white border-[#23262e] placeholder:text-gray-400"
                      placeholder="Your email address"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="topic"
                      className="block text-sm font-medium text-white"
                    >
                      Issue Type
                    </label>
                    <Select
                      value={formData.topic}
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger className="w-full bg-[#1e293b] text-white border-[#23262e]">
                        <SelectValue placeholder="Select an issue type" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1d25] text-white border-[#23262e]">
                        <SelectItem value="Contract Dispute">
                          Contract Dispute
                        </SelectItem>
                        <SelectItem value="Funds Not Released">
                          Funds Not Released
                        </SelectItem>
                        <SelectItem value="Recipient Didn't Complete Work">
                          Recipient Didn't Complete Work
                        </SelectItem>
                        <SelectItem value="Wallet Connection / Transaction Issue">
                          Wallet Connection / Transaction Issue
                        </SelectItem>
                        <SelectItem value="General Question or Feedback">
                          General Question or Feedback
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-white"
                    >
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full bg-[#1e293b] text-white border-[#23262e] placeholder:text-gray-400"
                      placeholder="Describe your issue in detail. For contract disputes, please include the contract ID."
                      rows={4}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant={"outline"}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto text-[#00d0ff] bg-[#2e3033] hover:text-[#33d9ff]"
                  >
                    {isSubmitting ? (
                      <>
                        <BiLoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Request"
                    )}
                  </Button>
                </form>
              </div>
            </div>

            <div className="mt-8 p-4 sm:p-6 rounded-lg bg-[#1a1d25] border border-[#23262e]">
              <div className="flex items-start">
                <BiHelpCircle className="h-5 w-5 text-[#00d0ff] mr-3 mt-1" />
                <div>
                  <h3 className="text-white font-semibold text-base sm:text-lg mb-2">
                    Still Need Help?
                  </h3>
                  <p className="text-gray-400 text-sm sm:text-base mb-4">
                    For urgent matters or complex disputes, please submit a
                    ticket above and our team will respond within 24 hours.
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    All contract disputes are reviewed according to the terms
                    established in the original smart contract agreement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </PageTransition>
    </AppLayout>
  );
}
