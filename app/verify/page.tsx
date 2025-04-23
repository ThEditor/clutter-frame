"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { authApi } from "@/lib/api";

export default function VerifyPage() {
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (!verificationCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter the verification code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const data = await authApi.verify(verificationCode);
      toast({
        title: "Success",
        description: data.message || "Email verified successfully!",
      });
      
      router.push("/");
    } catch (err) {
      toast({
        title: "Verification Failed",
        description: err instanceof Error ? err.message : "Invalid verification code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    try {
      const data = await authApi.generateCode();
      toast({
        title: "Code Sent",
        description: data.message || "Verification code has been sent to your email",
      });
      
      setCountdown(60);
    } catch (err) {
      toast({
        title: "Failed to Send Code",
        description: err instanceof Error ? err.message : "Could not send verification code",
        variant: "destructive",
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a verification code to your email address. Please enter it below to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verification-code">Verification Code</Label>
            <Input 
              id="verification-code" 
              placeholder="Enter code" 
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required 
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            className="w-full" 
            onClick={handleVerify} 
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </Button>
          
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={handleResendCode}
              disabled={resendLoading || countdown > 0}
            >
              {resendLoading 
                ? "Sending..." 
                : countdown > 0 
                  ? `Resend Code (${countdown}s)` 
                  : "Resend Verification Code"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
