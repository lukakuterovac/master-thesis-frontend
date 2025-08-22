import { useState } from "react";
import { toast } from "sonner";
import axios from "@/lib/axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const UserSettings = () => {
  const { user, updateUser } = useAuth();

  const [username, setUsername] = useState(user.username || "");
  const [email, setEmail] = useState(user.email || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdateUsername = async () => {
    if (!username.trim()) return toast.error("Username is required");

    try {
      setLoading(true);
      const res = await axios.post("/user/update-username", {
        oldUsername: user.username,
        newUsername: username.trim(),
      });
      toast.success(res.data.message);
      updateUser({ username: username.trim() });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating username");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!email.trim()) return toast.error("Email is required");

    try {
      setLoading(true);
      const res = await axios.post("/user/update-email", {
        oldEmail: user.email,
        newEmail: email.trim(),
      });
      toast.success(res.data.message);
      updateUser({ email: email.trim() });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating email");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword)
      return toast.error("All password fields are required");
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");

    try {
      setLoading(true);
      const res = await axios.post("/user/update-password", {
        oldPassword,
        newPassword,
      });
      toast.success(res.data.message);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold">User Settings</h1>

      {/* Username Card */}
      <Card>
        <CardHeader>
          <CardTitle>Username</CardTitle>
          <CardDescription>Update your username.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="username">New Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={handleUpdateUsername}
            disabled={loading}
            className={"w-full"}
          >
            Update Username
          </Button>
        </CardContent>
      </Card>

      {/* Email Card */}
      <Card>
        <CardHeader>
          <CardTitle>Email</CardTitle>
          <CardDescription>Update your email address.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">New Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={handleUpdateEmail}
            disabled={loading}
            className={"w-full"}
          >
            Update Email
          </Button>
        </CardContent>
      </Card>

      {/* Password Card */}
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Update your password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="oldPassword">Old Password</Label>
            <Input
              id="oldPassword"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={handleUpdatePassword}
            disabled={loading}
            className={"w-full"}
          >
            Update Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSettings;
