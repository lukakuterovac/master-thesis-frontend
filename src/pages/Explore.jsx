import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ArrowRight,
  Filter,
  ArrowRightCircle,
  PenLine,
} from "lucide-react";
import axios from "@/lib/axios";
import { fmtDate } from "@/lib/helpers";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

const Explore = () => {
  const navigate = useNavigate();

  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: [],
  });

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await axios.get(`/form/public`);
        setForms(res.data);
      } catch (err) {
        console.error("Failed to fetch forms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const toggleFilter = (category, value) => {
    setFilters((prev) => {
      const isActive = prev[category].includes(value);
      const updatedCategory = isActive
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value];
      return { ...prev, [category]: updatedCategory };
    });
  };

  // Compute filtered forms
  const filteredForms = useMemo(() => {
    return forms.filter((f) => {
      const matchesSearch = searchTerm
        ? f.title?.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      const matchesType =
        filters.type.length > 0 ? filters.type.includes(f.type) : true;

      return matchesSearch && matchesType;
    });
  }, [forms, searchTerm, filters.type]);

  if (loading)
    return (
      <div className="h-screen flex flex-col justify-center items-center px-4">
        <Loader2 className="animate-spin" size={32} />
        <div className="text-center">Loading...</div>
      </div>
    );

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-3xl">
        <div className="text-4xl md:text-6xl font-bold mb-3 md:mb-4">
          Explore page
        </div>
        <div className="text-lg md:text-xl mb-4 text-gray-500">
          Browse through public forms, surveys and quizzes created on InForm and
          fill them out to help the creators gather the data they need.
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-6">
          <Input
            type="text"
            placeholder="Search your forms, surveys and quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:flex-1"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuLabel>Form Type</DropdownMenuLabel>
              {["form", "survey", "quiz"].map((type) => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={filters.type.includes(type)}
                  onCheckedChange={() => toggleFilter("type", type)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {filteredForms.length === 0 ? (
          <p className="text-muted-foreground text-center">
            No public forms match your search or filter.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredForms.map((f) => (
              <Card
                key={f._id}
                className="p-6 flex flex-col justify-between hover:border-purple-500"
              >
                <div className="flex flex-col gap-3">
                  <div
                    className="text-lg font-semibold line-clamp-2"
                    title={f.title || "(untitled)"}
                  >
                    {f.title || "(untitled)"}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-sm text-muted-foreground capitalize"
                    >
                      {f.type}
                    </Badge>
                  </div>

                  <div className="text-sm text-muted-foreground mt-1 truncate">
                    <div>
                      {f.questionCount ??
                        (Array.isArray(f.questions)
                          ? f.questions.length
                          : 0)}{" "}
                      question(s)
                    </div>
                    <div>Created {fmtDate(f.createdAt)}</div>
                  </div>
                </div>

                <Button
                  onClick={() => navigate(`/fill/${f.shareId}`)}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 hover:border-purple-500 hover:text-purple-500"
                >
                  Fill Form <PenLine className="w-4 h-4" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
