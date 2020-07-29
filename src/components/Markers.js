import React, { useEffect } from 'react';
import axios from 'axios';

const Markers = (props) => {

    useEffect(() => {
        // The below urls are rerouted to a proxy server due to CORs policy.

        // let business_url = "https://cors-anywhere.herokuapp.com/https://businessesforgood.com/businessInfo.php";
        let business_url = "{proxyserver}/https://businessesforgood.com/businessInfo.php";
        // let project_url = "https://cors-anywhere.herokuapp.com/https://businessesforgood.com/projectsInfo.php";
        let project_url = "{proxyserver}/https://businessesforgood.com/projectsInfo.php";
        let impact_url = "https://api.b1g1.com/contribution/stat";
        axios
          .all([
            axios.get(business_url),
            axios.get(project_url),
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
          .then(props.setMarker);
      }, [props.setMarker]);
    return null
}

export default React.memo(Markers);