import "./App.css";
import Navigation from "./components/Navigation";
import { Route, BrowserRouter as Routes } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import CoinDetail from "./Pages/Coin/CoinDetail";
import usePageTracking from "./util/UsePageTracking";

function App() {
  usePageTracking();
  return (
    <div>
      <Navigation></Navigation>
      <Routes>
        <Route path="/" exact component={Home} />
        <Route path="/about" component={About} />
        <Route path="/coins/:coinId" component={CoinDetail} />
      </Routes>
    </div>
  );
}
export default App;
