"use client";

import { Button, Input } from "@/components/atoms";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const questions = [
  "What is your favorite color?",
  "What is your mother's maiden name?",
  "What is your first pet's name?",
];

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [step, setStep] = useState<"verify" | "reset">("verify");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [error, setError] = useState("");

  const checkPassword = (v: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
      v
    );

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && question && answer) {
      setStep("reset");
      setError("");
    } else {
      setError("Please fill in all fields.");
    }
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkPassword(pwd)) {
      setError(
        "Password must be at least 8 characters, include uppercase, lowercase, number and symbol."
      );
      return;
    }
    if (pwd !== confirmPwd) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white border rounded-2xl shadow-sm p-8 md:p-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-8">
            Forgot Password
          </h1>

          {step === "verify" && (
            <form onSubmit={handleVerify} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  placeholder="Enter your user email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Security question
                </label>
                <select
                  className="w-full border rounded-md p-2 text-sm"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                >
                  <option value="">Select your question</option>
                  {questions.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Question answer
                </label>
                <Input
                  type="text"
                  placeholder="Type your answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <Button type="submit" className="w-full">
                Verify
              </Button>

              <div className="text-center text-sm">
                Don’t have an account?{" "}
                <Link href="/register" className="font-medium">
                  Register
                </Link>
                <div className="mt-1">
                  <Link href="/login" className="hover:underline">
                    Back to Login
                  </Link>
                </div>
              </div>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handleReset} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">
                  New password
                </label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Confirm password
                </label>
                <Input
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <Button
                type="submit"
                className="w-full"
                disabled={!checkPassword(pwd) || pwd !== confirmPwd}
              >
                Reset Password
              </Button>

              <div className="text-center text-sm">
                <Link href="/login" className="hover:underline">
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>

        <div className="hidden md:flex items-center justify-center">
          <div className="bg-black rounded-3xl p-6">
            <img
              src="/TTE.png"
              alt="Tech Trend Emporium"
              className="rounded-2xl max-w-md w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
