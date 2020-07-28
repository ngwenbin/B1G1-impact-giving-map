import { useLocation } from "react-router-dom";
import axios from "axios";
import React, { useEffect } from "react";
import queryString from 'query-string'

const Urlsearch = (props) => {
  let location = useLocation();
  const parsed = queryString.parse(location.search);
  const id = parsed.id

  useEffect(() => {
    // The below urls are rerouted to a proxy server due to CORs policy.

    // let url = `https://baroque-gerard-57112.herokuapp.com/https://businessesforgood.com/infowindow_data.php?uid=${id}`;
    let url = `https://cors-anywhere.herokuapp.com/https://businessesforgood.com/infowindow_data.php?uid=${id}`;
    props.setBusinessEnabled(false)
    props.setProjectEnabled(false)
    axios
      .get(url)
      .then((res) => res.data)
      .then((data) => {
        if( data[0].IWCompanyName === undefined) { // Checks if company exists
          return []
        }
        else{
          const a = data.map((item) => ({
            name: item.IWCompanyName,
            id: id,
            logo: item.IWLogo,
            country: item.IWCountry,
            website: item.IWCompanyWebsite,
            created: item.IWJoinedDate,
            givings: item.IWMicroGiving,
            about: item.IWAboutCompany,
            position: [item.IWLatitude, item.IWLongitude]
          }))
          return a[0]
        }
      })
      .then(props.setSearchBusiness);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

export default React.memo(Urlsearch);
