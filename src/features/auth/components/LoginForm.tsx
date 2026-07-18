"use client";

import { useState, useMemo } from "react";
import { Loader2, Eye, EyeOff, AlertCircle, Check, X } from "lucide-react";
import { useLogin, useRegister } from "../hooks";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { toast } from "sonner";

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [loginUsername, setLoginUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [signupUser, setSignupUser] = useState("");
  const [signupPass, setSignupPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [signupError, setSignupError] = useState("");

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const PASS_CHECKS = [
    { label: "Minimum 8 characters", test: (p: string) => p.length >= 8 },
    { label: "At least one uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { label: "At least one lowercase letter", test: (p: string) => /[a-z]/.test(p) },
    { label: "At least one number", test: (p: string) => /[0-9]/.test(p) },
  ];

  const passChecks = useMemo(() =>
    PASS_CHECKS.map(c => ({ label: c.label, pass: c.test(signupPass) })),
    [signupPass]
  );

  const allPass = passChecks.every(c => c.pass);
  const passwordsMatch = signupPass === confirmPass && confirmPass.length > 0;
  const signupValid = allPass && passwordsMatch;

  const handleLogin = async () => {
    if (!loginUsername || !password) return;
    setLoginError("");
    try {
      await loginMutation.mutateAsync({ username: loginUsername, password });
      setLoginUsername("");
      setPassword("");
      onSuccess?.();
    } catch (e: any) {
      setLoginError(e.message || "Login failed");
    }
  };

  const handleSignup = async () => {
    if (!signupUser || !signupValid) return;
    setSignupError("");
    try {
      await registerMutation.mutateAsync({ username: signupUser, password: signupPass });
      setSignupUser("");
      setSignupPass("");
      setConfirmPass("");
      onSuccess?.();
    } catch (e: any) {
      setSignupError(e.message || "Registration failed");
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "signin" | "signup")} className="mt-2">
      <TabsList className="grid grid-cols-2 bg-surface border border-border">
        <TabsTrigger value="signin">Sign in</TabsTrigger>
        <TabsTrigger value="signup">Sign up</TabsTrigger>
      </TabsList>
      <TabsContent value="signin" className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="li-u">Username</Label>
          <Input
            id="li-u"
            value={loginUsername}
            onChange={(e) => { setLoginUsername(e.target.value); setLoginError(""); }}
            placeholder="your_username"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="li-p">Password</Label>
          <div className="relative">
            <Input
              id="li-p"
              type={showLoginPass ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setLoginError(""); }}
              placeholder="••••••••"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowLoginPass(!showLoginPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showLoginPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {loginError && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {loginError}
          </div>
        )}
        <Button className="w-full bg-gradient-primary" onClick={handleLogin} disabled={loginMutation.isPending}>
          {loginMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
        </Button>
      </TabsContent>
      <TabsContent value="signup" className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="su-u">Username</Label>
          <Input
            id="su-u"
            value={signupUser}
            onChange={(e) => { setSignupUser(e.target.value); setSignupError(""); }}
            placeholder="your_username"
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
            {PASS_CHECKS.map((c, i) => {
              const pass = c.test(signupPass);
              return (
                <div key={i} className={`flex items-center gap-2 ${pass ? "text-green-500" : "text-muted-foreground"}`}>
                  {pass ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  {c.label}
                </div>
              );
            })}
          </div>
        )}
        {signupError && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {signupError}
          </div>
        )}
        <Button className="w-full bg-gradient-primary" onClick={(e) => { e.preventDefault(); }} disabled={!allPass || !passwordsMatch || registerMutation.isPending}>
          {registerMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign up"}
        </Button>
      </TabsContent>
    </Tabs>
  );
}