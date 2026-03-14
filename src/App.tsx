import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";

// Wrapper to handle dynamic import failures during deployments
const lazyWithRetry = (componentImport: () => Promise<any>) =>
  lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem('page-has-been-force-refreshed') || 'false'
    );

    try {
      const component = await componentImport();
      window.sessionStorage.setItem('page-has-been-force-refreshed', 'false');
      return component;
    } catch (error: any) {
      // If the chunk failed to load, it might be due to a new deployment removing old files.
      if (!pageHasAlreadyBeenForceRefreshed && error?.message?.includes('Failed to fetch dynamically imported module')) {
        window.sessionStorage.setItem('page-has-been-force-refreshed', 'true');
        window.location.reload();
        // Return an empty promise to prevent React from throwing while the page reloads
        return new Promise<{ default: React.ComponentType<any> }>(() => {});
      }
      throw error;
    }
  });

const Index = lazyWithRetry(() => import("./pages/Index"));
const HotelDetails = lazyWithRetry(() => import("./pages/HotelDetails"));
const NotFound = lazyWithRetry(() => import("./pages/NotFound"));

const App = () => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && (event.data.type === 'RELOAD_APP' || event.data.type === 'PUSH_RECEIVED')) {
        // Soft refresh without page reload
        window.dispatchEvent(new Event('refreshMenus'));
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleMessage);
    }
    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      }
    };
  }, []);

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/hotel/:id" element={<HotelDetails />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;
