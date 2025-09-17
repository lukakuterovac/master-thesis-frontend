import { Loader2 } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="flex flex-col flex-1 items-center justify-center animate-pulse">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="animate-spin" size={48} />
        <div className="text-center">Loading</div>
      </div>
    </div>
  );
};

export default LoadingScreen;
