import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sparkles,
  Plus,
  LayoutDashboard,
  BarChart,
  Link2,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Hero Section */}
      <div className="mb-16">
        <div className="text-md md:text-lg">Welcome to</div>
        <div className="text-[3rem] md:text-[5rem] font-bold">InForm</div>
        <div className="text-md md:text-lg text-gray-600">
          Create, customize, and share forms, surveys, and quizzes with ease.
        </div>
      </div>

      {/* Key Features */}
      <div className="grid gap-6 md:grid-cols-3 mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Easy Builder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Easily add questions, customize options, and build forms, surveys
              and quizzes in minutes.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Workflow className="w-5 h-5 text-green-500" />
              Smart Logic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Add logic so each user sees only relevant questions.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-zinc-400" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Track responses, visualize data, and gain insights instantly.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold  mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                1. Create
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Build your form, survey, or quiz with our intuitive builder.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="w-5 h-5 text-blue-500" />
                2. Share
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Use share links, QR codes or send invites via e-mail to reach
                your audience.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-5 h-5 text-purple-500" />
                3. Analyze
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                View responses, monitor engagement, and extract insights easily.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Actions */}
      <h2 className="text-2xl font-bold  mb-8">Jump into action</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Create
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-full">
            <p className="mb-4 text-gray-600">
              Create a form, survey or quiz on InForm using our simple and
              intuitive builder.
            </p>
            <div className="mt-auto">
              <Link to="/create">
                <Button className="w-32">Create</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Explore
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-full">
            <p className="mb-4 text-gray-600">
              Browse through your existing forms, surveys and quizzes or check
              out public ones.
            </p>
            <div className="mt-auto">
              <Link to="/explore">
                <Button className="w-32">Explore</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-purple-500" />
            Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-full">
          <p className="mb-4 text-gray-600">
            Get an overview of your forms, surveys, and quizzes. Track
            responses, monitor engagement, and manage everything in one place.
          </p>
          <div className="mt-auto">
            <Link to="/dashboard">
              <Button className="w-32">Dashboard</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
