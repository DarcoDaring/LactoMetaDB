import "./App.css";
import Home from "./components/Home";
import Search from "./components/Search";
import Team from "./components/Team";
import Contact from "./components/Contact";
import Navbar from "./components/Navbar";
import Significance from "./components/Significance";
import FlowChart from "./components/FlowChart";

function App() {
  return (
    <div className="app">
      <Navbar />
      <Home />
      <Significance />
      <FlowChart />
      <Search />
      
      <Team />
      <Contact />
    </div>
  );
}

export default App;
