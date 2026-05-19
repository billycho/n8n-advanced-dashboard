"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useSession, authClient } from "@/lib/auth/auth-client"
import { toast } from "sonner"

export default function SettingsPage() {
  const { data: session, isPending } = useSession();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
      setRole((session.user as any).role || "");
    }
  }, [session?.user]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    if (!email.trim()) {
      toast.error("Email cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      let updated = false;

      // Update name if changed
      if (name !== session?.user.name) {
        const { error } = await authClient.updateUser({
          name,
        });
        if (error) throw error;
        updated = true;
      }

      if (updated) {
        toast.success("Profile updated successfully");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to update profile");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <Card className="shadow-md border-primary/10">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              placeholder="Your email"
              disabled
            />
            <p className="text-[10px] text-muted-foreground italic">Email address cannot be changed.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={role}
              placeholder="Your role"
              disabled
            />
            <p className="text-[10px] text-muted-foreground italic">Role cannot be changed.</p>
          </div>

          <div className="space-y-2">
            <Label>Appearance</Label>
            <div className="flex items-center gap-3">
              <Button 
                variant={theme === 'light' ? 'default' : 'outline'} 
                onClick={() => setTheme('light')}
                type="button"
              >
                Light
              </Button>
              <Button 
                variant={theme === 'dark' ? 'default' : 'outline'} 
                onClick={() => setTheme('dark')}
                type="button"
              >
                Dark
              </Button>
              <Button 
                variant={theme === 'system' ? 'default' : 'outline'} 
                onClick={() => setTheme('system')}
                type="button"
              >
                System
              </Button>
            </div>
          </div>

          <Button onClick={handleSave} disabled={isSaving || isPending || !name}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
