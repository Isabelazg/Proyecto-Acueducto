import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import BalancePage from "@/pages/balance/balancePage";
import PeriodPage from "@/pages/period/PeriodPage";
import PeoplePage from "@/pages/people/PeoplePage";
import { getCurrentPeriod } from "@/lib/utils";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to={`/periodo/${getCurrentPeriod()}`} replace />} />
        <Route path="periodo/:period" element={<PeriodPage />} />
        <Route path="personas" element={<PeoplePage />} />
        <Route path="balance" element={<BalancePage />} />
      </Route>
    </Routes>
  );
}
