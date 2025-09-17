import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { signUp } from "@/api/auth";
import { Loader2 } from "lucide-react";
import DarkModeToggle from "@/components/DarkModeToggle";

const SignUp = () => {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = ({ target: { name, value } }) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.username.trim()) {
      setLoading(false);
      toast.error("Username is required.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setLoading(false);
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const payload = {
        username: form.username.trim(),
        email: form.email,
        password: form.password,
      };

      await signUp(payload);

      toast.success("Account created successfully.");
      navigate("/sign-in");
    } catch (error) {
      if (!error.isHandled) {
        const message = error.response?.data?.message || "Something went wrong";
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-[0_0_50px] shadow-purple-500/10 dark:shadow-purple-500/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex justify-between items-center">
            Sign Up
            <DarkModeToggle />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Your email"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                className="focus-visible:border-purple-500  dark:focus-visible:border-purple-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                placeholder="Your username"
                value={form.username}
                onChange={handleChange}
                disabled={loading}
                className="focus-visible:border-purple-500  dark:focus-visible:border-purple-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                className="focus-visible:border-purple-500  dark:focus-visible:border-purple-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                className="focus-visible:border-purple-500  dark:focus-visible:border-purple-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2 mt-8 bg-purple-500 hover:bg-purple-700 text-white"
              disabled={loading}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>

          <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
            Already have an account?{" "}
            <a
              href="/sign-in"
              className="text-purple-500 hover:text-purple-700 transition-colors"
            >
              Sign In
            </a>
          </p>
        </CardContent>
      </Card>
    </main>
  );
};

export default SignUp;
