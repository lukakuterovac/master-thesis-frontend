import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-justify mb-12">
        <div className="text-lg">Welcome to</div>
        <div className="relative text-[5rem] font-bold">InForm</div>
        <div className="text-lg">
          Create, customize, and share forms, surveys, and quizzes with ease.
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Create New Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">
              Start from scratch or use a template to build your own form.
            </p>
            <Link to="/create">
              <Button>Create Form</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Explore Forms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">
              Browse through your existing forms or check out public ones.
            </p>
            <Link to="/dashboard">
              <Button variant="outline">View Forms</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
