"use client"

import { signOut } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut  } from "lucide-react";

export default function SignOutButton() {
    const router = useRouter();
    return (
       <Button variant="ghost" className="w-full justify-start gap-2" onClick={async () => {
            const result = await signOut();
            if (result.data) {
                router.push("/auth/sign-in");
            }
        }}>
              <LogOut className="h-4 w-4" />
              Log Out
            </Button>
    )
}