import './App.css'
import Navigation from './components/Navigation'
import { Route, BrowserRouter as Router } from "react-router-dom"
import Home from './Pages/Home'
import About from './Pages/About'

function App() {

  return (
    <div>
      <Navigation></Navigation>
      <Router>
        <Route path="/" exact component={Home} />
        <Route path="/About" component={About} />

      </Router>
    </div>
  )
}
export default App
