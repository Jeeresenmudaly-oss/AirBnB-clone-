import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import ViewListingsPage from './pages/ViewListingsPage';
import CreateListingPage from './pages/CreateListingPage';
import UpdateListingPage from './pages/UpdateListingPage';
import ReservationsPage from './pages/ReservationsPage';

// Layout wraps the authenticated pages with the shared
function Layout() {
  return (
    <>
      <Header />
      <main className="main">
        <Outlet />
      </main>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Everything below requires a logged-in user */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/listings" replace />} />
              <Route path="/listings" element={<ViewListingsPage />} />
              <Route path="/listings/create" element={<CreateListingPage />} />
              <Route path="/listings/:id/edit" element={<UpdateListingPage />} />
              <Route path="/reservations" element={<ReservationsPage />} />
            </Route>
          </Route>

          {/* Anything else -> home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
