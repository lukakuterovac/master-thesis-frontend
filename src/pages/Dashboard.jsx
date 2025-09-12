import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Edit,
  Upload,
  Plus,
  Lock,
  Filter,
  TextSearch,
  Unlock,
  Copy,
  Check,
  Mail,
  QrCode,
  Share,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

import {
  getUserForms as getForms,
  updateForm as updateFormApi,
} from "@/features/form";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toReadableLabel } from "@/lib/helpers";
import { useAuth } from "@/contexts/AuthContext";
import { QRCodeCanvas } from "qrcode.react";
import { fmtDate } from "@/lib/helpers";
import SendEmail from "@/components/SendEmail";

const Dashboard = () => {
  const { user } = useAuth();

  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [confirmPublish, setConfirmPublish] = useState(null);

  // Sharing
  const [copied, setCopied] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(null);
  const [shareLink, setShareLink] = useState(null);

  const [doing, setDoing] = useState(false);

  const navigate = useNavigate();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: [],
    type: [],
    privacy: [],
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const formsPerPage = 5;

  // Filter & search forms
  const filteredForms = forms.filter((form) => {
    // Search by title
    const matchesSearch = searchQuery
      ? form.title?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    // Status filter
    const matchesStatus =
      filters.status.length > 0
        ? filters.status.includes(toReadableLabel(form.state))
        : true;

    // Type filter
    const matchesType =
      filters.type.length > 0 ? filters.type.includes(form.type) : true;

    // Privacy filter
    const matchesPrivacy =
      filters.privacy.length > 0
        ? filters.privacy.includes(form.isPublic ? "Public" : "Private")
        : true;

    return matchesSearch && matchesStatus && matchesType && matchesPrivacy;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredForms.length / formsPerPage)
  );
  const indexOfLastForm = currentPage * formsPerPage;
  const indexOfFirstForm = indexOfLastForm - formsPerPage;
  const currentForms = filteredForms.slice(indexOfFirstForm, indexOfLastForm);

  const getTotalPages = (len, perPage) => Math.max(1, Math.ceil(len / perPage));

  // Ensure page is valid if filteredForms shrinks
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  // Handlers for SearchAndFilter component
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (updatedFilters) => {
    setFilters(updatedFilters);
    setCurrentPage(1);
  };

  const fetchForms = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getForms();

      const sorted = Array.isArray(data)
        ? [...data].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        : [];

      setForms(sorted);
    } catch (error) {
      if (!error.isHandled) {
        toast.error("Failed to load your forms.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  const onEdit = (form) => {
    navigate(`/edit/${form._id}`);
  };

  const onViewResponses = async (form) => {
    navigate(`/responses/${form._id}`, { state: { form: form } });
  };

  const onChangeState = (form) => {
    setConfirmPublish(form);
  };

  const confirmPublishNow = async () => {
    const form = confirmPublish;
    if (!form) return;

    setDoing(true);

    const id = form._id;

    // Determine next state
    const nextStateMap = {
      draft: "live",
      live: "closed",
      closed: "live",
    };
    const nextState = nextStateMap[form.state] || "draft";

    const prevForms = forms;

    setForms(forms.map((f) => (f._id === id ? { ...f, state: nextState } : f)));

    try {
      const res = await updateFormApi(id, { state: nextState });
      setForms((list) =>
        list.map((f) => ((f._id || f.id) === (res._id || res.id) ? res : f))
      );
      toast.success(
        `${toReadableLabel(form.type)} state changed to '${toReadableLabel(
          nextState
        )}'`
      );
    } catch (error) {
      setForms(prevForms);
      if (!error.isHandled) {
        toast.error(`Failed to change ${form.type} state.`);
      }
    } finally {
      setConfirmPublish(null);
      setDoing(false);
    }
  };

  const onShare = (form) => {
    setShareLink(`${window.location.origin}/fill/${form.shareId}`);

    setShareDialogOpen(form);
  };

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const renderActionButtons = (form) => {
    return (
      <div className="flex gap-2">
        {(form.state === "live" || form.state === "closed") && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onViewResponses(form)}
            title="View responses"
          >
            <TextSearch className="w-4 h-4" />
            <span className="font-light hidden md:inline">Responses</span>
          </Button>
        )}

        <Button
          size="sm"
          variant="ghost"
          onClick={() => onEdit(form)}
          title={`Edit ${form.type}`}
        >
          <Edit className="w-4 h-4" />
          <span className="font-light hidden md:inline">Edit</span>
        </Button>

        {(form.state === "draft" ||
          form.state === "live" ||
          form.state === "closed") && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onChangeState(form)}
            title={
              form.state === "live"
                ? `Close ${form.type}`
                : form.state === "draft"
                ? `Publish ${form.type}`
                : `Reopen ${form.type}`
            }
          >
            {form.state === "live" ? (
              <Lock className="w-4 h-4" />
            ) : form.state === "draft" ? (
              <Upload className="w-4 h-4" />
            ) : (
              <Unlock className="w-4 h-4" />
            )}

            <span className="font-light hidden md:inline">
              {form.state === "live"
                ? "Close"
                : form.state === "draft"
                ? "Publish"
                : "Reopen"}
            </span>
          </Button>
        )}

        {form.state === "live" && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onShare(form)}
            title={`Share ${form.type}`}
          >
            <Share />
            <span className="font-light hidden md:inline">Share</span>
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-4xl md:text-6xl font-bold mb-6 md:mb-12 truncate">
        {user.username}
      </div>
      <div className="text-2xl md:text-3xl font-bold  mb-3 dark:text-gray-400 text-gray-600">
        Dashboard
      </div>

      <SearchAndFilter
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />

      <div className="flex-col space-y-3 grow-0">
        {loading ? (
          <div className="text-muted-foreground text-center">Loading...</div>
        ) : filteredForms.length === 0 ? (
          <div className="text-muted-foreground text-center">
            {searchQuery || Object.values(filters).some((arr) => arr.length > 0)
              ? "No forms found."
              : "No forms yet."}
          </div>
        ) : (
          currentForms.map((f) => (
            <Card
              key={f._id}
              className="p-6 hover:border-purple-500 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-3 sm:gap-0">
                {/* Left section */}
                <div className="flex flex-col sm:gap-3">
                  <div
                    className="text-lg font-semibold line-clamp-2"
                    title={f.title || "(untitled)"}
                  >
                    {f.title || "(untitled)"}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-1 sm:mt-0">
                    <Badge
                      variant="outline"
                      className="text-sm text-muted-foreground capitalize"
                    >
                      {f.type}
                    </Badge>

                    <Badge
                      className={cn(
                        {
                          "bg-slate-500": f.state === "draft",
                          "bg-green-700": f.state === "live",
                          "bg-red-700": f.state === "closed",
                        },
                        "text-white text-sm"
                      )}
                    >
                      {toReadableLabel(f.state)}
                    </Badge>

                    {f.state === "live" && (
                      <Badge
                        className={
                          f.isPublic
                            ? "bg-blue-500 text-white text-sm"
                            : "bg-yellow-300 text-black text-sm"
                        }
                      >
                        {f.isPublic ? "Public" : "Private"}
                      </Badge>
                    )}
                  </div>

                  <div className="text-sm text-muted-foreground mt-1 sm:mt-0 sm:ml-2 truncate">
                    <div>
                      {(() => {
                        const count =
                          f.questionCount ??
                          (Array.isArray(f.questions) ? f.questions.length : 0);

                        return `${count} question${count === 1 ? "" : "s"}`;
                      })()}
                    </div>
                    <div>Created {fmtDate(f.createdAt)}</div>
                  </div>
                </div>

                {/* Right section */}
                <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                  {renderActionButtons(f)}
                </div>
              </div>
            </Card>
          ))
        )}
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    currentPage > 1 && setCurrentPage(currentPage - 1)
                  }
                  className={cn(
                    currentPage === 1 && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={currentPage === i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    currentPage < totalPages && setCurrentPage(currentPage + 1)
                  }
                  className={cn(
                    currentPage === totalPages &&
                      "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* Change state confirmation */}
      <Dialog
        open={!!confirmPublish}
        onOpenChange={() => setConfirmPublish(null)}
      >
        <DialogContent>
          <h3 className="text-lg font-semibold">Change form state</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Are you sure you want to change "{confirmPublish?.title}" from{" "}
            {toReadableLabel(confirmPublish?.state)} to{" "}
            {toReadableLabel(
              { draft: "live", live: "closed", closed: "draft" }[
                confirmPublish?.state
              ]
            )}
            ?
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirmPublish(null)}>
              Cancel
            </Button>
            <Button onClick={confirmPublishNow} disabled={doing}>
              {doing
                ? "Working..."
                : `Change to ${
                    { draft: "Live", live: "Closed", closed: "Live" }[
                      confirmPublish?.state
                    ]
                  }`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share dialog */}
      <Dialog
        open={!!shareDialogOpen}
        onOpenChange={() => setShareDialogOpen(null)}
      >
        <DialogContent>
          <div className="text-lg font-medium">Share</div>

          <div className="flex justify-center my-4">
            <QRCodeCanvas value={shareLink} size={200} />
          </div>

          {/* Copy Link Button */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleCopyShareLink}
              className="relative w-full h-9 flex items-center justify-center gap-2 overflow-hidden"
            >
              {/* Copy State */}
              <span
                className={cn(
                  "absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300",
                  copied
                    ? "opacity-0 translate-y-2"
                    : "opacity-100 translate-y-0"
                )}
              >
                <Copy className="w-4 h-4" />
                Copy share link
              </span>

              {/* Copied State */}
              <span
                className={cn(
                  "absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300",
                  copied
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2"
                )}
              >
                <Check className="w-4 h-4 text-green-500" />
                Copied!
              </span>
            </Button>
          </div>

          <SendEmail form={shareDialogOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const SearchAndFilter = ({ onSearch, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: [],
    status: [],
    privacy: [],
  });
  const navigate = useNavigate();

  const toggleFilter = (category, value) => {
    setFilters((prev) => {
      const isActive = prev[category].includes(value);
      const updatedCategory = isActive
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value];
      const updated = { ...prev, [category]: updatedCategory };

      onFilterChange?.(updated);

      return updated;
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-6">
      <Button
        variant="outline"
        onClick={() => navigate("/create")}
        className="hover:border-purple-500 dark:hover:border-purple-500 hover:text-purple-500"
      >
        <Plus />
        <span className="hidden xs:inline">Create</span>
      </Button>

      {/* Search input */}
      <Input
        type="text"
        placeholder="Search your forms, surveys and quizzes..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          onSearch?.(e.target.value);
        }}
        className="sm:flex-1 hover:border-purple-500 dark:hover:border-purple-500 focus-visible:border-purple-500 dark:focus-visible:border-purple-500"
      />

      {/* Filter dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="hover:border-purple-500 dark:hover:border-purple-500 hover:text-purple-500"
          >
            <Filter className="mr-2" />
            Filters
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          {/* Form Type */}
          <DropdownMenuLabel>Form Type</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={filters.type.includes("form")}
            onCheckedChange={() => toggleFilter("type", "form")}
            onSelect={(e) => e.preventDefault()}
          >
            Form
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.type.includes("survey")}
            onCheckedChange={() => toggleFilter("type", "survey")}
            onSelect={(e) => e.preventDefault()}
          >
            Survey
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.type.includes("quiz")}
            onCheckedChange={() => toggleFilter("type", "quiz")}
            onSelect={(e) => e.preventDefault()}
          >
            Quiz
          </DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />

          {/* Status */}
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={filters.status.includes("Draft")}
            onCheckedChange={() => toggleFilter("status", "Draft")}
            onSelect={(e) => e.preventDefault()}
          >
            Draft
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.status.includes("Live")}
            onCheckedChange={() => toggleFilter("status", "Live")}
            onSelect={(e) => e.preventDefault()}
          >
            Live
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.status.includes("Closed")}
            onCheckedChange={() => toggleFilter("status", "Closed")}
            onSelect={(e) => e.preventDefault()}
          >
            Closed
          </DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />

          {/* Privacy */}
          <DropdownMenuLabel>Privacy</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={filters.privacy.includes("Public")}
            onCheckedChange={() => toggleFilter("privacy", "Public")}
            onSelect={(e) => e.preventDefault()}
          >
            Public
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.privacy.includes("Private")}
            onCheckedChange={() => toggleFilter("privacy", "Private")}
            onSelect={(e) => e.preventDefault()}
          >
            Private
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Dashboard;
