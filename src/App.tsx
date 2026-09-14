import { HashRouter, Routes, Route } from "react-router-dom";
import { DiaryProvider } from "./context/DiaryContext";
import AppHome from "./pages/AppHome";
import DiaryEntryPage from "./pages/DiaryEntryPage";
import StorybookPage from "./pages/StorybookPage";
import IntroPage from "./pages/IntroPage";

function App() {
  return (
    <DiaryProvider>
      <HashRouter>
        <div className="min-h-screen bg-ivory">
          <Routes>
            <Route path="/" element={<AppHome />} />
            <Route path="/diary/:date" element={<DiaryEntryPage />} />
            <Route path="/storybook" element={<StorybookPage />} />
            <Route path="/intro" element={<IntroPage />} />
          </Routes>
        </div>
      </HashRouter>
    </DiaryProvider>
  );
}

export default App;
