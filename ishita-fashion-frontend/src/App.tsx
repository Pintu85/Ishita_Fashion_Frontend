import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Vendors from "./pages/Vendors";
import Parties from "./pages/Parties";
import Items from "./pages/Items";
import Inward from "./pages/Inward";
import Outward from "./pages/Outward";
import VendorPayment from "./pages/VendorPayment";
import PaymentReceived from "./pages/PaymentReceived";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/vendors" element={<Layout><Vendors /></Layout>} />
          <Route path="/parties" element={<Layout><Parties /></Layout>} />
          <Route path="/items" element={<Layout><Items /></Layout>} />
          <Route path="/inward" element={<Layout><Inward /></Layout>} />
          <Route path="/outward" element={<Layout><Outward /></Layout>} />
          <Route path="/vendor-payment" element={<Layout><VendorPayment /></Layout>} />
          <Route path="/payment-received" element={<Layout><PaymentReceived /></Layout>} />
          <Route path="/reports" element={<Layout><Reports /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
