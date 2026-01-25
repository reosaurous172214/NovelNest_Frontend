import { createContext, useContext, useState } from "react";
import Alert from "../components/ui/Alert";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  const showAlert = (msg, type = "error", time = 3000) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), time);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {alert && <Alert {...alert} />}
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
