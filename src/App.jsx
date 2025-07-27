import AppRouter from "./router";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <>
      <Toaster position="bottom-center" richColors />
      <AppRouter />
    </>
  );
}

export default App;
