import React, { Suspense } from "react";
import { BrowserRouter, Route, Redirect, Switch, useLocation } from "react-router-dom";
import Home from "./home/pages/Home";
import AuthContext from "./shared/components/contexts/AuthContext";
import { NotificationProvider } from "./shared/components/contexts/NotificationContext";
import useAuth from "./shared/components/hooks/auth-hook";
import Loading from "./shared/components/UIComponents/Loading";


const NewEvent = React.lazy(() => import("./places/pages/NewEvent"));
const Auth = React.lazy(() => import("./user/pages/Auth"));

const AppRoutes = ({ isLoggedIn }) => {
  const location = useLocation();
  const routes = isLoggedIn ? (
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/events/new/" exact>
        <NewEvent />
      </Route>
      <Redirect to="/" />
    </Switch>
  ) : (
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/events/new/" exact>
        <NewEvent />
      </Route>
      <Route path="/auth">
        <Auth />
      </Route>
      <Redirect to="/auth" />
    </Switch>
  );

  return (
    <>
      {/* {location.pathname !== "/auth" && <Header />} */}
      <main>
        <Suspense fallback={<div className="center"><Loading /></div>}>
          {routes}
        </Suspense>
      </main>
    </>
  );
};

function App() {
  const { token, login, logout, userId } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <NotificationProvider>
        <BrowserRouter>
          <AppRoutes isLoggedIn={!!token} />
        </BrowserRouter>
      </NotificationProvider>
    </AuthContext.Provider>
  );
}

export default App;
