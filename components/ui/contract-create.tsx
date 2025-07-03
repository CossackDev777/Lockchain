"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import {
  FaPlus,
  FaTrashAlt,
  FaTimes,
  FaCopy,
  FaArrowRight,
} from "react-icons/fa";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useWallet } from "../wallet-provider";
import * as StellarSDK from "@stellar/stellar-sdk";

interface Milestone {
  id: string;
  title: string;
  amount: string;
  releaseDate?: Date;
  description?: string;
}

interface CreateContractDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateContractDrawer({
  isOpen,
  onClose,
}: CreateContractDrawerProps) {
  const [contractTitle, setContractTitle] = useState("");
  const [contractDescription, setContractDescription] = useState("");
  const [recipientMethod, setRecipientMethod] = useState("link");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("XLM");
  const [releaseMethod, setReleaseMethod] = useState("manual");
  const [releaseDate, setReleaseDate] = useState<Date>();
  const [useMilestones, setUseMilestones] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: "1", title: "Initial Payment", amount: "", releaseDate: undefined },
    { id: "2", title: "Final Payment", amount: "", releaseDate: undefined },
  ]);

  // Preview state
  const [showPreview, setShowPreview] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formValid, setFormValid] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );

  const { publicKey } = useWallet();

  const validateStellarAddress = (address: string): boolean => {
    return StellarSDK.StrKey.isValidEd25519PublicKey(address);
  };

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setContractTitle("");
      setContractDescription("");
      setRecipientMethod("link");
      setRecipientAddress("");
      setAmount("");
      setCurrency("XLM");
      setReleaseMethod("manual");
      setReleaseDate(undefined);
      setUseMilestones(false);
      setMilestones([
        {
          id: "1",
          title: "Initial Payment",
          amount: "",
          releaseDate: undefined,
        },
        { id: "2", title: "Final Payment", amount: "", releaseDate: undefined },
      ]);
      setShowPreview(false);
      setGeneratedLink("");
      setErrors({});
      setFormValid(false);
      setTouchedFields({});
    }
  }, [isOpen]);

  const markAsTouched = (fieldName: string) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
  };

  const totalMilestoneAmount = useMilestones
    ? milestones.reduce(
        (sum, milestone) => sum + (Number.parseFloat(milestone.amount) || 0),
        0
      )
    : 0;
  const remainingAmount = Number.parseFloat(amount) - totalMilestoneAmount;

  useEffect(() => {
    if (!useMilestones || milestones.length === 0 || !amount) return;

    const anyAmountSet = milestones.some((m) => m.amount !== "");
    if (!anyAmountSet) {
      const evenAmount = (
        Number.parseFloat(amount) / milestones.length
      ).toFixed(2);
      setMilestones(milestones.map((m) => ({ ...m, amount: evenAmount })));
    }
  }, [amount, useMilestones]);

  // Validate form
  useEffect(() => {
    const newErrors: Record<string, string> = {};

    if (!contractTitle.trim()) {
      newErrors.contractTitle = "Contract title is required";
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      newErrors.amount = "Valid amount is required";
    }

    if (recipientMethod === "address") {
      if (!recipientAddress.trim()) {
        newErrors.recipientAddress = "Recipient address is required";
      } else if (!validateStellarAddress(recipientAddress)) {
        newErrors.recipientAddress = "Invalid Stellar wallet address";
      }
    }

    if (releaseMethod === "auto" && !releaseDate) {
      newErrors.releaseDate = "Release date is required";
    }

    if (useMilestones) {
      let milestoneTotal = 0;

      milestones.forEach((milestone, index) => {
        // Validate milestone title
        if (!milestone.title.trim()) {
          newErrors[`milestone-${index}-title`] = "Title is required";
        }

        // Validate milestone release date for auto release
        if (releaseMethod === "auto" && !milestone.releaseDate) {
          newErrors[`milestone-${index}-date`] = "Date is required";
        }

        milestoneTotal += Number.parseFloat(milestone.amount) || 0;
      });

      if (milestoneTotal > Number.parseFloat(amount)) {
        newErrors.milestoneTotal = `Milestone amounts exceed the total contract amount (${milestoneTotal.toFixed(
          2
        )} ${currency} > ${amount} ${currency})`;
      }

      if (Math.abs(milestoneTotal - Number.parseFloat(amount)) > 0.01) {
        newErrors.milestoneTotal = `Milestone amounts must equal the total contract amount (${(
          Number.parseFloat(amount) - milestoneTotal
        ).toFixed(2)} ${currency} remaining)`;
      }
    }

    // Update errors and form validity
    setErrors(newErrors);
    setFormValid(Object.keys(newErrors).length === 0);
  }, [
    contractTitle,
    amount,
    recipientMethod,
    recipientAddress,
    releaseMethod,
    releaseDate,
    useMilestones,
    milestones,
    remainingAmount, // Add this explicitly
    currency,
  ]);

  // Add a milestone
  const addMilestone = () => {
    if (milestones.length >= 5) return;

    const newId = (milestones.length + 1).toString();
    setMilestones([
      ...milestones,
      {
        id: newId,
        title: `Milestone ${newId}`,
        amount: "",
        releaseDate: undefined,
      },
    ]);
  };

  // Remove a milestone
  const removeMilestone = (id: string) => {
    if (milestones.length <= 2) return;
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  // Update milestone
  const updateMilestone = (id: string, field: keyof Milestone, value: any) => {
    setMilestones(
      milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  // Handle preview
  const handlePreview = () => {
    // Mark all fields as touched to show validation errors
    const allFields = {
      contractTitle: true,
      amount: true,
      recipientAddress: recipientMethod === "address",
      releaseDate: releaseMethod === "auto" && !useMilestones,
      ...milestones.reduce(
        (acc, _, index) => ({
          ...acc,
          [`milestone-${index}-title`]: useMilestones,
          [`milestone-${index}-date`]:
            useMilestones && releaseMethod === "auto",
        }),
        {}
      ),
    };
    setTouchedFields(allFields);

    // Only proceed if form is valid
    if (!formValid) return;

    // Generate a fake shareable link for demo purposes
    if (recipientMethod === "link") {
      setGeneratedLink(
        `https://lockup.app/proposal/${Math.random()
          .toString(36)
          .substring(2, 10)}`
      );
    }
    setShowPreview(true);
  };

  const handleSendProposal = async () => {
    // Mark all fields as touched to show validation errors
    const allFields = {
      contractTitle: true,
      amount: true,
      recipientAddress: recipientMethod === "address",
      releaseDate: releaseMethod === "auto" && !useMilestones,
      ...milestones.reduce(
        (acc, _, index) => ({
          ...acc,
          [`milestone-${index}-title`]: useMilestones,
          [`milestone-${index}-date`]:
            useMilestones && releaseMethod === "auto",
        }),
        {}
      ),
    };
    setTouchedFields(allFields);

    // Only proceed if form is valid
    if (!formValid) return;

    // Prepare the contract data
    const contractData = {
      contractCode: `${Math.random().toString(36).substring(2, 10)}`,
      title: contractTitle,
      description: contractDescription,
      amount: parseFloat(amount),
      currency,
      senderAddress: publicKey,
      receiverAddress: recipientAddress,
      dueDate: releaseDate,
      method: releaseMethod,
      milestones: useMilestones
        ? milestones.map((milestone) => ({
            name: milestone.title,
            description: milestone.description,
            dueDate: milestone.releaseDate,
            sequence: parseInt(milestone.id),
            status: "pending",
          }))
        : [],
    };

    try {
      // Make the API call
      const response = await fetch("/api/contracts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contractData),
      });

      if (!response.ok) {
        throw new Error("Failed to save the contract");
      }

      const savedContract = await response.json();
      console.log("Contract saved successfully:", savedContract);
      setShowPreview(false);
      onClose();
    } catch (error) {
      console.error("Error saving contract:", error);
      alert("Failed to save the contract. Please try again.");
    }
  };

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Drawer - No backdrop, just the drawer itself */}
      <div className="fixed top-0 md:top-0 pt-[64px] right-0 bottom-0 w-full sm:w-3/4 md:w-2/3 lg:max-w-3xl bg-[#0d0e10] z-40 shadow-xl overflow-y-auto transform transition-all duration-300 ease-in-out animate-slide-in-right">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-800">
            <div>
              <h2 className="text-lg sm:text-2xl font-semibold text-white">
                Create a Contract Proposal
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Set up a new payment agreement with custom terms and release
                settings.
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-[#1e293b]"
            >
              <FaTimes className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 p-3 sm:p-6 overflow-y-auto">
            <div className="space-y-6 sm:space-y-12">
              {/* Contract Title */}
              <div className="space-y-1 sm:space-y-3">
                <Label
                  htmlFor="contractTitle"
                  className="text-white text-sm font-medium"
                >
                  Contract Title
                </Label>
                <Input
                  id="contractTitle"
                  value={contractTitle}
                  onChange={(e) => setContractTitle(e.target.value)}
                  onBlur={() => markAsTouched("contractTitle")}
                  placeholder="e.g. Web Design, Mobile App, Audit"
                  className={cn(
                    "bg-[#15171d] border-gray-700 text-white placeholder:text-gray-400 focus:border-[#00d0ff] focus:ring-[#00d0ff]",
                    touchedFields.contractTitle &&
                      errors.contractTitle &&
                      "border-red-500"
                  )}
                />
                {touchedFields.contractTitle && errors.contractTitle && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.contractTitle}
                  </p>
                )}
              </div>

              {/* Contract Description */}
              <div className="space-y-1 sm:space-y-3">
                <Label
                  htmlFor="contractDescription"
                  className="text-white text-sm font-medium"
                >
                  Contract Description
                </Label>
                <Textarea
                  id="contractDescription"
                  value={contractDescription}
                  onChange={(e) => setContractDescription(e.target.value)}
                  placeholder="Briefly describe what this contract is for"
                  rows={3}
                  className="bg-[#15171d] border-gray-700 text-white placeholder:text-gray-400 focus:border-[#00d0ff] focus:ring-[#00d0ff] resize-none"
                />
              </div>

              {/* Recipient Method */}
              <div className="space-y-3 sm:space-y-4 bg-[#0e0f11] p-4 sm:p-6 rounded-lg border border-gray-800 shadow-sm">
                <Label className="text-white text-sm sm:text-base font-medium">
                  Recipient Method
                </Label>
                <RadioGroup
                  value={recipientMethod}
                  onValueChange={setRecipientMethod}
                  className="flex flex-col space-y-3 sm:space-y-4"
                >
                  {/* <div
                    className={cn(
                      "flex items-start space-x-3 p-3 rounded-md",
                      recipientMethod === "link" &&
                        "bg-[#15171d] border border-gray-700"
                    )}
                  >
                    <RadioGroupItem
                      value="link"
                      id="link"
                      className="border-gray-700 text-[#00d0ff] mt-0.5"
                    />
                    <div>
                      <Label
                        htmlFor="link"
                        className="text-white font-normal cursor-pointer"
                      >
                        Generate a shareable proposal link after submission
                      </Label>
                      <p className="text-gray-300 text-xs mt-1">
                        Anyone with the link can view and accept the proposal
                      </p>
                    </div>
                  </div> */}
                  <div
                    className={cn(
                      "flex items-start space-x-3 p-3 rounded-md",
                      recipientMethod === "address" &&
                        "bg-[#15171d] border border-gray-700"
                    )}
                  >
                    <RadioGroupItem
                      value="address"
                      id="address"
                      className="border-gray-700 text-[#00d0ff] mt-0.5"
                    />
                    <div>
                      <Label
                        htmlFor="address"
                        className="text-white font-normal cursor-pointer"
                      >
                        Enter recipient's Stellar wallet address
                      </Label>
                      <p className="text-gray-300 text-xs mt-1">
                        Only if they already have a LockUp account
                      </p>
                    </div>
                  </div>
                </RadioGroup>

                {/* Conditional Recipient Address Input */}
                {recipientMethod === "address" && (
                  <div className="mt-3 sm:mt-4 pl-7">
                    <Label
                      htmlFor="recipientAddress"
                      className="text-white text-sm"
                    >
                      Recipient Wallet Address
                    </Label>
                    <Input
                      id="recipientAddress"
                      value={recipientAddress}
                      onChange={(e) => {
                        const value = e.target.value;
                        setRecipientAddress(value);
                      }}
                      onBlur={() => markAsTouched("recipientAddress")}
                      placeholder="G..."
                      className={cn(
                        "bg-[#15171d] border-gray-700 text-white placeholder:text-gray-400 focus:border-[#00d0ff] focus:ring-[#00d0ff] mt-1 font-mono",
                        touchedFields.recipientAddress &&
                          errors.recipientAddress &&
                          "border-red-500"
                      )}
                    />
                    {touchedFields.recipientAddress &&
                      errors.recipientAddress && (
                        <p className="text-red-600 text-xs mt-1">
                          {errors.recipientAddress}
                        </p>
                      )}
                  </div>
                )}
              </div>

              {/* Payment Details */}
              <div className="space-y-3 sm:space-y-4 bg-[#0e0f11] p-4 sm:p-6 rounded-lg border border-gray-800 shadow-sm">
                <Label className="text-white text-sm sm:text-base font-medium">
                  Payment Details
                </Label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="amount" className="text-white text-sm">
                      Amount
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      onBlur={() => markAsTouched("amount")}
                      placeholder="0.00"
                      className={cn(
                        "bg-[#15171d] border-gray-700 text-white placeholder:text-gray-400 focus:border-[#00d0ff] focus:ring-[#00d0ff] text-right",
                        touchedFields.amount &&
                          errors.amount &&
                          "border-red-500"
                      )}
                    />
                    {touchedFields.amount && (
                      <>
                        {errors.amount && (
                          <p className="text-red-600 text-xs mt-1">
                            {errors.amount}
                          </p>
                        )}
                        {errors.milestoneTotal && (
                          <p className="text-red-600 text-xs mt-1">
                            {errors.milestoneTotal}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                  <div className="w-full sm:w-1/3 space-y-2">
                    <Label htmlFor="currency" className="text-white text-sm">
                      Currency
                    </Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger
                        id="currency"
                        className="bg-[#15171d] border-gray-700 text-white focus:ring-[#00d0ff]"
                      >
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#15171d] border-gray-800 text-white">
                        <SelectItem value="XLM">XLM</SelectItem>
                        <SelectItem value="USDC">USDC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Release Method */}
              <div className="space-y-3 sm:space-y-4 bg-[#0e0f11] p-4 sm:p-6 rounded-lg border border-gray-800 shadow-sm">
                <Label className="text-white text-sm sm:text-base font-medium">
                  Release Method
                </Label>
                <RadioGroup
                  value={releaseMethod}
                  onValueChange={setReleaseMethod}
                  className="flex flex-col space-y-3 sm:space-y-4"
                >
                  <div
                    className={cn(
                      "flex items-start space-x-3 p-3 rounded-md",
                      releaseMethod === "manual" &&
                        "bg-[#15171d] border border-gray-700"
                    )}
                  >
                    <RadioGroupItem
                      value="manual"
                      id="manual"
                      className="border-gray-700 text-[#00d0ff] mt-0.5"
                    />
                    <div>
                      <Label
                        htmlFor="manual"
                        className="text-white font-normal cursor-pointer"
                      >
                        Manual release
                      </Label>
                      <p className="text-gray-300 text-xs mt-1">
                        You'll release funds manually when milestones are
                        completed
                      </p>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "flex items-start space-x-3 p-3 rounded-md",
                      releaseMethod === "auto" &&
                        "bg-[#15171d] border border-gray-700"
                    )}
                  >
                    <RadioGroupItem
                      value="auto"
                      id="auto"
                      className="border-gray-700 text-[#00d0ff] mt-0.5"
                    />
                    <div>
                      <Label
                        htmlFor="auto"
                        className="text-white font-normal cursor-pointer"
                      >
                        Auto release on a specific date
                      </Label>
                      <p className="text-gray-300 text-xs mt-1">
                        Funds will be automatically released on the specified
                        date
                      </p>
                    </div>
                  </div>
                </RadioGroup>

                {/* Conditional Release Date Picker */}
                {releaseMethod === "auto" && !useMilestones && (
                  <div className="mt-3 sm:mt-4 pl-7">
                    <Label htmlFor="releaseDate" className="text-white text-sm">
                      Release Date
                    </Label>
                    <div className="mt-2">
                      <input
                        type="date"
                        id="releaseDate"
                        className={cn(
                          "w-full h-10 px-3 py-2 rounded-md border bg-[#15171d] text-white",
                          "border-gray-700 focus:border-[#00d0ff] focus:ring-[#00d0ff] focus:outline-none focus:ring-2 focus:ring-offset-2",
                          touchedFields.releaseDate &&
                            errors.releaseDate &&
                            "border-red-500"
                        )}
                        value={
                          releaseDate ? format(releaseDate, "yyyy-MM-dd") : ""
                        }
                        min={format(new Date(), "yyyy-MM-dd")}
                        onChange={(e) => {
                          const date = e.target.value
                            ? new Date(e.target.value)
                            : undefined;
                          setReleaseDate(date);
                        }}
                        onBlur={() => markAsTouched("releaseDate")}
                      />
                      {touchedFields.releaseDate && errors.releaseDate && (
                        <p className="text-red-600 text-xs mt-1">
                          {errors.releaseDate}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Milestones Toggle */}
              <div className="space-y-3 sm:space-y-4 bg-[#0e0f11] p-4 sm:p-6 rounded-lg border border-gray-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="milestones"
                      className="text-white text-sm sm:text-base font-medium"
                    >
                      Split into milestones
                    </Label>
                    <p className="text-gray-300 text-sm mt-1">
                      Divide the total amount into multiple payments
                    </p>
                  </div>
                  <Switch
                    id="milestones"
                    checked={useMilestones}
                    onCheckedChange={setUseMilestones}
                    className="data-[state=checked]:bg-[#00d0ff]"
                  />
                </div>

                {/* Milestones Section */}
                {useMilestones && (
                  <div className="mt-4 sm:mt-6 space-y-4">
                    {milestones.map((milestone, index) => (
                      <div
                        key={milestone.id}
                        className="bg-[#15171d] border border-gray-800 shadow-sm rounded-lg p-4 sm:p-5 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-white font-medium">
                            Milestone {index + 1}
                          </h3>
                          {milestones.length > 2 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMilestone(milestone.id)}
                              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-[#1e293b]"
                            >
                              <FaTrashAlt className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        {/* Milestone Title */}
                        <div className="space-y-2">
                          <Label
                            htmlFor={`milestone-${milestone.id}-title`}
                            className="text-white text-sm"
                          >
                            Title
                          </Label>
                          <Input
                            id={`milestone-${milestone.id}-title`}
                            value={milestone.title}
                            onChange={(e) =>
                              updateMilestone(
                                milestone.id,
                                "title",
                                e.target.value
                              )
                            }
                            onBlur={() =>
                              markAsTouched(`milestone-${index}-title`)
                            }
                            placeholder="Milestone title"
                            className={cn(
                              "bg-[#15171d] border-gray-700 text-white placeholder:text-gray-400 focus:border-[#00d0ff] focus:ring-[#00d0ff]",
                              touchedFields[`milestone-${index}-title`] &&
                                errors[`milestone-${index}-title`] &&
                                "border-red-500"
                            )}
                          />
                          {touchedFields[`milestone-${index}-title`] &&
                            errors[`milestone-${index}-title`] && (
                              <p className="text-red-600 text-xs mt-1">
                                {errors[`milestone-${index}-title`]}
                              </p>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Milestone Amount */}
                          <div className="flex-1 space-y-2">
                            <Label
                              htmlFor={`milestone-${milestone.id}-amount`}
                              className="text-white text-sm"
                            >
                              Amount
                            </Label>
                            <Input
                              id={`milestone-${milestone.id}-amount`}
                              type="number"
                              min="0"
                              step="0.01"
                              value={milestone.amount}
                              onChange={(e) =>
                                updateMilestone(
                                  milestone.id,
                                  "amount",
                                  e.target.value
                                )
                              }
                              onBlur={() =>
                                markAsTouched(`milestone-${index}-amount`)
                              }
                              placeholder="0.00"
                              className={cn(
                                "bg-[#15171d] border-gray-700 text-white placeholder:text-gray-400 focus:border-[#00d0ff] focus:ring-[#00d0ff] text-right",
                                touchedFields[`milestone-${index}-amount`] &&
                                  errors[`milestone-${index}-amount`] &&
                                  "border-red-500"
                              )}
                            />
                            {touchedFields[`milestone-${index}-amount`] &&
                              errors[`milestone-${index}-amount`] && (
                                <p className="text-red-600 text-xs mt-1">
                                  {errors[`milestone-${index}-amount`]}
                                </p>
                              )}
                          </div>

                          {/* Milestone Release Date (only for auto release) */}
                          <div className="flex-1 space-y-2">
                            <Label
                              htmlFor={`milestone-${milestone.id}-date`}
                              className="text-white text-sm"
                            >
                              Release
                            </Label>
                            {releaseMethod === "auto" ? (
                              <div>
                                <input
                                  type="date"
                                  id={`milestone-${milestone.id}-date`}
                                  className={cn(
                                    "w-full h-10 px-3 py-2 rounded-md border bg-[#15171d] text-white",
                                    "border-gray-700 focus:border-[#00d0ff] focus:ring-[#00d0ff] focus:outline-none focus:ring-2 focus:ring-offset-2",
                                    touchedFields[`milestone-${index}-date`] &&
                                      errors[`milestone-${index}-date`] &&
                                      "border-red-500"
                                  )}
                                  value={
                                    milestone.releaseDate
                                      ? format(
                                          milestone.releaseDate,
                                          "yyyy-MM-dd"
                                        )
                                      : ""
                                  }
                                  min={format(new Date(), "yyyy-MM-dd")}
                                  onChange={(e) => {
                                    const date = e.target.value
                                      ? new Date(e.target.value)
                                      : undefined;
                                    updateMilestone(
                                      milestone.id,
                                      "releaseDate",
                                      date
                                    );
                                  }}
                                  onBlur={() =>
                                    markAsTouched(`milestone-${index}-date`)
                                  }
                                />
                                {touchedFields[`milestone-${index}-date`] &&
                                  errors[`milestone-${index}-date`] && (
                                    <p className="text-red-600 text-xs mt-1">
                                      {errors[`milestone-${index}-date`]}
                                    </p>
                                  )}
                              </div>
                            ) : (
                              <div className="h-10 flex items-center text-gray-300 text-sm">
                                Will be manually released
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Milestone Total Error */}
                    {touchedFields.milestoneTotal && errors.milestoneTotal && (
                      <p className="text-red-600 text-sm mt-2">
                        {errors.milestoneTotal}
                      </p>
                    )}

                    {/* Add Milestone Button */}
                    {milestones.length < 5 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addMilestone}
                        className="mt-2 w-full bg-[#15171d] text-[#00d0ff] hover:bg-[#00d0ff]/10 rounded-full"
                      >
                        <FaPlus className="mr-2 h-4 w-4" />
                        Add Milestone
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 sm:p-6 border-t border-gray-800 bg-[#0e0f11]">
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-gray-700 text-gray-300 hover:bg-[#1e293b] rounded-full"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handlePreview}
                disabled={!formValid}
                className="px-4 py-2 sm:px-8 sm:py-3 bg-[#00d0ff] hover:bg-[#00d0ff]/80 text-white font-semibold text-sm sm:text-base rounded-full"
              >
                Preview Proposal
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Dialog - Clean modal without affecting background */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="bg-[#15171d] border-gray-800 text-white max-w-xl rounded-xl shadow-xl p-4 sm:p-6 overflow-y-auto max-h-[90vh] w-[95%] sm:w-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">
              Contract Proposal Preview
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Review your contract proposal before sending
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <h3 className="text-gray-300 text-sm">Contract Title</h3>
              <p className="text-white font-medium">{contractTitle}</p>
            </div>

            {contractDescription && (
              <div className="space-y-2">
                <h3 className="text-gray-300 text-sm">Description</h3>
                <p className="text-white">{contractDescription}</p>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-gray-300 text-sm">Payment</h3>
              <p className="text-white font-medium">
                {amount} {currency}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-gray-300 text-sm">Release Method</h3>
              <p className="text-white">
                {releaseMethod === "manual" ? "Manual release" : "Auto release"}
                {releaseMethod === "auto" && !useMilestones && releaseDate && (
                  <span className="text-gray-300 ml-2">
                    on {format(releaseDate, "PPP")}
                  </span>
                )}
              </p>
            </div>

            {useMilestones && (
              <div className="space-y-3">
                <h3 className="text-gray-300 text-sm">Milestones</h3>
                <div className="space-y-2">
                  {milestones.map((milestone, index) => (
                    <Card
                      key={milestone.id}
                      className="bg-[#15171d] border-gray-800"
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-white font-medium">
                              {milestone.title}
                            </p>
                            {releaseMethod === "auto" &&
                              milestone.releaseDate && (
                                <p className="text-gray-300 text-xs">
                                  Release on{" "}
                                  {format(milestone.releaseDate, "PPP")}
                                </p>
                              )}
                          </div>
                          <p className="text-white font-medium">
                            {milestone.amount} {currency}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <Separator className="bg-gray-800" />

            <div className="space-y-2">
              <h3 className="text-gray-300 text-sm">Recipient</h3>
              {recipientMethod === "link" ? (
                <div className="space-y-2">
                  <p className="text-white">Shareable proposal link:</p>
                  <div className="flex items-center bg-[#0e0f11] border border-gray-800 rounded-md p-2">
                    <code className="text-[#00d0ff] text-sm flex-1 truncate">
                      {generatedLink}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-[#1e293b]"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedLink);
                      }}
                    >
                      <FaCopy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-gray-300 text-xs">
                    Anyone with this link can view and accept the proposal
                  </p>
                </div>
              ) : (
                <p className="text-white font-mono">
                  {recipientAddress.substring(0, 8)}...
                  {recipientAddress.substring(recipientAddress.length - 4)}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setShowPreview(false)}
              className="border-[#00d0ff] text-[#00d0ff] hover:bg-[#00d0ff]/10 rounded-full"
            >
              <FaTimes className="mr-2 h-4 w-4" />
              Edit Proposal
            </Button>
            <Button
              onClick={handleSendProposal}
              className="bg-[#00d0ff] hover:bg-[#00d0ff]/80 text-white rounded-full"
            >
              <FaArrowRight className="mr-2 h-4 w-4" />
              Send Proposal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
