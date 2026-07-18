"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut, User2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/shared/components/ui/dialog";

export function UserMenu() {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Link
            href="/profile"
            className="grid h-8 w-8 place-items-center rounded-full bg-gradient-primary shadow-glow text-primary-foreground text-xs font-semibold"
            aria-label="Profile"
            title="Profile"
          >
            {user?.name?.[0]?.toUpperCase()}
          </Link>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User2 className="h-5 w-5 text-destructive" />
              Profile
            </DialogTitle>
            <DialogDescription>
              Manage your account settings or sign out.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Link href="/profile">
                <Button variant="outline" size="sm">View Profile</Button>
              </Link>
            </DialogClose>
            <Button variant="destructive" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-1.5" /> Sign out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}