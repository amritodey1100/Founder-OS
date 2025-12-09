import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import AuthenticatedApp from "./AuthenticatedApp";

export default function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}
