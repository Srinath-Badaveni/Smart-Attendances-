import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [screen,   setScreen]   = useState("home"); // 'home' | 'teacher' | 'student'
  const [teacher,  setTeacher]  = useState(null);
  const [student,  setStudent]  = useState(null);
  const [joinCode, setJoinCode] = useState(null); // pending join-code from URL param

  const logoutTeacher = () => { setTeacher(null); setScreen("home"); };
  const logoutStudent = () => { setStudent(null); setScreen("home"); };

  return (
    <AppContext.Provider
      value={{
        screen, setScreen,
        teacher, setTeacher,
        student, setStudent,
        joinCode, setJoinCode,
        logoutTeacher, logoutStudent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
