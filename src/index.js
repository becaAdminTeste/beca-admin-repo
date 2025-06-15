import "bootstrap/dist/css/bootstrap.min.css";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./assets/fonts/icofont/icofont.css";
import "./assets/fonts/inter.css";
import "./assets/fonts/material.css";
import "./assets/sass/styles.scss";
import { AppProvider } from "./context/AppProvider";
import { LoaderProvider } from "./context/Preloader";
import { SidebarProvider } from "./context/Sidebar";
import { ThemeProvider } from "./context/Themes";
import { LoginPage } from "./pages/auth";
import {
  ClientEditPage,
  ClientViewPage,
  CreateUsers,
  EcommercePage,
  IndicationPage,
  MyAccountPage,
  ProfessionalEditPage,
  ProfessionalPage,
  UserListPage,
} from "./pages/main";
import ProfessionalViewPage from "./pages/main/ProfessionalViewPage";
import RequestClientPage from "./pages/main/RequestClientPage";
import RequestProfessionalPage from "./pages/main/RequestProfessionalPage";
import { ErrorPage } from "./pages/others";

const router = createBrowserRouter([
  // MAIN PAGES
  { path: "/", element: <LoginPage /> },
  { path: "/home", element: <EcommercePage /> },
  { path: "/user-list", element: <UserListPage /> },
  { path: "/professional-list", element: <ProfessionalPage /> },
  { path: "/my-account", element: <MyAccountPage /> },
  { path: "/professional-view/:id", element: <ProfessionalViewPage /> },
  { path: "/client-view/:id", element: <ClientViewPage /> },
  { path: "/professional-edit/:id", element: <ProfessionalEditPage /> },
  { path: "/client-edit/:id", element: <ClientEditPage /> },
  { path: "/requestClient", element: <RequestClientPage /> },
  { path: "/requestProfessional", element: <RequestProfessionalPage /> },
  { path: "/create", element: <CreateUsers /> },
  { path: "/indications", element: <IndicationPage /> },
  { path: "/error", element: <ErrorPage /> },
]);

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <AppProvider>
      <LoaderProvider>
        <SidebarProvider>
          <AppProvider>
            <RouterProvider router={router} />
          </AppProvider>
        </SidebarProvider>
      </LoaderProvider>
    </AppProvider>
  </ThemeProvider>
);
