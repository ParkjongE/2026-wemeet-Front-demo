import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import { GuestOnly, RequireAuth, RequireChild, RequireNoChild } from "./auth/guards";
import { DiaryProvider } from "./context/DiaryContext";
import AppHome from "./pages/AppHome";
import DiaryEntryPage from "./pages/DiaryEntryPage";
import StorybookPage from "./pages/StorybookPage";
import IntroPage from "./pages/IntroPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OnboardingPage from "./pages/OnboardingPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <AuthProvider>
      <DiaryProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-ivory">
            <Routes>
              <Route path="/intro" element={<IntroPage />} />

              <Route element={<GuestOnly />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
              </Route>

              <Route element={<RequireAuth />}>
                <Route element={<RequireNoChild />}>
                  <Route path="/onboarding" element={<OnboardingPage />} />
                </Route>
                <Route element={<RequireChild />}>
                  <Route path="/" element={<AppHome />} />
                  <Route path="/diary/:date" element={<DiaryEntryPage />} />
                  <Route path="/storybooks/new" element={<StorybookPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>
              </Route>

              <Route path="/storybook" element={<Navigate to="/storybooks/new" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </DiaryProvider>
    </AuthProvider>
  );
}

export default App;
