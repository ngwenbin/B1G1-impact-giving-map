import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import axios from "axios";
import Map from "./components/Map";
import Search from "./components/Search"
import logoB1G1 from "./assets/logo/logo.svg";
import cheerio from "cheerio";
import facebook_logo from "./assets/logo/facebook.svg";
import linkedin_logo from "./assets/logo/linkedin.svg";
import twitter_logo from "./assets/logo/twitter.svg";
import * as regionlocation from "./regionlocation";
import { FlyToInterpolator } from "deck.gl";
import { ToastContainer, toast } from "react-toastify";
import "./toast.css";

const App = () => {
  const [pulsate, setPulsate] = useState(false); // pulse timer for blip
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setPulsate(!pulsate);
  //   }, 900);
  //   return () => clearInterval(timer);
  // }, [pulsate]);

  const [viewState, setViewState] = useState({ // initial viewstate
    latitude: 25.22,
    longitude: 21.9,
    zoom: 1.8,
    pitch: 35,
  });

  const handleChangeViewState = ({ viewState }) => { // handle map movements
    setViewState(viewState);
    setRegionEnabled(false);
    setShareEnabled(false);
  };

  const handleFlyLocation = (destination) => // handle fly transitions for regions
    setViewState({
      ...viewState,
      ...destination,
      transitionDuration: 1500,
      transitionInterpolator: new FlyToInterpolator({ curve: 2.5 }),
    });

  const [businessEnabled, setBusinessEnabled] = useState(false); // Show business markers state
  const handleToggleBusiness = () => setBusinessEnabled(!businessEnabled);

  const [projectEnabled, setProjectEnabled] = useState(false); // Show projects markers state
  const handleToggleProject = () => setProjectEnabled(!projectEnabled);

  const [regionEnabled, setRegionEnabled] = useState(false); // Show region tray state
  const handleToggleRegion = () => setRegionEnabled(!regionEnabled);

  const [shareEnabled, setShareEnabled] = useState(false); // Show share tray state
  const handleToggleShare = () => setShareEnabled(!shareEnabled);

  const [arcsEnabled, setArcsEnabled] = useState(false); // Show arcs state
  const handleToggleArcs = () => setArcsEnabled(!arcsEnabled);

  const [arcsEnabled2, setArcsEnabled2] = useState(false); // Show arcs2 state
  const handleToggleArcs2 = () => setArcsEnabled2(!arcsEnabled2);

  const [marker, setMarker] = useState([]); // API calls to get business, project markers + impact count

  const [searchbusiness, setSearchBusiness] = useState([]);
  const [searchmarker, setSearchMarker] = useState();

  useEffect(() => {
    //let business_url = "https://www.businessesforgood.com/businessInfo.php";
    //let project_url = "https://www.businessesforgood.com/projectsInfo.php";
    let impact_url = "https://api.b1g1.com/contribution/stat";
    axios
      .all([
        axios.get("businessInfo.json"),
        axios.get("projectsInfo.json"),
        axios.get(impact_url),
      ])
      .then(axios.spread((...res) => [res[0].data, res[1].data, res[2].data]))
      .then((data) => {
        const a = data[0].filter(
          (data) => data.Blat !== "" && data.Blong !== "" // business data
        );
        const b = data[1].filter(
          (data) => data.Plat !== "" && data.Plong !== "" // project data
        );
        const c = data[2].total_impacts; // impact counter data
        return [a, b, c];
      })
      .then((value) => [
        value[0].map((item) => ({ // mapping of business data
          id: item.uid,
          position: [item.Blong, item.Blat],
        })),
        value[1].map((item) => ({ // mapping of project data
          id: item.uid,
          position: [item.Plong, item.Plat],
        })),
        value[2].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), // adding , to impact counter data
      ])
      .then(setMarker);
  }, []);

  const [counts, setCounts] = useState(1); // Live updates counter
  const [updates, setUpdates] = useState([]); // Live update data
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCounts((counts) => counts + 1);
  //     if (counts === 30) {
  //       setCounts(1);
  //     }
  //     axios
  //       .get(`https://businessesforgood.com/live_updates.php?pageNo=${counts}`)
  //       .then((res) => {
  //         const $ = cheerio.load(res.data); // scrapping of live updates data via cheerio
  //         const updatetext = $("td").has("cb").text().replace(/\s+/g, " "); // scrapping cb element and removing extra whitespace
  //         const coordinates = $("a").attr("href").split(","); // splitting of href attribute to obtain coordinates
  //         toast(updatetext, {
  //           position: "bottom-left",
  //           autoClose: 15000,
  //           hideProgressBar: true,
  //           closeOnClick: false,
  //           pauseOnHover: false,
  //           draggable: false,
  //           progress: undefined,
  //         });
  //         if (coordinates[1] === "" || coordinates[2] === "") {
  //           return [{ text: updatetext, position: ["1.3", "103.787"] }]; // Use B1G1 coordinates if update geodata is empty
  //         } else {
  //           return [
  //             {
  //               text: updatetext,
  //               position: [coordinates[1], coordinates[2]],
  //             },
  //           ];
  //         }
  //       })
  //       .then(setUpdates);
  //   }, 15000);
  //   return () => clearInterval(interval);
  // }, [counts]);

  // const [connectiondata, setConnectionData] = useState([]);
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     const randomid = marker[0][Math.floor(Math.random() * marker[0].length)];
  //     axios
  //       .get(
  //         `http://businessesforgood.com/business_ProjectsInfo.php?id=${randomid.id}`
  //       )
  //       .then((res) => res.data)
  //       .then((data) =>
  //         data.filter((data) => data.BPlat !== "" && data.BPlong !== "")
  //       )
  //       .then((value) =>
  //         value.map((item) => ({
  //           id: item.BPproject_id,
  //           target: [item.BPlong, item.BPlat],
  //           source: randomid.position,
  //         }))
  //       )
  //       .then(setConnectionData);
  //   }, 5000);
  //   return () => clearInterval(timer);
  // }, [marker]);

  const [impacts, setImpacts] = useState([]); // All impacts data
  useEffect(() => {
    axios
      .get("cleanimpacts.json")
      .then((res) => res.data)
      .then(setImpacts);
  }, []);

  // useEffect(() => {
  //   axios
  //     .get("cleanimpacts2.json")
  //     .then((res) => res.data)
  //     .then(data => data.filter(item => item.id === searchbusiness))
  //     .then(value => value.map(item => ({id: item.id, target: item.target, source: item.source})))
  //     .then(setSearchMarker);
  // }, [searchbusiness]);

  console.log(searchbusiness)
  return (
    <div>
      <Map
        width="100vw"
        height="100vh"
        viewState={viewState}
        marker={marker}
        updates={updates}
        pulsate={pulsate}
        impacts={impacts}
        onViewStateChange={handleChangeViewState}
        businessEnabled={businessEnabled}
        projectEnabled={projectEnabled}
        //connectiondata={connectiondata}
        arcsEnabled={arcsEnabled}
        arcsEnabled2={arcsEnabled2}
        searchmarker={searchmarker}
      />
      <div>
        <img src={logoB1G1} alt="test" className={styles.companylogo} />
      </div>
      <div className={styles.controlpanel}>
        <button
          onClick={handleToggleBusiness}
          style={{
            backgroundColor: businessEnabled ? "#00B4EB" : "white",
            color: businessEnabled ? "white" : null,
          }}
        >
          <i className="material-icons md-24">business&nbsp;</i>
          Businesses
        </button>
        <button
          onClick={handleToggleProject}
          style={{
            backgroundColor: projectEnabled ? "#00B4EB" : "white",
            color: projectEnabled ? "white" : null,
          }}
        >
          <i className="material-icons md-24">favorite_border&nbsp;</i>
          Projects
        </button>
        <button
          onClick={handleToggleRegion}
          style={{
            backgroundColor: regionEnabled ? "#00B4EB" : "white",
            color: regionEnabled ? "white" : null,
          }}
        >
          <i className="material-icons md-24">public&nbsp;</i>
          Region
        </button>
        <button
          onClick={handleToggleShare}
          style={{
            borderRadius: "50%",
            width: "48px",
            height: "48px",
            background: shareEnabled ? "#00B4EB" : "#787878",
            color: "white",
          }}
        >
          <i className="material-icons md-24">&nbsp;share</i>
        </button>
        <button
          onClick={handleToggleArcs}
          style={{
            background: arcsEnabled ? "black" : "white",
            color: arcsEnabled ? "white" : null,
          }}
        >
          <i className="material-icons md-24">accessibility_new&nbsp;</i>
          Givings
        </button>
        <button
          onClick={handleToggleArcs2}
          style={{
            background: arcsEnabled2 ? "black" : "white",
            color: arcsEnabled2 ? "white" : null,
          }}
        >
          <i className="material-icons md-24">accessibility_new&nbsp;</i>
          Givings 2
        </button>
      </div>
      <div
        className={styles.regiontray}
        style={{
          display: regionEnabled ? null : "none",
        }}
      >
        {Object.keys(regionlocation).map((key) => (
          <button
            key={key}
            onClick={() => handleFlyLocation(regionlocation[key])}
          >
            {Object.values(regionlocation[key].name)}
          </button>
        ))}
      </div>
      <div
        className={styles.sharetray}
        style={{
          display: shareEnabled ? null : "none",
        }}
      >
        <button
          onClick={() =>
            window.open(
              "https://www.facebook.com/dialog/share?app_id=331903781112565&display=popup&href=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2F&redirect_uri=https%3A%2F%2Fbusinessesforgood.com%2F",
              "Popup",
              "toolbar=no, location=no, statusbar=no, menubar=no, scrollbars=1, resizable=0, width=580, height=600, top=30"
            )
          }
        >
          <img src={facebook_logo} alt="" />
        </button>
        <button>
          <img src={twitter_logo} alt="" />
        </button>
        <button>
          <img src={linkedin_logo} alt="" />
        </button>
      </div>
      <div>
        <ToastContainer
          position="bottom-left"
          autoClose={15000}
          hideProgressBar
          newestOnTop={false}
          rtl={false}
          closeOnClick={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover={false}
          closeButton={false}
          limit={1}
        />
      </div>
      <div className={styles.companydescription}>
        <strong>A B1G1 BUSINESS FOR GOOD MAP</strong>
        <br />
        <small>Find out more about B1G1:</small>
        <a href="www.b1g1.com"> www.b1g1.com</a>
      </div>
      <div className={styles.impactcounter}>
        <strong>{marker[2]}</strong>
        <br />
        <small>micro-impacts created to date</small>
      </div>
      <div>
        <Search setSearchBusiness={setSearchBusiness}/>
      </div>
    </div>
  );
};

export default App;
