import { useState } from "react";
import { Mail, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { sendEmail } from "@/features/email";

// Simple regex-based email validator
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const SendEmail = ({ form }) => {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  if (!form) return null;

  const shareLink = `${window.location.origin}/fill/${form.shareId}`;

  const handleSendEmail = async () => {
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setSending(true);
      setSent(false);
      setError("");

      await sendEmail({
        email,
        formType: form.type,
        title: form.title,
        description: form.description,
        url: shareLink,
      });

      setSent(true);
      setTimeout(() => setSent(false), 2000);
    } catch (err) {
      console.error("Error while sending email:", err);
      setError("Failed to send email. Please try again.");
    } finally {
      setSending(false);
      setEmail("");
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-col w-full gap-2 sm:flex-row sm:items-center">
        <Input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={cn(
            "w-full h-9",
            error && "border-red-500 focus-visible:ring-red-500"
          )}
        />
        <Button
          variant="outline"
          onClick={handleSendEmail}
          disabled={sending}
          className="relative h-9 w-full sm:w-[140px] flex items-center justify-center gap-2 overflow-hidden"
        >
          {/* Default State */}
          <span
            className={cn(
              "absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300",
              !sending && !sent
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            )}
          >
            <Mail className="w-4 h-4" />
            Send Invite
          </span>

          {/* Sending State */}
          <span
            className={cn(
              "absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300",
              sending ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            )}
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </span>

          {/* Sent State */}
          <span
            className={cn(
              "absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300",
              sent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            )}
          >
            <Check className="w-4 h-4 text-green-500" />
            Sent!
          </span>
        </Button>
      </div>

      {/* Validation/Error Message */}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default SendEmail;
