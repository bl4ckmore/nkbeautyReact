import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import CustomCursor from './components/CustomCursor';
import ScrollToTop from './components/ScrollToTop';

function Layout({ children }) {
  const { pathname } = useLocation();
  const [booking, setBooking]       = useState(null); // null | { preService }
  const openBooking  = (svc = null) => setBooking({ preService: svc });
  const closeBooking = ()           => setBooking(null);

  return (
    <>
      <Navbar onBook={() => openBooking()} />
      <main>{children({ openBooking })}</main>
      <Footer />
      {booking && <BookingModal preService={booking.preService} onClose={closeBooking} />}
    </>
  );
}

function NotFound() {
  return (
    <div style={{ minHeight:'80vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1.5rem', textAlign:'center', padding:'2rem' }}>
      <span style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:'clamp(5rem,15vw,12rem)', color:'var(--gold-dim)', lineHeight:1 }}>404</span>
      <h2 style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:300, color:'var(--cream)' }}>Page not found</h2>
      <a href="/" className="btn btn-outline" style={{ marginTop:'0.5rem' }}><span>Return Home</span></a>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
    <BrowserRouter>
      <ScrollToTop />
      <CustomCursor />
      <Layout>
        {({ openBooking }) => (
          <Routes>
            <Route path="/"        element={<Home        onBook={openBooking} />} />
            <Route path="/catalog" element={<Catalog     onBook={openBooking} />} />
            <Route path="*"        element={<NotFound />} />
          </Routes>
        )}
      </Layout>
    </BrowserRouter>
    </LanguageProvider>
  );
}