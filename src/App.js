import * as React from "react";
import { Feed, Navbar, Sidebar } from "./components/index";

import "./app.css";
import "./index.css";

const App = () => {
  return (
    <div className="app">
      <Navbar/>
      <Sidebar/>
      <Feed/>
    </div>
  );
};

export default App;
