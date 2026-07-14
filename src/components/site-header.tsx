"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookHeart, Compass, PlusCircle, User2, LogIn, LogOut, Sun, Moon, Menu, ShieldCheck, AlertTriangle, Check, X } from "lucide-react";
import { useTheme, toggleTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useState, useMemo } from "react";
import {
  Sheet, SheetContent, SheetTrigger, SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export function SiteHeader() {
  const { user, login, register } = useAuth();
  const theme = useTheme();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("signin");
  const [loginUsername, setLoginUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signupUser, setSignupUser] = useState("");
  const [signupPass, setSignupPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const passChecks = useMemo(() => [
    { label: 'Mínimo 8 caracteres', pass: signupPass.length >= 8 },
    { label: 'Al menos una mayúscula', pass: /[A-Z]/.test(signupPass) },
    { label: 'Al menos una minúscula', pass: /[a-z]/.test(signupPass) },
    { label: 'Al menos un número', pass: /[0-9]/.test(signupPass) },
    { label: 'Ambas contraseñas coinciden', pass: signupPass === confirmPass && confirmPass.length > 0 },
  ], [signupPass, confirmPass]);

  const handleLogin = async () => {
    if (!loginUsername || !password) return;
    try {
      await login(loginUsername, password);
      setOpen(false);
      setLoginUsername("");
      setPassword("");
    } catch {
      // error toast handled by parent
    }
  };

  const handleSignup = async () => {
    if (!signupUser || !signupPass || passChecks.some(c => !c.pass)) return;
    try {
      await register(signupUser, signupPass);
      setOpen(false);
      setSignupUser("");
      setSignupPass("");
      setConfirmPass("");
    } catch {
      // error toast handled by parent
    }
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-glow">
            <BookHeart className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">
            Ficshelf
          </span>
        </Link>

        {/* Mobile hamburger */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-6">
            <SheetTitle>
              <span className="sr-only">Navigation</span>
            </SheetTitle>
            <div className="flex flex-col gap-1 mt-8">
              <MobileNavLink href="/" label="Home" icon={<Compass className="h-4 w-4" />} active={pathname === "/"} />
              <MobileNavLink href="/browse" label="Browse" icon={<Compass className="h-4 w-4" />} active={pathname === "/browse"} />
              <MobileNavLink href="/add" label="Add" icon={<PlusCircle className="h-4 w-4" />} active={pathname === "/add"} />
              {user && <MobileNavLink href="/profile" label="Profile" icon={<User2 className="h-4 w-4" />} active={pathname === "/profile"} />}
              {user?.isAdmin && <MobileNavLink href="/admin" label="Admin" icon={<ShieldCheck className="h-4 w-4" />} active={pathname === "/admin"} />}
            </div>
            {user && (
              <div className="mt-auto pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">@{user.name}</p>
              </div>
            )}
          </SheetContent>
        </Sheet>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="/" label="Home" active={pathname === "/"} />
          <NavLink href="/browse" label="Browse" icon={<Compass className="h-4 w-4" />} active={pathname === "/browse"} />
          <NavLink href="/add" label="Add" icon={<PlusCircle className="h-4 w-4" />} active={pathname === "/add"} />
          {user?.isAdmin && <NavLink href="/admin" label="Admin" icon={<ShieldCheck className="h-4 w-4" />} active={pathname === "/admin"} />}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {user ? (
            <>
              <Link
                href="/profile"
                className="grid h-8 w-8 place-items-center rounded-full bg-gradient-primary shadow-glow text-primary-foreground text-xs font-semibold"
                aria-label="Profile"
                title="Profile"
              >
                {user.name[0]?.toUpperCase()}
              </Link>
              <LogOutButton />
            </>
          ) : (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gradient-primary shadow-glow">
                  <LogIn className="h-4 w-4 mr-2" /> Sign in
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-display">Welcome</DialogTitle>
                </DialogHeader>
                <Tabs value={tab} onValueChange={setTab} className="mt-2">
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
                        onChange={(e) => setLoginUsername(e.target.value)}
                        placeholder="your_username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="li-p">Password</Label>
                      <Input
                        id="li-p"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                    <Button className="w-full bg-gradient-primary" onClick={handleLogin}>
                      Sign in
                    </Button>
                  </TabsContent>
                  <TabsContent value="signup" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="su-u">Username</Label>
                      <Input
                        id="su-u"
                        value={signupUser}
                        onChange={(e) => setSignupUser(e.target.value)}
                        placeholder="your_username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="su-p">Password</Label>
                      <Input
                        id="su-p"
                        type="password"
                        value={signupPass}
                        onChange={(e) => setSignupPass(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="su-cp">Confirm password</Label>
                      <Input
                        id="su-cp"
                        type="password"
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                    {signupPass.length > 0 && (
                      <div className="space-y-1.5 text-xs">
                        {passChecks.map((c, i) => (
                          <div key={i} className={`flex items-center gap-2 ${c.pass ? 'text-green-500' : 'text-muted-foreground'}`}>
                            {c.pass ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                            {c.label}
                          </div>
                        ))}
                      </div>
                    )}
                    <Button className="w-full bg-gradient-primary" onClick={handleSignup}>
                      Sign up
                    </Button>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, label, icon, active }: { href: string; label: string; icon?: React.ReactNode; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
        active ? "text-foreground bg-surface-2/80" : "text-muted-foreground hover:text-foreground hover:bg-surface-2/60"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function MobileNavLink({ href, label, icon, active }: { href: string; label: string; icon?: React.ReactNode; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
        active ? "text-foreground bg-surface-2/80" : "text-muted-foreground hover:text-foreground hover:bg-surface-2/60"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function LogOutButton() {
  const { logout } = useAuth();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" aria-label="Sign out">
          <LogOut className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Sign out
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to sign out?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" size="sm">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4 mr-1.5" /> Sign out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
