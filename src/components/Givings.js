import React, { useEffect } from 'react'
import axios from 'axios'

const Givings = (props) => {

  // All impacts data
  useEffect(() => {
    axios
      .get("givingimpacts.json")
      .then((res) => res.data)
      .then(props.setGiving);
  }, [props.setGiving]);
    return null;
}

export default React.memo(Givings)
