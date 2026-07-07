import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import LocationPage from './pages/LocationPage';
import LocationDetailsPage from './pages/LocationDetailsPage';
import ReservationsPage from './pages/ReservationsPage';

// Shared layout: header on top, footer at the
function Layout() {
  return (
    <>
      <Header />
      <main className="page-main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/location" element={<LocationPage />} />
            <Route path="/rooms/:id" element={<LocationDetailsPage />} />
            <Route path="/reservations" element={<ReservationsPage />} />
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
