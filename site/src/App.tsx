import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import DynamicPage from "./pages/DynamicPage";
import { useAdminStore } from "./store/adminStore";

export default function App() {
  const { config } = useAdminStore();

  useEffect(() => {
    const iconToUse = config.iconUrl || "/icon.png";
    if (iconToUse) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = iconToUse;
    }
  }, [config.iconUrl]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/page/:slug" element={<DynamicPage />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}
