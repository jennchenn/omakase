import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import Splash from "./components/splash";

export default function App() {
  return (
    <div>
      <Header />
      <Router>
        <Route path="/" render={() => <Splash />} />
        {/* <Route path="/:<code>" render={() => <Splash />} /> */}
      </Router>
      <Footer />
    </div>
  );
}
