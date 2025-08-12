import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { signIn as signInRequest } from "@/features/auth";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await signInRequest(form);
      console.log("Sign in successful:", data);

      signIn(data.user, data.token);
      toast.success("Sign in successful.");
      navigate("/dashboard");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Invalid email/username or password.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <Card className="z-10 w-full max-w-md shadow-[0_0_20px] shadow-gray-500 dark:shadow-muted">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Sign In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="mt-2 flex items-center gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700 shadow-sm">
                <svg
                  className="h-4 w-4 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.054 0 1.611-1.14.987-2L13.387 4c-.527-.855-1.847-.855-2.374 0L4.08 17c-.624.86-.067 2 .987 2z"
                  />
                </svg>
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-3">
              <Label htmlFor="email">Email or Username</Label>
              <Input
                id="email"
                name="email"
                type="text"
                required
                placeholder="you@example.com or username"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              disabled={loading}
              color="purple"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-4">
            Don’t have an account?{" "}
            <a
              href="/sign-up"
              className="text-purple-900 hover:text-purple-900/90"
            >
              Sign Up
            </a>
          </p>
        </CardContent>
      </Card>
    </main>
  );
};

export default SignIn;
