import time_zone_data from "../assets/data/timezone_data.json"

let time_zones = time_zone_data.map((time_zone)=>{
    return <>
    <option value={time_zone}>{time_zone}</option>
    </>
  })

export default time_zones;