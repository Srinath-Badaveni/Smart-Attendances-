import { useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import HomeScreen from "./pages/HomeScreen";
import TeacherScreen from "./pages/TeacherScreen";
import StudentScreen from "./pages/StudentScreen";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./index.css";

function Router() {
  const { screen } = useApp();
  if (screen === "teacher") return <TeacherScreen />;
  if (screen === "student") return <StudentScreen />;
  return <HomeScreen />;
}

// Reads ?join-code= from the URL on first load and stores it in context,
// then redirects to the student screen and cleans the URL.
function JoinCodeHandler() {
  const { setScreen, setJoinCode } = useApp();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code   = params.get("join-code");
    if (code) {
      setJoinCode(code.toUpperCase().trim());
      setScreen("student");
      // Remove the param from the URL without a full page reload
      const clean = window.location.pathname;
      window.history.replaceState({}, "", clean);
    }
  }, []); // runs once on mount

  return null;
}

export default function App() {
  return (
    <AppProvider>
      <JoinCodeHandler />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex flex-col items-center">
          <Router />
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
}
