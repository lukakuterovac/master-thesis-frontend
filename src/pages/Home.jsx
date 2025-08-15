import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-justify mb-12">
        <div className="text-md md:text-lg">Welcome to</div>
        <div className="text-[4rem] md:text-[5rem] font-bold">InForm</div>
        <div className="text-md  md:text-lg">
          Create, customize, and share forms, surveys, and quizzes with ease.
        </div>
      </div>

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
    </div>
  );
};

export default Home;
