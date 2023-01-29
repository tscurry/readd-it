import * as React from "react";
import { Feed, Navbar, Sidebar } from "./components/index";
import ErrorBoundary from "./features/errorHandling/ErrorBoundary";

import "./app.css";
import "./index.css";

const App = () => {
  return (
    <div className="app">
      <Navbar />
      <Sidebar />
      <ErrorBoundary>
        <Feed />
      </ErrorBoundary>
    </div>
  );
};

export default App;
