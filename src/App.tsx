import { Routes, Route, useLocation } from "react-router";
import { AnimatePresence } from "framer-motion";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RootLayout from "./components/layouts/RootLayout";
import TenantScreen from "./screens/TenantScreen";
import LandlordSreen from "./screens/LandLordScreen";
import LogScreen from "./screens/LogScreen";
import AlertScreen from "./screens/AlertScreen";
import RequireAuth from "./components/layouts/RequireAuth";
import PersistLogin from "./components/layouts/PersistLogin";
import PageWrapper from "./components/layouts/PageWrapper";
import LandlordDetailScreen from "./screens/LandlordDetailScreen";
import TenantDetailScreen from "./screens/TenantDetailScreen";
import LandlordLogScreen from "./screens/LandlordLogScreen";
import TenantLogScreen from "./screens/TenantLogScreen";

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          element={
            <PageWrapper>
              <RootLayout />
            </PageWrapper>
          }
        >
          <Route
            path="login"
            element={
              <PageWrapper>
                <LoginScreen />
              </PageWrapper>
            }
          />
          <Route
            element={
              <PageWrapper>
                <PersistLogin />
              </PageWrapper>
            }
          >
            <Route element={<RequireAuth />}>
              <Route
                index
                element={
                  <PageWrapper>
                    <HomeScreen />
                  </PageWrapper>
                }
              />
              <Route
                path="tenants/new"
                element={
                  <PageWrapper>
                    <TenantScreen />
                  </PageWrapper>
                }
              />
              <Route
                path="/tenants/:id"
                element={
                  <PageWrapper>
                    <TenantDetailScreen />
                  </PageWrapper>
                }
              />
              <Route
                path="landlords/new"
                element={
                  <PageWrapper>
                    <LandlordSreen />
                  </PageWrapper>
                }
              />
              <Route
                path="landlords/:id"
                element={
                  <PageWrapper>
                    <LandlordDetailScreen />
                  </PageWrapper>
                }
              />
              <Route
                path="logs"
                element={
                  <PageWrapper>
                    <LogScreen />
                  </PageWrapper>
                }
              />
              <Route
                path="landlords"
                element={
                  <PageWrapper>
                    <LandlordLogScreen />
                  </PageWrapper>
                }
              />
              <Route
                path="tenants"
                element={
                  <PageWrapper>
                    <TenantLogScreen />
                  </PageWrapper>
                }
              />
              <Route
                path="alerts"
                element={
                  <PageWrapper>
                    <AlertScreen />
                  </PageWrapper>
                }
              />
            </Route>
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
