import React from "react";
import styles from "../App.module.css";
import facebook_logo from "../assets/logo/facebook.svg";
import linkedin_logo from "../assets/logo/linkedin.svg";
import twitter_logo from "../assets/logo/twitter.svg";

const ShareTray = (props) => {
  return (
    <div
      className={styles.sharetray}
      style={{
        display: props.shareEnabled ? null : "none",
      }}
    >
      <button
        onClick={() =>
          window.open(
            "https://www.facebook.com/dialog/share?app_id={APP_ID}&href=https%3A%2F%2Fb1g1impactmap.herokuapp.com%2F",
            "Popup",
            "toolbar=no, location=no, statusbar=no, menubar=no, scrollbars=1, resizable=0, width=580, height=600, top=30"
          )
        }
      >
        <img src={facebook_logo} alt="" />
      </button>
      <button
        onClick={() =>
          window.open(
            "https://twitter.com/intent/tweet?url=https%3A%2F%2Fb1g1impactmap.herokuapp.com%2F&text=Check%20out%20B1G1%20business%20for%20good%20map",
            "Popup",
            "toolbar=no, location=no, statusbar=no, menubar=no, scrollbars=1, resizable=0, width=580, height=600, top=30"
          )
        }>
        <img src={twitter_logo} alt="" />
      </button>
      <button
        onClick={() =>
          window.open(
            "https://www.linkedin.com/shareArticle?mini=true&url=https://b1g1impactmap.herokuapp.com/&title=B1G1%20VBusiness%20for%20good%20map&summary=&source=",
            "Popup",
            "toolbar=no, location=no, statusbar=no, menubar=no, scrollbars=1, resizable=0, width=580, height=600, top=30"
          )
        }>
        <img src={linkedin_logo} alt="" />
      </button>
    </div>
  );
};

export default React.memo(ShareTray);
