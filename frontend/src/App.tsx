import './App.css'
import Navigation from './components/Navigation'
import { Route, BrowserRouter as Router } from "react-router-dom"
import Home from './Pages/Home'
import About from './Pages/About'
import CoinDetail from './Pages/Coin/CoinDetail'

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
  )
}
export default App
