import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Courses from "@/pages/Courses";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import MagicLogin from "@/pages/MagicLogin";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import { AuthProvider } from "@/lib/auth";
import { AdminAuthProvider } from "@/lib/adminAuth";
import AiSupportWidget from "@/components/AiSupportWidget";
import { useLocation } from "wouter";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, staleTime: 1000 * 60 * 5 }
  }
});

function Router() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");

  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/courses" component={Courses} />
        <Route path="/login" component={Login} />
        <Route path="/dashboard/:studentId" component={Dashboard} />
        <Route path="/magic/:token" component={MagicLogin} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
      {!isAdminRoute && <AiSupportWidget />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AdminAuthProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </AdminAuthProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
