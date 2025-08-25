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
        <div className="text-md md:text-lg text-gray-600 dark:text-gray-400">
          Create, customize, and share forms, surveys, and quizzes with ease.
        </div>
      </div>

      {/* Key Features */}
      <div className="grid gap-6 md:grid-cols-3 mb-16">
        <Card className="group hover:border-purple-500 duration-300 transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary transition-all duration-[600ms] ease-in-out group-hover:rotate-180 group-hover:text-green-500" />
              Easy Builder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 dark:text-gray-400 transition-all duration-[600ms] ease-in-out group-hover:text-gray-900 dark:group-hover:text-gray-200">
              Easily add questions, customize options, and build forms, surveys
              and quizzes in minutes.
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:border-purple-500 duration-300 transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Workflow className="w-5 h-5 transition-all duration-[600ms] ease-in-out group-hover:rotate-x-180 group-hover:text-blue-500" />
              Smart Logic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 dark:text-gray-400 transition-all duration-[600ms] ease-in-out group-hover:text-gray-900 dark:group-hover:text-gray-200">
              Add logic so each user sees only relevant questions.
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:border-purple-500 duration-300 transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-zinc-400 transition-all duration-[600ms] ease-in-out group-hover:rotate-y-180 group-hover:text-purple-500" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 dark:text-gray-400 transition-all duration-[600ms] ease-in-out group-hover:text-gray-900 dark:group-hover:text-gray-200">
              Track responses, visualize data, and gain insights instantly.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold  mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="group hover:border-purple-500 duration-300 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 group-hover:text-green-500 text-primary transition-all group-hover:rotate-180 duration-[600ms] ease-in-out" />
                1. Create
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 duration-[600ms] ease-in-out">
                Build your form, survey, or quiz with our intuitive builder.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:border-purple-500 duration-300 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="w-5 h-5 group-hover:text-blue-500 transition-all group-hover:rotate-x-180 duration-[600ms] ease-in-out" />
                2. Share
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 duration-[600ms] ease-in-out">
                Use share links, QR codes or send invites via e-mail to reach
                your audience.
              </p>
            </CardContent>
          </Card>
          <Card className="group hover:border-purple-500 duration-300 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-5 h-5 group-hover:text-purple-500 transition-all group-hover:rotate-y-180 duration-[600ms] ease-in-out" />
                3. Analyze
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 duration-[600ms] ease-in-out">
                View responses, monitor engagement, and extract insights easily.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Actions */}
      <h2 className="text-2xl font-bold mb-8">Jump into action</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="group hover:border-purple-500 duration-300 transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-500 transition-all duration-[600ms] ease-in-out group-hover:rotate-180 group-hover:text-cyan-500" />
              Create
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-full">
            <p className="mb-4 text-gray-500 dark:text-gray-400 transition-all duration-[600ms] ease-in-out group-hover:text-gray-900 dark:group-hover:text-gray-200">
              Create a form, survey or quiz on InForm using our simple and
              intuitive builder.
            </p>
            <div className="mt-auto">
              <Link to="/create">
                <Button className="w-32 duration-[600ms] hover:bg-purple-500 hover:text-white">
                  Create
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:border-purple-500 duration-300 transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500 transition-all duration-[600ms] ease-in-out group-hover:rotate-x-180 group-hover:text-purple-400" />
              Explore
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-full">
            <p className="mb-4 text-gray-500 dark:text-gray-400 transition-all duration-[600ms] ease-in-out group-hover:text-gray-900 dark:group-hover:text-gray-200">
              Browse through your existing forms, surveys and quizzes or check
              out public ones.
            </p>
            <div className="mt-auto">
              <Link to="/explore">
                <Button className="w-32 duration-[600ms] hover:bg-purple-500 hover:text-white">
                  Explore
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard */}
      <Card className="group hover:border-purple-500 duration-300 transition-all mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-purple-500 transition-all duration-[600ms] ease-in-out group-hover:rotate-y-180 group-hover:text-blue-400" />
            Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-full">
          <p className="mb-4 text-gray-500 dark:text-gray-400 transition-all duration-[600ms] ease-in-out group-hover:text-gray-900 dark:group-hover:text-gray-200">
            Get an overview of your forms, surveys, and quizzes. Track
            responses, monitor engagement, and manage everything in one place.
          </p>
          <div className="mt-auto">
            <Link to="/dashboard">
              <Button className="w-32 duration-[600ms] hover:bg-purple-500 hover:text-white">
                Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
