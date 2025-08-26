import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Crown,
  Medal,
  Sparkles,
  Trophy,
} from "lucide-react";
import { getQuizResults } from "@/features/form";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const QuizLeaderboard = () => {
  const { id } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  const userToken = localStorage.getItem(`quiz-${id}`);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await getQuizResults(id);
        setLeaderboard(res.leaderboard);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch results. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  const totalPages = Math.ceil(leaderboard.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const currentResults = leaderboard.slice(
    startIndex,
    startIndex + resultsPerPage
  );

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 p-6 text-center">
        <div className="text-3xl flex items-center justify-center gap-2 font-bold">
          <Trophy className="text-yellow-400" size={28} />
          Leaderboard
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          See your position and the top scorers in this quiz
        </p>
      </div>

      {/* Loading/Error/Empty */}
      {loading ? (
        <div className="text-center text-gray-500">Loading results...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center text-gray-500">No results yet.</div>
      ) : (
        <>
          {/* Leaderboard */}
          <Card className="overflow-hidden shadow rounded-xl border p-0">
            <CardContent className="p-0 bg-secondary">
              <div className="grid grid-cols-12 gap-4 font-semibold border-b px-6 py-3">
                <div className="col-span-2 text-center">Place</div>
                <div className="col-span-8 text-left">Name</div>
                <div className="col-span-2 text-center">Score</div>
              </div>
              <ul className="divide-y">
                {currentResults.map((entry, idx) => {
                  const isCurrentUser = entry.userToken === userToken;
                  return (
                    <li
                      key={startIndex + idx}
                      className={`grid grid-cols-12 gap-4 px-6 py-4 items-center  ${
                        isCurrentUser ? "font-bold" : ""
                      }`}
                    >
                      <div
                        className={cn(
                          "col-span-2 flex items-center justify-center",
                          startIndex + idx + 1 == 1
                            ? "text-yellow-300 font-bold"
                            : startIndex + idx + 1 == 2
                            ? "text-gray-500 font-bold"
                            : startIndex + idx + 1 == 3
                            ? "text-yellow-700 font-bold"
                            : ""
                        )}
                      >
                        {startIndex + idx + 1}
                        {startIndex + idx + 1 == 1 && (
                          <Medal className="ml-1 w-5" />
                        )}
                      </div>
                      <div className="col-span-8 text-left">
                        {entry.name || "Anonymous"}
                        {isCurrentUser && (
                          <Badge className="ml-2 bg-purple-500 text-white">
                            You
                          </Badge>
                        )}
                      </div>
                      <div className="col-span-2 text-center">
                        {entry.totalScore}/{entry.maxScore} (
                        {Math.round(entry.percentage)}%)
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-6 w-full max-w-sm mx-auto">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="flex-1 max-w-[120px] justify-center"
            >
              <ChevronLeft className="mr-2" />
              Previous
            </Button>

            <span className="text-gray-500 font-medium text-center flex-1">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="flex-1 max-w-[120px] justify-center"
            >
              Next
              <ChevronRight className="ml-2" />
            </Button>
          </div>
        </>
      )}

      <div className="flex justify-center mt-8">
        <Link to="/explore">
          <Button variant="ghost" className="hover:text-yellow-500 font-normal">
            <Sparkles className="mr-2" />
            Explore other forms
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default QuizLeaderboard;
