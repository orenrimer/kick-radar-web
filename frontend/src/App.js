import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './home/pages/Home';
import AuthContext from './shared/components/contexts/AuthContext';
import { NotificationProvider } from './shared/components/contexts/NotificationContext';
import useAuth from './shared/components/hooks/auth-hook';
import Loading from './shared/components/UIComponents/Loading';

const NewEvent = React.lazy(() => import('./places/pages/NewEvent'));
const Login = React.lazy(() => import('./user/pages/Login'));
const Signup = React.lazy(() => import('./user/pages/Signup'));

function App() {
  const { token, login, logout, userId } = useAuth();
  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        token,
        userId,
        login,
        logout,
      }}
    >
      <NotificationProvider>
        <Suspense
          fallback={
            <div className="center">
              <Loading />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events/new" element={<NewEvent />} />
            {!isLoggedIn && (
              <>
                <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/signup" element={<Signup />} />
              </>
            )}
            <Route
              path="*"
              element={<Navigate to={isLoggedIn ? '/' : '/auth/login'} replace />}
            />
          </Routes>
        </Suspense>
      </NotificationProvider>
    </AuthContext.Provider>
  );
}

export default App;
