import React, { useState, useEffect } from "react";
import { FlyToInterpolator } from "deck.gl";
import logoB1G1 from "../assets/logo/logo.svg";
import styles from "../App.module.css";
import Map from "./Map";
import Markers from "./Markers";
import * as regionlocation from "./RegionLocation";
import LiveUpdates from "./LiveUpdates";
import ShareTray from "./ShareTray";
import Blip from "./Blip";
import Givings from "./Givings";
import SearchInfo from "./SearchInfo";
import { useLocation } from "react-router-dom";
import queryString from 'query-string'

const App = ({
  searchbusiness,
  setSearchBusiness,
  businessEnabled,
  setBusinessEnabled,
  projectEnabled,
  setProjectEnabled,
}) => {
  const TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

  let location = useLocation(); // grab current url location
  let width = window.innerWidth; // grab device width

  const [viewState, setViewState] = useState({ // initial viewstate
    latitude: 35,
    longitude: 21.9,
    zoom: 1,
    bearing: 0,
    pitch: 0
  });

  const handleChangeViewState = ({ viewState }) => { // handle viewState changes, disables shareTray and regionTray on movement
    setViewState(viewState);
    setRegionEnabled(false);
    setShareEnabled(false);
  };

  const handleFlyLocation = (destination) => setViewState({ // handle map fly transitions for various continents
    ...viewState,
    ...destination,
    transitionDuration: 1500,
    transitionInterpolator: new FlyToInterpolator({ curve: 2.5 }),
  });

  const handleToggleBusiness = () => setBusinessEnabled(!businessEnabled); // handle ON/ OFF business markers

  const handleToggleProject = () => setProjectEnabled(!projectEnabled); // handle ON/ OFF project markers

  const [regionEnabled, setRegionEnabled] = useState(false); // Region tray state
  const handleToggleRegion = () => setRegionEnabled(!regionEnabled); // handle ON/ OFF region modal popup

  const [shareEnabled, setShareEnabled] = useState(false); // share tray state
  const handleToggleShare = () => setShareEnabled(!shareEnabled); // handle ON/ OFF share modal popup

  const [marker, setMarker] = useState([]); // state that stores business, project markers and impact count data

  const [updates, setUpdates] = useState([]); // state that stores liveupdates data
  const [pulsate, setPulsate] = useState(false); // state for pulsating blip
  const [giving, setGiving] = useState([]); // state that stores all givings.

  useEffect(() => {
    if (location.pathname.match(/embed/)) { // checks if its an embed route
      const parsed = queryString.parse(location.search);
      setViewState({ // sets initial viewState to the respective business location
        latitude: parseFloat(parsed.lat),
        longitude: parseFloat(parsed.lng),
        zoom: parseFloat(parsed.zoom),
        pitch: parseFloat(parsed.pitch),
        bearing: parseFloat(parsed.bearing)
    })}
  }, [location.pathname, location.search])

  if (location.pathname.match(/embed/)) { // Renders components for embed widget
    return (
      <div>
        <SearchInfo
          setSearchBusiness={setSearchBusiness}
          searchbusiness={searchbusiness}
        />
        <Givings setGiving={setGiving} />
        <Map
          width="100vw"
          height="100vh"
          viewState={viewState}
          marker={marker}
          updates={updates}
          pulsate={pulsate}
          giving={giving}
          onViewStateChange={handleChangeViewState}
          businessEnabled={businessEnabled}
          projectEnabled={projectEnabled}
          searchbusiness={searchbusiness}
          token={TOKEN}
        />
      </div>
    );
  }
  if (width > 1024) { // Renders components for tablets and laptops
    return (
      <div>
        <div className={styles.mainpanel}>
          <div className={styles.controlpanel}>
            <div>
              <a href="https://www.b1g1.com/businessforgood" target="_blank" rel="noopener noreferrer">
                <img src={logoB1G1} alt="logo" className={styles.companylogo} />
              </a>
            </div>
            <button // Business marker button
              onClick={handleToggleBusiness}
              style={{
                backgroundColor: businessEnabled ? "#00B4EB" : "white",
                color: businessEnabled ? "white" : null,
              }}
            >
              <i className="material-icons md-24">business</i>
              <strong>BUSINESS</strong>
            </button>
            <button // Project marker button
              onClick={handleToggleProject}
              style={{
                backgroundColor: projectEnabled ? "#00B4EB" : "white",
                color: projectEnabled ? "white" : null,
              }}
            >
              <i className="material-icons md-24">favorite_border</i>
              <strong>PROJECTS</strong>
            </button>
            <div>
              <button // Region button
                onClick={handleToggleRegion}
                style={{
                  backgroundColor: regionEnabled ? "#00B4EB" : "white",
                  color: regionEnabled ? "white" : null,
                }}
              >
                <i className="material-icons md-24">public</i>
                <strong>REGION</strong>
              </button>
              <div // RegionTray buttons
                className={styles.regiontray}
                style={{ display: regionEnabled ? null : "none" }}
              >
                {Object.keys(regionlocation).map((key) => (
                  <button
                    key={key}
                    onClick={() => handleFlyLocation(regionlocation[key])}
                  >
                    {regionlocation[key].name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <button // Share button
                onClick={handleToggleShare}
                style={{
                  borderRadius: "50%",
                  maxHeight: "40px",
                  width: "auto",
                  height: "auto",
                  background: shareEnabled ? "#00B4EB" : "#323334",
                  color: "white",
                  padding: "8px",
                }}
              >
                <i className="material-icons md-24">share</i>
              </button>
              <ShareTray shareEnabled={shareEnabled} />
            </div>
          </div>
        </div>
        <div className={styles.companydescription}>
          <h4>B1G1 BUSINESS FOR GOOD MAP</h4>
          <h6>Find out more about B1G1:</h6>
          <a href="https://www.b1g1.com/businessforgood"> www.b1g1.com</a>
        </div>
        <div className={styles.impactcounter}>
          <h2>{marker[2]}</h2>
          <p>giving impacts created to date</p>
        </div>
        <Markers setMarker={setMarker} marker={marker} />
        <LiveUpdates setUpdates={setUpdates} />
        <Blip setPulsate={setPulsate} pulsate={pulsate} />
        <Givings setGiving={setGiving} />
        <SearchInfo
          setSearchBusiness={setSearchBusiness}
          searchbusiness={searchbusiness}
        />
        <Map
          width="100vw"
          height="100vh"
          viewState={viewState}
          marker={marker}
          updates={updates}
          pulsate={pulsate}
          giving={giving}
          onViewStateChange={handleChangeViewState}
          businessEnabled={businessEnabled}
          projectEnabled={projectEnabled}
          searchbusiness={searchbusiness}
          token={TOKEN}
        />
      </div>
    );
  }
  return (
    <div>
      <div className={styles.mainpanel}>
        <div className={styles.controlpanel}>
          <div>
              <a href="https://www.b1g1.com/businessforgood" target="_blank" rel="noopener noreferrer">
                <img src={logoB1G1} alt="logo" className={styles.companylogo} />
              </a>
          </div>
          <button
              onClick={handleToggleBusiness}
              style={{
                backgroundColor: businessEnabled ? "#00B4EB" : "white",
                color: businessEnabled ? "white" : null,
              }}
            >
              <i className="material-icons md-24">business</i>
              <strong>BUSINESS</strong>
            </button>
            <button
              onClick={handleToggleProject}
              style={{
                backgroundColor: projectEnabled ? "#00B4EB" : "white",
                color: projectEnabled ? "white" : null,
              }}
            >
              <i className="material-icons md-24">favorite_border</i>
              <strong>PROJECTS</strong>
            </button>
            <div>
              <button
                onClick={handleToggleRegion}
                style={{
                  backgroundColor: regionEnabled ? "#00B4EB" : "white",
                  color: regionEnabled ? "white" : null,
                }}
              >
                <i className="material-icons md-24">public</i>
                <strong>REGION</strong>
              </button>
              <div
                className={styles.regiontray}
                style={{ display: regionEnabled ? null : "none" }}
              >
                {Object.keys(regionlocation).map((key) => (
                  <button
                    key={key}
                    onClick={() => handleFlyLocation(regionlocation[key])}
                  >
                    {regionlocation[key].name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <button
                onClick={handleToggleShare}
                style={{
                  borderRadius: "50%",
                  maxHeight: "40px",
                  width: "auto",
                  height: "auto",
                  background: shareEnabled ? "#00B4EB" : "#323334",
                  color: "white",
                  padding: "8px",
                }}
              >
                <i className="material-icons md-24">share</i>
              </button>
              <ShareTray shareEnabled={shareEnabled} />
            </div>
        </div>
      </div>
      <Markers setMarker={setMarker} marker={marker} />
      <Givings setGiving={setGiving} />
      <SearchInfo
        setSearchBusiness={setSearchBusiness}
        searchbusiness={searchbusiness}
      />
      <Map
        width="100vw"
        height="100vh"
        viewState={viewState}
        marker={marker}
        updates={updates}
        pulsate={pulsate}
        giving={giving}
        onViewStateChange={handleChangeViewState}
        businessEnabled={businessEnabled}
        projectEnabled={projectEnabled}
        searchbusiness={searchbusiness}
        token={TOKEN}
      />
    </div>
  );
};

export default App;
