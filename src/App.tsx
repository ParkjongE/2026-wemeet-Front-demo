import { Navigate, Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import { GuestOnly, RequireAuth, RequireChild, RequireNoChild } from "./auth/guards";
import { ToastProvider } from "./components/common/ToastProvider";
import AppHome from "./pages/AppHome";
import DiaryEntryPage from "./pages/DiaryEntryPage";
import StorybookNewPage from "./pages/StorybookNewPage";
import StorybookLibraryPage from "./pages/StorybookLibraryPage";
import StorybookDetailPage from "./pages/StorybookDetailPage";
import IntroPage from "./pages/IntroPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OnboardingPage from "./pages/OnboardingPage";
import SettingsPage from "./pages/SettingsPage";
import AppShell from "./components/layout/AppShell";

function RootLayout() {
  return (
    <div className="min-h-screen bg-canvas">
      <Outlet />
    </div>
  );
}

// useBlocker(이탈 경고)를 쓰려고 data router(createBrowserRouter)를 쓴다.
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/intro", element: <IntroPage /> },
      {
        element: <GuestOnly />,
        children: [
          { path: "/login", element: <LoginPage /> },
          { path: "/signup", element: <SignupPage /> },
        ],
      },
      {
        element: <RequireAuth />,
        children: [
          {
            element: <RequireNoChild />,
            children: [{ path: "/onboarding", element: <OnboardingPage /> }],
          },
          {
            element: <RequireChild />,
            children: [
              {
                element: <AppShell />,
                children: [
                  { path: "/", element: <AppHome /> },
                  { path: "/diary/:date", element: <DiaryEntryPage /> },
                  { path: "/storybooks", element: <StorybookLibraryPage /> },
                  { path: "/storybooks/new", element: <StorybookNewPage /> },
                  { path: "/storybooks/:id", element: <StorybookDetailPage /> },
                  { path: "/settings", element: <SettingsPage /> },
                ],
              },
            ],
          },
        ],
      },
      { path: "/storybook", element: <Navigate to="/storybooks/new" replace /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
