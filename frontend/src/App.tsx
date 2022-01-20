import "./App.css";
import Navigation from "./components/Navigation";
import { Route, BrowserRouter as Router } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import CoinDetail from "./Pages/Coin/CoinDetail";

import ReactGA from "react-ga";
ReactGA.initialize("G-H7RBX1HXVK");
ReactGA.pageview(window.location.pathname + window.location.search);
function App() {
  return (
    <div>
      <Navigation></Navigation>
      <Router>
        <Route path="/" exact component={Home} />
        <Route path="/about" component={About} />
        <Route path="/coins/:coinId" component={CoinDetail} />
      </Router>
    </div>
  );
}
export default App;
