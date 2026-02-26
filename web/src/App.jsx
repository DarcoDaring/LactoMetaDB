import "./App.css";
import Home from "./components/Home";
import About from "./components/about";
import Search from "./components/Search";
import Team from "./components/Team";
import Contact from "./components/Contact";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="app">
      <Navbar />
      <Home />
      <About />
      <Search />
      
      <Team />
      <Contact />
    </div>
  );
}

export default App;
