import React, { useState } from "react";
import Search from "./components/Search";
import Main from "./components/Main";
import Urlsearch from "./components/UrlSearch";
import {
  BrowserRouter as Router,
  Route,
  useLocation,
} from "react-router-dom";

const App = () => {
  const [searchbusiness, setSearchBusiness] = useState([]);
  const [businessEnabled, setBusinessEnabled] = useState(true); // Show business markers state
  const [projectEnabled, setProjectEnabled] = useState(true); // Show projects markers state

  let location = useLocation(); // grab current location
  if (location.pathname.match(/embed/)) {
    return (
      <Router>
        <Route path="/embed/" children={
          <div>
            <Main
              searchbusiness={searchbusiness}
              setSearchBusiness={setSearchBusiness}
              setBusinessEnabled={setBusinessEnabled}
              setProjectEnabled={setProjectEnabled}
              businessEnabled={businessEnabled}
              projectEnabled={projectEnabled}
            />
            <Urlsearch
              setSearchBusiness={setSearchBusiness}
              setBusinessEnabled={setBusinessEnabled}
              setProjectEnabled={setProjectEnabled}
              />
          </div>
        }/>
      </Router>
    );
  }
  return (
    <Router>
      <div>
        <Main
          searchbusiness={searchbusiness}
          setSearchBusiness={setSearchBusiness}
          setBusinessEnabled={setBusinessEnabled}
          setProjectEnabled={setProjectEnabled}
          businessEnabled={businessEnabled}
          projectEnabled={projectEnabled}
        />
        <Search
          setSearchBusiness={setSearchBusiness}
          setBusinessEnabled={setBusinessEnabled}
          setProjectEnabled={setProjectEnabled}
        />
        <Route path="/share/" children={
          <Urlsearch
            setSearchBusiness={setSearchBusiness}
            setBusinessEnabled={setBusinessEnabled}
            setProjectEnabled={setProjectEnabled}/>
          }
        />
      </div>
    </Router>
  );
};

export default App;
