import React from "react";
import styles from "../App.module.css";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import { useLocation } from "react-router-dom";
import empty_logo from "../assets/logo/business_profile.png"

const SearchInfo = (props) => {
  const handleInfoContainer = () => props.setSearchBusiness([]); // Onclick closes the info screen
  const handleEmbed = () => {
    let id = props.searchbusiness.id
    let lat = props.searchbusiness.position[0]
    let lng = props.searchbusiness.position[1]
    alert("Embeded link copied!\n\nRemeber to edit the width, height, zoom level, pitch and bearing to your own requirements. \n\n300 X 300 Is the minimum size of embed code.")
    let url = `https://b1g1impactmap.herokuapp.com/embed?id=${id}&lat=${lat}&lng=${lng}&zoom=0.5&pitch=30&bearing=0`
    navigator.clipboard.writeText(`<iframe src="${url}" width="400" height="400" frameborder="0" style="border:0;position: relative;top: 0;left: 0;"></iframe>`)
  }
  const handleShare = () => {
    let id = props.searchbusiness.id
    let url = `https://b1g1impactmap.herokuapp.com/share?id=${id}`
    const encoded = encodeURI(url);
    window.open(
      `https://www.facebook.com/dialog/share?app_id={APP_ID}&href=${encoded}`,
      "Popup",
      "toolbar=no, location=no, statusbar=no, menubar=no, scrollbars=1, resizable=0, width=580, height=600, top=30"
    )
  }

  let location = useLocation();
  if (location.pathname.match(/embed/)) {
    return props.searchbusiness.id !== undefined ? (
      <div className={styles.infocontainer_embed}>
          <div className={styles.infoheader}>
              <div className={styles.infoheader_profile_embed}>
                <img src={props.searchbusiness.logo} alt="Error" onError={(e)=>{e.target.onerror = null; e.target.src=empty_logo}}/>
                <div className={styles.infoheader_data}>
                  <h3>{props.searchbusiness.name}</h3>
                  <p>{props.searchbusiness.country}</p>
                </div>
              </div>
          </div>
          <div className={styles.infometa_embed}>
              <p>Member since: <span style={{ color: "black", fontWeight: 700 }}>{props.searchbusiness.created.toString().replace(/.{9}$/, "")}</span></p>
              <p>Giving impacts created: <span style={{ color: "black", fontWeight: 700 }}>{props.searchbusiness.givings.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span></p>
              <a href={"https://b1g1impactmap.herokuapp.com/share?id="+props.searchbusiness.id} target="_blank" rel="noopener noreferrer">View the Business for Good Map &gt;</a>
          </div>
      </div>
    ) : null;
  };
  return props.searchbusiness.id !== undefined ? (
    <div className={styles.infocontainer}>
        <div className={styles.infoheader}>
            <div className={styles.infoheader_profile}>
              <img src={props.searchbusiness.logo} alt="Error" onError={(e)=>{e.target.onerror = null; e.target.src=empty_logo}} />
              <div className={styles.infoheader_data}>
                <h3>{props.searchbusiness.name}</h3>
                <p>{props.searchbusiness.country}</p>
              </div>
            </div>
            <button onClick={handleInfoContainer}>
                <i className="material-icons md-18">clear</i>
            </button>
        </div>
        <div className={styles.infometa}>
          <div>
            <a href={props.searchbusiness.website} style={{overflowX: "visible"}}>{props.searchbusiness.website}</a>
            <p>Member since: <span style={{ color: "black", fontWeight: 700 }}>{props.searchbusiness.created.toString().replace(/.{9}$/, "")}</span></p>
            <p>Giving impacts created: <span style={{ color: "black", fontWeight: 700 }}>{props.searchbusiness.givings.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span></p>
          </div>
          <div>
            <button onClick={handleShare}>
              <i className="material-icons md-18" title="Get your shareable link">share</i>
            </button>
            <button onClick={handleEmbed}>
              <i className="material-icons md-18" title="Get your embeddable link">link</i>
            </button>
          </div>
        </div>
        <SimpleBar className={styles.infocontent}>
          <p>{props.searchbusiness.about}</p>
        </SimpleBar>
    </div>
  ) : null;

}

export default React.memo(SearchInfo);
