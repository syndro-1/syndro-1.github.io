import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TryHackMe from "./pages/TryHackMe";
import HackTheBox from "./pages/HackTheBox";
import PatriotCTF from "./pages/PatriotCTF";
import NiteCTF from "./pages/NiteCTF";
import Events from "./pages/Events";
import CTFEvent from "./pages/CTFEvent";
import WriteupPage from "./pages/WriteupPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/events" element={<Events />} />
          <Route path="/ctf/:eventSlug" element={<CTFEvent />} />
          <Route path="/tryhackme" element={<TryHackMe />} />
          <Route path="/hackthebox" element={<HackTheBox />} />
          <Route path="/patriotctf2025" element={<PatriotCTF />} />
          <Route path="/nitectf2025" element={<NiteCTF />} />
          <Route path="/writeup/:slug" element={<WriteupPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
