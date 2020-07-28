import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import cheerio from 'cheerio';
import 'react-toastify/dist/ReactToastify.css';
import '../toast.css';

const LiveUpdates = (props) => {

    const [counts, setCounts] = useState(1); // Live updates counter
     // Live update data
    useEffect(() => {
      const interval = setInterval(() => {
        setCounts((counts) => counts + 1);
        toast.dismiss();
        if (counts === 20) {
          setCounts(1);
        }
        axios
          // The below urls are rerouted to a proxy server due to CORs policy.

          .get(`https://baroque-gerard-57112.herokuapp.com/https://businessesforgood.com/live_updates.php?pageNo=${counts}`)
          // .get(`https://cors-anywhere.herokuapp.com/https://businessesforgood.com/live_updates.php?pageNo=${counts}`)
          .then((res) => {
            const $ = cheerio.load(res.data); // scrapping of live updates data via cheerio
            const updatetext = $("td").has("cb").text().replace(/\s+/g, " "); // scrapping cb element and removing extra whitespace
            const coordinates = $("a").attr("href").split(","); // splitting of href attribute to obtain coordinates
            toast(updatetext, {
              position: "bottom-left",
              hideProgressBar: true,
              closeOnClick: false,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
              autoClose: 12000,
            });
            if (coordinates[1] === "" || coordinates[2] === "") {
              return [{ text: updatetext, position: ["1.3", "103.79"] }]; // Use B1G1 coordinates if update geodata is empty
            } else {
              return [
                {
                  text: updatetext,
                  position: [coordinates[1], coordinates[2]],
                },
              ];
            }
          })
          .then(props.setUpdates);
      }, 15000);
      return () => clearInterval(interval);
    }, [counts]); // eslint-disable-line
    return (
        <div>
            <ToastContainer
            position="bottom-left"
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
    )
}

export default React.memo(LiveUpdates);


