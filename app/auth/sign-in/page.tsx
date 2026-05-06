"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth/auth-client";


export default function SignIn() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const result = await signIn.email({
                email,
                password
            })

            if (result.error) {
                setError(result.error.message ?? "Failed to sign in");
            } else {
                router.push("/dashboard");

            }
        } catch (error) {
            setError("Failed to sign in. Please try again. ");
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md p-6">

                {/* <p>Email: {email}</p>
                <p>Password: {password}</p> */}

                <div className="text-2xl font-bold mb-6 text-center">
                    {loading ? "Signing in..." : "Sign In"}
                </div>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && <div className="text-red-600 text-sm">{error}</div>}
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john.doe@example.com"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={5}
                            />
                        </div>
                        <div className="w-full flex flex-col gap-3">
                            <Button
                                type="submit"
                                className="w-full py-2 rounded"
                                disabled={loading}
                            >
                                Sign In
                            </Button>

                            <div className="text-sm text-center">
                                Don't have an account?{" "}
                                <a href="/auth/sign-up" className="text-blue-600 hover:underline">
                                    Sign up
                                </a>
                            </div>
                        </div>
                    </CardContent>



                </form>
            </Card>
        </div>

    )
}