"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

import { signUp } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default function SignUp() {
    // Sign up disabled for now, redirect to sign in page
    redirect("/auth/sign-in");

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
            const result = await signUp.email({
                email,
                password,
                name
            })

            if (result.error) {
                setError(result.error.message ?? "Failed to sign up");
            } else {
                router.push("/dashboard");

            }
        } catch (error) {
            setError("Failed to create account. Please try again. ");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md p-6">
                {/* <p>Name: {name}</p>
                <p>Email: {email}</p>
                <p>Password: {password}</p> */}

                <div className="text-2xl font-bold mb-6 text-center">
                    {loading ? "Creating account..." : "Sign Up"}
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <CardContent className="space-y-4">
                        {error && <div className="text-red-600 text-sm">{error}</div>}
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john.doe@example.com"
                                    onChange={(e) => setEmail(e.target.value)}
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
                        </div>
                        <div className="w-full flex flex-col gap-3">
                            <Button
                                type="submit"
                                className="w-full text-white py-2 rounded"
                                disabled={loading}
                            >
                                Create Account
                            </Button>

                            <div className="text-sm text-center">
                                Already have an account?{" "}
                                <a href="/auth/sign-in" className="text-blue-600 hover:underline">
                                    Sign in
                                </a>
                            </div>
                        </div>
                    </CardContent>
                  

                </form>
            </Card>
        </div>

    )
}