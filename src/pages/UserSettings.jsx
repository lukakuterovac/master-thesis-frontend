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
import { Input as BaseInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button as BaseButton } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Input = (props) => (
  <BaseInput
    className="focus-visible:border-purple-500 dark:focus-visible:border-purple-500"
    {...props}
  />
);

const Button = (props) => (
  <BaseButton
    className="w-full text-white bg-purple-500 hover:bg-purple-700"
    {...props}
  />
);

const UserSettings = () => {
  const { user, updateUser } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (url, data, successCallback) => {
    try {
      setLoading(true);
      const res = await axios.post(url, data);
      toast.success(res.data.message);
      successCallback?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating");
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
          <div className="space-y-2">
            <Label htmlFor="username">New Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <Button
            onClick={() =>
              !username.trim()
                ? toast.error("Username is required")
                : handleUpdate(
                    "/user/update-username",
                    {
                      oldUsername: user.username,
                      newUsername: username.trim(),
                    },
                    () => updateUser({ username: username.trim() })
                  )
            }
            disabled={loading}
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
          <div className="space-y-2">
            <Label htmlFor="email">New Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button
            onClick={() =>
              !email.trim()
                ? toast.error("Email is required")
                : handleUpdate(
                    "/user/update-email",
                    { oldEmail: user.email, newEmail: email.trim() },
                    () => updateUser({ email: email.trim() })
                  )
            }
            disabled={loading}
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
          <div className="space-y-2">
            <Label htmlFor="oldPassword">Old Password</Label>
            <Input
              id="oldPassword"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              if (!oldPassword || !newPassword || !confirmPassword)
                return toast.error("All password fields are required");
              if (newPassword !== confirmPassword)
                return toast.error("Passwords do not match");

              handleUpdate(
                "/user/update-password",
                { oldPassword, newPassword },
                () => {
                  setOldPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }
              );
            }}
            disabled={loading}
          >
            Update Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSettings;
