import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import About from "./components/about";
import Search from "./components/Search";
import Team from "./components/Team";
import Contact from "./components/Contact";
import Navbar from "./components/Navbar";
import Admin from "./components/Admin";

/* Main scrolling site */
function MainSite() {
  return (
    <>
      <Navbar />
      <Home />
      <About />
      <Search />
      <Team />
      <Contact />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/login" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;