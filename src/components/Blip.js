import React, {useEffect} from 'react'

const Blip = (props) => {
    useEffect(() => {
      const timer = setInterval(() => {
        props.setPulsate(!props.pulsate);
      }, 1000);
      return () => clearInterval(timer);
    }, [props]);
    return null;
}

export default React.memo(Blip);