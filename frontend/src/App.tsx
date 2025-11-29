import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import BondsPage from "./pages/BondsPage";
import PortfolioPage from "./pages/PortfolioPage";
import PortfolioDetailPage from "./pages/PortfolioDetailPage";
import { NotificationProvider } from './components/context/NotificationContext';
import { GlobalNotification } from './components/common/GlobalNotification';
export default function App() {

  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />}></Route>
          <Route path="/register" element={<RegisterPage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/bonds" element={<BondsPage />}></Route>
          <Route path="/portfolio" element={<PortfolioPage />}></Route>
          <Route path="/portfolio/:id" element={<PortfolioDetailPage />}></Route>
        </Routes>
      </BrowserRouter >
      <GlobalNotification />
    </NotificationProvider>
  );
}
