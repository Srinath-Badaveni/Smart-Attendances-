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

export default function App() {
  return (
    <AppProvider>
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
