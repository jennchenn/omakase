import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import Splash from "./pages/splash";
import Authenticate from "./pages/authenticate";
import Dashboard from "./pages/dashboard";

export default function App() {
  return (
    <div>
      <Header />
      <Router>
        <Route exact path="/" render={() => <Splash />} />
        <Route path="/authenticate" render={() => <Authenticate />} />
        <Route path="/dashboard" render={() => <Dashboard />} />
      </Router>
      <Footer />
    </div>
  );
}
