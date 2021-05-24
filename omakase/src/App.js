import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import Splash from "./components/splash";
import Authenticate from "./components/authenticate";
import Dashboard from "./components/dashboard";

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
