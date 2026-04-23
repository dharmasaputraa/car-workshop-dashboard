import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  ThemedLayout,
  ThemedSider,
  useNotificationProvider,
} from "@refinedev/antd";
import { AuditOutlined, CarOutlined, UserOutlined } from "@ant-design/icons";
import "@refinedev/antd/dist/reset.css";

import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { App as AntdApp } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { Header } from "./components/header";
import { CustomTitle } from "./components/title";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { CarCreate, CarEdit, CarList, CarShow } from "./pages/cars";
import {
  ServiceCreate,
  ServiceEdit,
  ServiceList,
  ServiceShow,
} from "./pages/services";
import { ForgotPassword } from "./pages/forgotPassword";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import {
  UserCreate,
  UserEdit,
  UserList,
  UserShow,
  UserChangeRole,
} from "./pages/users";
import { accessControlProvider } from "./providers/accessControl";
import { authProvider } from "./providers/auth";
import { dataProvider } from "./providers/data";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider}
                notificationProvider={useNotificationProvider}
                routerProvider={routerProvider}
                authProvider={authProvider}
                accessControlProvider={accessControlProvider}
                resources={[
                  {
                    name: "cars",
                    list: "/cars",
                    create: "/cars/create",
                    edit: "/cars/edit/:id",
                    show: "/cars/show/:id",
                    meta: {
                      canDelete: true,
                      label: "Cars",
                      include: "owner",
                      icon: <CarOutlined />,
                    },
                  },
                  {
                    name: "services",
                    list: "/services",
                    create: "/services/create",
                    edit: "/services/edit/:id",
                    show: "/services/show/:id",
                    meta: {
                      canDelete: true,
                      label: "Services",
                      icon: <AuditOutlined />,
                    },
                  },
                  // {
                  //   name: "work_orders",
                  //   list: "/work-orders",
                  //   create: "/work-orders/create",
                  //   edit: "/work-orders/edit/:id",
                  //   show: "/work-orders/show/:id",
                  //   meta: {
                  //     canDelete: true,
                  //     label: "Work Orders",
                  //   },
                  // },
                  // {
                  //   name: "mechanic_assignments",
                  //   list: "/mechanic-assignments",
                  //   create: "/mechanic-assignments/create",
                  //   edit: "/mechanic-assignments/edit/:id",
                  //   show: "/mechanic-assignments/show/:id",
                  //   meta: {
                  //     canDelete: true,
                  //     label: "Mechanic Assignments",
                  //   },
                  // },
                  // {
                  //   name: "complaints",
                  //   list: "/complaints",
                  //   create: "/complaints/create",
                  //   edit: "/complaints/edit/:id",
                  //   show: "/complaints/show/:id",
                  //   meta: {
                  //     canDelete: true,
                  //     label: "Complaints",
                  //   },
                  // },
                  // {
                  //   name: "invoices",
                  //   list: "/invoices",
                  //   create: "/invoices/create",
                  //   edit: "/invoices/edit/:id",
                  //   show: "/invoices/show/:id",
                  //   meta: {
                  //     canDelete: true,
                  //     label: "Invoices",
                  //   },
                  // },
                  {
                    name: "users",
                    list: "/users",
                    create: "/users/create",
                    edit: "/users/edit/:id",
                    show: "/users/show/:id",
                    meta: {
                      canDelete: true,
                      label: "Users",
                      icon: <UserOutlined />,
                    },
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  projectId: "ZmWf4d-l86Ce8-FiLNSJ",
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayout
                          Header={Header}
                          Title={CustomTitle}
                          Sider={(props) => <ThemedSider {...props} fixed />}
                        >
                          <Outlet />
                        </ThemedLayout>
                      </Authenticated>
                    }
                  >
                    <Route
                      index
                      element={<NavigateToResource resource="work_orders" />}
                    />
                    <Route path="/cars">
                      <Route index element={<CarList />} />
                      <Route path="create" element={<CarCreate />} />
                      <Route path="edit/:id" element={<CarEdit />} />
                      <Route path="show/:id" element={<CarShow />} />
                    </Route>
                    <Route path="/services">
                      <Route index element={<ServiceList />} />
                      <Route path="create" element={<ServiceCreate />} />
                      <Route path="edit/:id" element={<ServiceEdit />} />
                      <Route path="show/:id" element={<ServiceShow />} />
                    </Route>
                    {/* <Route path="/work-orders">
                      <Route index element={<BlogPostList />} />
                      <Route path="create" element={<BlogPostCreate />} />
                      <Route path="edit/:id" element={<BlogPostEdit />} />
                      <Route path="show/:id" element={<BlogPostShow />} />
                    </Route>
                    <Route path="/mechanic-assignments">
                      <Route index element={<BlogPostList />} />
                      <Route path="create" element={<BlogPostCreate />} />
                      <Route path="edit/:id" element={<BlogPostEdit />} />
                      <Route path="show/:id" element={<BlogPostShow />} />
                    </Route>
                    <Route path="/complaints">
                      <Route index element={<BlogPostList />} />
                      <Route path="create" element={<BlogPostCreate />} />
                      <Route path="edit/:id" element={<BlogPostEdit />} />
                      <Route path="show/:id" element={<BlogPostShow />} />
                    </Route>
                    <Route path="/invoices">
                      <Route index element={<BlogPostList />} />
                      <Route path="create" element={<BlogPostCreate />} />
                      <Route path="edit/:id" element={<BlogPostEdit />} />
                      <Route path="show/:id" element={<BlogPostShow />} />
                    </Route> */}
                    <Route path="/users">
                      <Route index element={<UserList />} />
                      <Route path="create" element={<UserCreate />} />
                      <Route path="edit/:id" element={<UserEdit />} />
                      <Route path="show/:id" element={<UserShow />} />
                      <Route
                        path="change-role/:id"
                        element={<UserChangeRole />}
                      />
                    </Route>
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
