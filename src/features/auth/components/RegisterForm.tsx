"use client";

import { useState, useMemo } from "react";
import { Loader2, Eye, EyeOff, Check, X, AlertCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/shared/lib/api-client";
import { useRegister } from "../hooks";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { toast } from "sonner";

const PASS_CHECKS = [
  { label: "Minimum 8 characters", test: (p: string) => p.length >= 8 },
  { label: "At least one uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "At least one lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "At least one number", test: (p: string) => /[0-9]/.test(p) },
];

export function RegisterForm() {
  const [signupUser, setSignupUser] = useState("");
  const [signupPass, setSignupPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [signupError, setSignupError] = useState("");

  const registerMutation = useRegister();

  const passChecks = useMemo(() =>
    PASS_CHECKS.map(c => ({ label: c.label, pass: c.test(signupPass) })),
    [signupPass]
  );

  const allPass = passChecks.every(c => c.pass);
  const passwordsMatch = signupPass === confirmPass && confirmPass.length > 0;
  const signupValid = allPass && passwordsMatch;

  const handleSignup = async () => {
    if (!signupUser || !signupValid) return;
    setSignupError("");
    try {
      await registerMutation.mutateAsync({ username: signupUser, password: signupPass });
      setSignupUser("");
      setSignupPass("");
      setConfirmPass("");
      toast.success("Account created!");
    } catch (e: any) {
      setSignupError(e.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="su-u">Username</Label>
        <Input
          id="su-u"
          value={signupUser}
          onChange={(e) => { setSignupUser(e.target.value); setSignupError(""); }}
          placeholder="your_username"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="su-p">Password</Label>
        <div className="relative">
          <Input
            id="su-p"
            type={showSignupPass ? "text" : "password"}
            value={signupPass}
            onChange={(e) => { setSignupPass(e.target.value); setSignupError(""); }}
            placeholder="••••••••"
            className="pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowSignupPass(!showSignupPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showSignupPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="su-cp">Confirm password</Label>
        <div className="relative">
          <Input
            id="su-cp"
            type={showConfirmPass ? "text" : "password"}
            value={confirmPass}
            onChange={(e) => { setConfirmPass(e.target.value); setSignupError(""); }}
            placeholder="••••••••"
            className="pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPass(!showConfirmPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {signupPass.length > 0 && (
        <div className="space-y-1.5 text-xs">
          {passChecks.map((c, i) => (
            <div key={i} className={`flex items-center gap-2 ${c.pass ? "text-green-500" : "text-muted-foreground"}`}>
              {c.pass ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
              {c.label}
            </div>
          ))}
        </div>
      )}
      {signupError && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {signupError}
        </div>
      )}
      <Button className="w-full bg-gradient-primary" type="submit" disabled={registerMutation.isPending || !signupValid}>
        {registerMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign up"}
      </Button>
    </form>
  );
}