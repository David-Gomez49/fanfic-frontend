"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, PlusCircle, User2, Sun, Moon, Menu, ShieldCheck } from "lucide-react";
import { useTheme, toggleTheme } from "@/shared/lib/theme";
import { useAuth } from "@/features/auth";
import { LoginForm, UserMenu } from "@/features/auth/components";
import { Button } from "@/shared/components/ui/button";
import {
  Sheet, SheetContent, SheetTrigger, SheetTitle,
} from "@/shared/components/ui/sheet";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/shared/components/ui/dialog";


export function SiteHeader() {
  const { user } = useAuth();
  const theme = useTheme();
  const pathname = usePathname();
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 group">
          <svg viewBox="0 0 130 86" className="h-9 w-auto">
            <defs>
              <linearGradient id="logo-grad" x1="0" y1="0" x2="100" y2="100%">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--primary-glow)" />
              </linearGradient>
            </defs>
            <g transform="translate(-24.4, -289.2)">
              <path fill="url(#logo-grad)" d="m 82.239598,373.43182 c -7.01949,-7.22468 -33.10919,-11.3086 -54.227528,-8.48845 -1.600729,0.21376 -3.059244,0.38965 -3.241145,0.39085 -0.262636,0.002 -0.33073,-6.12239 -0.33073,-29.74466 0,-33.42702 -0.542967,-29.84204 4.630209,-30.5712 3.745007,-0.52785 3.307291,-4.07387 3.307291,26.79303 0,27.06455 0,27.06455 2.447396,26.83555 18.618397,-1.7421 41.977427,2.85049 52.408987,10.30406 1.27827,0.91335 1.27827,0.91335 2.11667,0.28707 7.47693,-5.5852 20.851432,-9.41232 36.821732,-10.53656 4.49432,-0.31637 18.40666,-0.19553 19.64531,0.17064 0.59532,0.17599 0.59532,0.17599 0.59532,-26.97466 0,-14.93287 0.0983,-27.15066 0.21852,-27.15066 0.43398,0 5.96512,0.80832 6.57003,0.96015 0.61978,0.15555 0.61978,0.15555 0.61978,30.0531 0,26.34837 -0.0467,29.87962 -0.39337,29.74659 -1.70754,-0.65524 -12.11408,-1.49316 -18.54436,-1.49316 -18.95878,0 -37.503062,4.6591 -40.469622,10.16768 -1.03126,1.91492 -10.13,1.35487 -12.17449,-0.74937 z m 7.55267,-15.68113 c 0,-8.8758 0,-8.8758 0.72761,-8.70314 0.40018,0.095 2.96744,0.77515 5.70502,1.51151 5.915432,1.59117 5.386012,1.88633 4.160582,-2.31964 -1.568202,-5.38247 -1.555282,-4.8815 -0.17853,-6.92182 5.38508,-7.98068 1.65782,-17.70012 -8.364162,-21.81088 -2.77114,-1.13665 -3.2024,-6.9298 -0.66146,-8.88549 7.41926,-5.71037 20.307982,-10.95991 30.298632,-12.34054 1.1283,-0.15592 1.1283,-0.15592 -1.05834,2.38525 -11.10579,12.90644 -14.63557,26.13262 -10.33921,38.74132 1.08578,3.18647 1.15631,2.32533 -0.80793,9.86538 -1.35022,5.18303 -1.39626,5.48045 -0.84834,5.48045 1.30726,0 2.44991,-2.77284 9.70377,-23.54792 2.60645,-7.46492 4.76193,-12.41891 8.17352,-18.78542 3.41928,-6.38089 3.52559,-6.73032 1.04029,-3.4193 -5.13769,6.84463 -9.02875,14.6969 -13.07243,26.38054 -0.61861,1.78738 -1.18288,3.30791 -1.25392,3.37895 -0.19798,0.19797 -1.20422,-3.2281 -1.55471,-5.29345 -3.00093,-17.68408 14.89703,-41.52677 33.16451,-44.17996 1.48843,-0.21618 1.57199,0.15504 0.84711,3.76364 -1.56815,7.80665 -5.05031,12.78684 -11.69662,16.72851 -1.0559,0.62622 -1.87345,1.18495 -1.81678,1.24161 0.21718,0.21719 4.561,-1.38865 7.00235,-2.58866 3.10891,-1.52813 2.97297,-1.67629 1.77272,1.93212 -2.65882,7.99346 -5.94885,12.41961 -11.73036,15.78114 -1.34516,0.78211 -2.50371,1.51582 -2.57458,1.63048 -0.14528,0.23508 2.59491,-0.35362 4.30554,-0.92499 1.4067,-0.46986 1.4048,-0.4537 -0.20189,1.7136 -2.27697,3.07147 -7.72534,7.99799 -11.83666,10.70294 -1.12448,0.73982 -1.12448,0.73982 -1.12448,4.89761 0,4.15779 0,4.15779 -3.30729,6.59891 -3.63342,2.68183 -3.83898,2.88414 -2.18281,2.14836 8.58961,-3.81608 7.99144,-3.28546 8.13594,-7.21711 0.13229,-3.59951 0.13229,-3.59951 2.24896,-5.37628 9.33585,-7.83666 17.05702,-18.97039 19.80626,-28.56012 0.3372,-1.17618 0.3823,1.17158 0.40661,21.16668 0.0273,22.48958 0.0273,22.48958 -7.57923,22.49923 -18.24689,0.0232 -32.31356,3.30686 -43.638152,10.18679 -1.67154,1.01549 -1.67154,1.01549 -1.67154,-7.8603 z m -3.84969,7.60709 c -4.95826,-4.79784 -25.52846,-9.61686 -42.65082,-9.99189 -7.474479,-0.16372 -7.474479,-0.16372 -7.474479,-28.81536 0,-20.19238 0.08418,-28.70366 0.285134,-28.82786 1.189334,-0.73505 13.181925,-0.30311 18.900275,0.68073 11.56304,1.98942 24.002,7.15756 31.00332,12.88125 0.53955,0.44108 0.84797,3.5445 0.64132,6.453 -0.0243,0.34216 -0.49838,0.45469 -2.47745,0.58809 -21.34081,1.43853 -21.10261,28.68118 0.26458,30.25931 2.18281,0.16122 2.18281,0.16122 2.22568,4.55369 0.0236,2.41586 0.0708,6.20818 0.10489,8.42737 0.0615,4.00471 -0.0536,4.53564 -0.82245,3.79167 z m 6.8576,-18.65767 c -3.47438,-1.16701 -3.47438,-1.16701 -6.48229,-1.02072 -14.69913,0.71489 -20.66723,-16.76523 -7.86763,-23.04369 13.35386,-6.55034 27.129182,7.96344 17.84155,18.79799 -1.12263,1.30961 -1.11807,1.24706 -0.28576,3.92669 0.72252,2.32615 0.75767,2.51513 0.46695,2.51014 -0.10914,-0.002 -1.76191,-0.52856 -3.67282,-1.17041 z"/>
            </g>
          </svg>
          <span className="font-display text-xl font-semibold tracking-tight text-foreground">
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
            <UserMenu />
          ) : (
            <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
              <DialogTrigger asChild>
                <Button variant="default" size="sm">
                  Sign in
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Welcome</DialogTitle>
                  <DialogDescription>Sign in or create an account</DialogDescription>
                </DialogHeader>
                <LoginForm onSuccess={() => setLoginOpen(false)} />
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
