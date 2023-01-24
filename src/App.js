import logo from './logo.svg';
import './App.css';

// importing components from react-router-dom package
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
  } from "react-router-dom";
  
// import Home component
import Home from "./components/Home";
import SearchResult from "./components/SearchResult";

function App() {
  return (
  <>
  {/* This is the alias of BrowserRouter i.e. Router */}
  <Router>
    <Routes>
    {/* This route is for home component 
    with exact path "/", in component props 
    we passes the imported component*/}
    <Route exact path="/" element={<Home />} />
    
    {/* This route is for about component 
    with exact path "/about", in component 
    props we passes the imported component*/}
    <Route path="/search/:id" element={<SearchResult />} />
    <Route
        path="*"
        element={<Navigate to="/" replace />}
    />
    </Routes>
  </Router>
  </>
  );
}

export default App;
