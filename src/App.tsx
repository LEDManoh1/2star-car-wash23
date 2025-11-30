import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Booking from "./pages/Booking";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import Admin from "./pages/Admin";
import LiveChat from "./components/LiveChat";
import { Toaster } from "sonner";
import Auth from "./pages/Auth";
import { initAuthListener } from "./data/access.signal";
import Root from "./pages/Root";

function App() {
  initAuthListener();
  return (
    <>
      <Router>
        <div className="min-h-screen bg-white">
          <Routes>
            <Route
              path="/"
              element={
                <Root>
                  <Home />
                </Root>
              }
            />
            <Route
              path="/services"
              element={
                <Root>
                  <Services />
                </Root>
              }
            />
            <Route
              path="/booking"
              element={
                <Root>
                  <Booking />
                </Root>
              }
            />
            <Route
              path="/about"
              element={
                <Root>
                  <About />
                </Root>
              }
            />
            <Route
              path="/contact"
              element={
                <Root>
                  <Contact />
                </Root>
              }
            />
            <Route
              path="/gallery"
              element={
                <Root>
                  <Gallery />
                </Root>
              }
            />
            <Route path="/admin" element={<Admin />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
          <LiveChat />
        </div>
      </Router>
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
