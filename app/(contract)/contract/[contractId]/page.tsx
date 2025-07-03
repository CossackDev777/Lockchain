"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppLayout } from "@/components/layouts/app-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FaArrowLeft,
  FaSpinner,
  FaCheckCircle,
  FaClock,
  FaCopy,
  FaExclamationCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
  FaLock,
  FaUnlock,
} from "react-icons/fa";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PageTransition } from "@/components/ui/page-transition";
import { useWallet } from "@/components/wallet-provider";

export default function ContractDetailPage() {
  const { publicKey } = useWallet();
  const { contractId } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [contract, setContract] = useState<any>(null);
  const [releasingMilestone, setReleasingMilestone] = useState<number | null>(
    null
  );
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showReleaseDialog, setShowReleaseDialog] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchContractById = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/contracts?contractId=${contractId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch contract");
        }
        const data = await response.json();
        setContract(data);
      } catch (error) {
        console.error("Error fetching contract:", error);
        setContract(null); // Handle case where contract is not found
      } finally {
        setIsLoading(false);
      }
    };

    if (contractId) {
      fetchContractById();
      console.log("Fetching contract with ID:", contract);
    }
  }, [contractId]);

  const handleReleaseMilestone = (milestone: any) => {
    setSelectedMilestone(milestone);
    setShowReleaseDialog(true);
  };

  const confirmReleaseMilestone = () => {
    if (!selectedMilestone) return;

    setIsProcessing(true);
    setReleasingMilestone(selectedMilestone.id);

    // Simulate releasing milestone
    setTimeout(() => {
      setContract((prev: any) => {
        const updatedMilestones = prev.milestones.map((m: any) => {
          if (m.id === selectedMilestone.id) {
            return {
              ...m,
              status: "completed",
              releaseDate: new Date().toISOString().split("T")[0],
            };
          }
          return m;
        });

        // Check if all milestones are completed
        const allCompleted = updatedMilestones.every(
          (m: any) => m.status === "completed"
        );

        return {
          ...prev,
          milestones: updatedMilestones,
          status: allCompleted ? "completed" : "active",
        };
      });

      setReleasingMilestone(null);
      setIsProcessing(false);
      setShowReleaseDialog(false);
    }, 2000);
  };

  const handleAcceptContract = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch("/api/contracts", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractId: contract.id, // Replace with the actual contract ID
          action: "accept",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error accepting contract:", errorData.error);
        throw new Error(errorData.error || "Failed to accept contract");
      }

      const updatedContract = await response.json();

      setContract((prev: any) => ({
        ...prev,
        status: updatedContract.status,
      }));

      setShowAcceptDialog(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to accept the contract. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectContract = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch("/api/contracts", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractId: contract.id, // Replace with the actual contract ID
          action: "reject",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error rejecting contract:", errorData.error);
        throw new Error(errorData.error || "Failed to reject contract");
      }

      const updatedContract = await response.json();

      // Update the contract state with the new status
      setContract((prev: any) => ({
        ...prev,
        status: updatedContract.status,
        receiverAddress: updatedContract.receiverAddress, // Update receiverAddress if removed
      }));

      setShowRejectDialog(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to reject the contract. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const truncateAddress = (address: string) => {
    if (address)
      return `${address.substring(0, 6)}...${address.substring(
        address.length - 4
      )}`;
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div className="flex flex-col items-center">
            <FaSpinner className="h-8 w-8 animate-spin text-[#00d0ff] mb-4" />
            <p className="text-gray-300">Loading contract details...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const completedMilestones = contract.milestones.filter(
    (m: any) => m.status === "completed"
  ).length;
  const totalMilestones = contract.milestones.length;
  const progressPercentage = (completedMilestones / totalMilestones) * 100;

  // Determine user role based on wallet address
  const isSender = contract.senderAddress === publicKey;
  const isRecipient = contract.receiverAddress === publicKey;
  const isPending = contract.status === "pending";
  const isActive = contract.status === "active";
  const isCompleted = contract.status === "completed";
  const isRejected = contract.status === "rejected";

  return (
    <AppLayout>
      <PageTransition>
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="mb-6">
            <Link
              href="/contracts"
              className="flex items-center text-sm text-gray-300 hover:text-white"
            >
              <FaArrowLeft className="mr-1 h-4 w-4" />
              Back to Contracts
            </Link>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {contract.title}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="outline"
                    className={`
                    ${
                      isPending
                        ? "bg-yellow-900/30 text-yellow-300 border-yellow-900"
                        : isActive
                        ? "bg-blue-100 text-blue-800 border-blue-200"
                        : isCompleted
                        ? "bg-green-900/30 text-green-300 border-green-900"
                        : isRejected
                        ? "bg-red-900/30 text-red-300 border-red-900"
                        : "bg-[#1e293b] text-white border-gray-800"
                    } rounded-full px-3 py-0.5 text-sm font-medium`}
                  >
                    {isPending ? (
                      <FaClock className="mr-1 h-3 w-3" />
                    ) : isActive ? (
                      <FaExclamationCircle className="mr-1 h-3 w-3" />
                    ) : isCompleted ? (
                      <FaCheckCircle className="mr-1 h-3 w-3" />
                    ) : isRejected ? (
                      <FaTimesCircle className="mr-1 h-3 w-3" />
                    ) : null}
                    {contract.status.charAt(0).toUpperCase() +
                      contract.status.slice(1)}
                  </Badge>
                  <span className="text-sm text-gray-300">
                    Created on {contract.createdAt}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-800 text-gray-300 hover:bg-[#1e293b] rounded-full"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/contract/${contractId}`
                    );
                  }}
                >
                  <FaCopy className="mr-2 h-4 w-4" />
                  Copy Link
                </Button>
              </div>
            </div>

            {/* Role indicator */}
            <Card className="bg-[#15171d] border-gray-800 shadow-sm rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center">
                  {isSender ? (
                    <>
                      <div className="bg-[#00d0ff]/10 p-2 rounded-full mr-3">
                        <FaArrowUp className="h-5 w-5 text-[#00d0ff]" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          You are the Sender
                        </p>
                        <p className="text-sm text-gray-300">
                          You created this contract
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-[#00d0ff]/10 p-2 rounded-full mr-3">
                        <FaArrowDown className="h-5 w-5 text-[#00d0ff]" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          You are the Recipient
                        </p>
                        <p className="text-sm text-gray-300">
                          This contract was sent to you
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status message for pending contracts */}
            {isPending && (
              <Card className="border-yellow-900 bg-yellow-900/30 shadow-sm rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <FaExclamationCircle className="h-5 w-5 text-yellow-300 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-yellow-300">
                        {isSender
                          ? "Waiting for recipient to accept"
                          : "This contract requires your approval"}
                      </h3>
                      <p className="text-sm text-yellow-300 mt-1">
                        {isSender
                          ? "No funds have been locked yet. The recipient will review the contract terms before accepting."
                          : "Review the contract terms below. You can choose to Accept or Reject the proposal."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Rejection message */}
            {isRejected && (
              <Card className="border-red-900 bg-red-900/30 shadow-sm rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <FaTimesCircle className="h-5 w-5 text-red-300 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-red-300">
                        This contract was rejected by the recipient
                      </h3>
                      <p className="text-sm text-red-300 mt-1">
                        No funds were locked. You may contact the recipient
                        directly to discuss the terms.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
              <Card className="bg-[#15171d] border-gray-800 shadow-sm rounded-xl">
                <CardHeader className="pb-2 p-4 sm:p-6">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Total Amount
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    {contract.amount} {contract.currency}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#15171d] border-gray-800 shadow-sm rounded-xl">
                <CardHeader className="pb-2 p-4 sm:p-6">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-xl sm:text-2xl font-bold mb-2 text-white">
                    {completedMilestones}/{totalMilestones} Milestones
                  </div>
                  <Progress
                    value={progressPercentage}
                    className="h-2 bg-gray-200 rounded-full"
                    indicatorClassName="bg-[#00d0ff]"
                  />
                </CardContent>
              </Card>

              <Card className="bg-[#15171d] border-gray-800 shadow-sm rounded-xl">
                <CardHeader className="pb-2 p-4 sm:p-6">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    {isSender ? "Recipient" : "Sender"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="text-sm font-medium text-gray-300 flex items-center cursor-pointer"
                          onClick={() =>
                            copyToClipboard(
                              isSender
                                ? contract.receiverAddress
                                : contract.senderAddress,
                              "Address copied to clipboard"
                            )
                          }
                        >
                          {truncateAddress(
                            isSender
                              ? contract.receiverAddress
                              : contract.senderAddress
                          )}
                          <FaCopy className="ml-2 h-4 w-4 text-gray-400" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click to copy full address</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardContent>
              </Card>
            </div>

            {/* Contract Details */}
            <Card className="bg-[#15171d] border-gray-800 shadow-sm rounded-xl">
              <CardHeader className="p-6">
                <CardTitle className="text-white">Contract Details</CardTitle>
                <CardDescription className="text-gray-300">
                  Complete information about this contract
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-1">
                      Description
                    </h3>
                    <p className="text-sm text-gray-300">
                      {contract.description}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-1">
                      Release Type
                    </h3>
                    <p className="capitalize text-sm text-gray-300">
                      {contract.releaseType}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-1">
                      Sender Address
                    </h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="text-sm font-mono text-gray-300 flex items-center cursor-pointer"
                            onClick={() =>
                              copyToClipboard(
                                contract.senderAddress,
                                "Sender address copied to clipboard"
                              )
                            }
                          >
                            {truncateAddress(contract.senderAddress)}
                            <FaCopy className="ml-2 h-4 w-4 text-gray-400" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click to copy full address</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-1">
                      Recipient Address
                    </h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="text-sm font-mono text-gray-300 flex items-center cursor-pointer"
                            onClick={() =>
                              copyToClipboard(
                                contract.receiverAddress,
                                "Recipient address copied to clipboard"
                              )
                            }
                          >
                            {truncateAddress(contract.receiverAddress)}
                            <FaCopy className="ml-2 h-4 w-4 text-gray-400" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click to copy full address</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#15171d] border-gray-800 shadow-sm rounded-xl">
              <CardHeader className="p-6">
                <CardTitle className="text-white">Milestones</CardTitle>
                <CardDescription className="text-gray-300">
                  Track the progress of each milestone in this contract.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-4">
                  {contract.milestones.length > 0 ? (
                    contract.milestones.map((milestone: any, index: number) => (
                      <div
                        key={milestone.id}
                        className="border border-gray-800 rounded-lg p-3 sm:p-4 bg-[#15171d]"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h3 className="font-medium text-white">
                                {milestone.title}
                              </h3>
                              {milestone.status === "completed" ? (
                                <Badge
                                  variant="outline"
                                  className="bg-green-900/30 text-green-300 border-green-900 rounded-full px-2 sm:px-3 py-0.5 text-xs sm:text-sm font-medium"
                                >
                                  <FaCheckCircle className="mr-1 h-3 w-3" />
                                  Completed
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-[#1e293b] text-white border-gray-800 rounded-full px-2 sm:px-3 py-0.5 text-xs sm:text-sm font-medium"
                                >
                                  <FaClock className="mr-1 h-3 w-3" />
                                  Pending
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                              <p className="text-sm text-gray-300">
                                <span className="font-medium">
                                  {milestone.amount} {contract.currency}
                                </span>
                              </p>
                              {milestone.status === "completed" ? (
                                <p className="text-xs text-gray-400 flex items-center">
                                  <FaCheckCircle className="mr-1 h-3 w-3 text-green-300" />
                                  Released on {milestone.releaseDate}
                                </p>
                              ) : (
                                <p className="text-xs text-gray-400 flex items-center">
                                  <FaLock className="mr-1 h-3 w-3 text-gray-400" />
                                  Funds locked in Soroban contract
                                </p>
                              )}
                            </div>
                          </div>

                          {isSender &&
                            isActive &&
                            milestone.status === "pending" && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleReleaseMilestone(milestone)
                                }
                                disabled={releasingMilestone === milestone.id}
                                className="bg-[#00d0ff] text-white hover:bg-[#00d0ff]/80 rounded-full w-full sm:w-auto mt-2 sm:mt-0"
                              >
                                {releasingMilestone === milestone.id ? (
                                  <>
                                    <FaSpinner className="mr-2 h-3 w-3 animate-spin" />
                                    Releasing...
                                  </>
                                ) : (
                                  <>
                                    <FaUnlock className="mr-2 h-3 w-3" />
                                    Release Funds
                                  </>
                                )}
                              </Button>
                            )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 text-sm">
                      No milestones available for this contract.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            {/* Accept/Reject buttons for recipient on pending contracts - Now at the bottom */}
            {isPending && isRecipient && (
              <div className="mt-8 border-t border-gray-800 pt-8">
                <div className="p-4 bg-yellow-900/30 border border-yellow-900 rounded-lg mb-6">
                  <div className="flex items-start">
                    <FaExclamationCircle className="h-5 w-5 text-yellow-300 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-sm text-yellow-300">
                      By accepting, funds will be locked and the contract will
                      begin. You cannot change the terms after accepting.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-red-900 text-red-300 hover:bg-[#1e293b] rounded-full"
                    onClick={() => setShowRejectDialog(true)}
                  >
                    <FaTimesCircle className="mr-2 h-5 w-5" />
                    Reject
                  </Button>
                  <Button
                    size="lg"
                    className="bg-[#00d0ff] text-white hover:bg-[#00d0ff]/80 rounded-full"
                    onClick={() => setShowAcceptDialog(true)}
                  >
                    <FaCheckCircle className="mr-2 h-5 w-5" />
                    Accept
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Accept Confirmation Dialog */}
        <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
          <DialogContent className="bg-[#15171d] border-gray-800 text-white rounded-xl shadow-xl">
            <DialogHeader>
              <DialogTitle>Accept Contract?</DialogTitle>
              <DialogDescription className="text-gray-300">
                By accepting this contract, funds will be locked from the
                sender's wallet until milestones are completed.
              </DialogDescription>
            </DialogHeader>
            <div className="p-4 bg-yellow-900/30 border border-yellow-900 rounded-lg">
              <div className="flex items-start">
                <FaExclamationCircle className="h-4 w-4 text-yellow-300 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-yellow-300">
                  This action cannot be undone. The contract will become active
                  immediately.
                </p>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => setShowAcceptDialog(false)}
                disabled={isProcessing}
                className="border-gray-800 text-gray-300 hover:bg-[#1e293b] rounded-full"
              >
                Cancel
              </Button>
              <Button
                className="bg-[#00d0ff] text-white hover:bg-[#00d0ff]/80 rounded-full"
                onClick={handleAcceptContract}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="mr-2 h-4 w-4" />
                    Confirm Acceptance
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Confirmation Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent className="bg-[#15171d] border-gray-800 text-white rounded-xl shadow-xl">
            <DialogHeader>
              <DialogTitle>Reject Contract?</DialogTitle>
              <DialogDescription className="text-gray-300">
                Are you sure you want to reject this contract? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <Alert className="bg-red-900/30 border-red-900">
              <FaExclamationTriangle className="h-4 w-4 text-red-300" />
              <AlertDescription className="text-red-300 text-sm">
                The contract will be permanently removed and no funds will be
                locked.
              </AlertDescription>
            </Alert>
            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => setShowRejectDialog(false)}
                disabled={isProcessing}
                className="border-gray-800 text-gray-300 hover:bg-[#1e293b] rounded-full"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRejectContract}
                disabled={isProcessing}
                className="bg-red-600 hover:bg-red-700 text-white rounded-full"
              >
                {isProcessing ? (
                  <>
                    <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaTimesCircle className="mr-2 h-4 w-4" />
                    Confirm Rejection
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Release Funds Confirmation Dialog */}
        <Dialog open={showReleaseDialog} onOpenChange={setShowReleaseDialog}>
          <DialogContent className="bg-[#15171d] border-gray-800 text-white rounded-xl shadow-xl">
            <DialogHeader>
              <DialogTitle>Release Milestone Funds?</DialogTitle>
              <DialogDescription className="text-gray-300">
                {selectedMilestone && (
                  <>
                    You are about to release {selectedMilestone.amount}{" "}
                    {contract.currency} for the milestone "
                    {selectedMilestone.title}".
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="p-4 bg-[#00d0ff]/10 border border-[#00d0ff] rounded-lg">
              <div className="flex items-start">
                <FaExclamationCircle className="h-4 w-4 text-[#00d0ff] mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-[#00d0ff]">
                  This will trigger a Soroban smart contract transaction to
                  release the funds to the recipient. This action cannot be
                  undone.
                </p>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => setShowReleaseDialog(false)}
                disabled={isProcessing}
                className="border-gray-800 text-gray-300 hover:bg-[#1e293b] rounded-full"
              >
                Cancel
              </Button>
              <Button
                className="bg-[#00d0ff] text-white hover:bg-[#00d0ff]/80 rounded-full"
                onClick={confirmReleaseMilestone}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaUnlock className="mr-2 h-4 w-4" />
                    Confirm Release
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageTransition>
    </AppLayout>
  );
}
