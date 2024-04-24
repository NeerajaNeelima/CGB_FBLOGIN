import country_data from "../assets/data/country_data.json"

let countries=country_data.map((country)=>{
    return <>
    <option value={country}>{country}</option>
    </>
  })

export default countries;

  // const [cities_data,set_cities_data] = useState([])

  // let cities = cities_data.map((city)=>{
  //   return <>
  //   <option value={city}>{city}</option>
  //   </>
  // })

  // async function get_cities(e){
  //   let response = await fetch(`https://countriesnow.space/api/v0.1/countries/cities/q?country=${e.target.value}`)
  //   console.log(response)
  //   let city_data = await response.json()

  //   set_cities_data(city_data["data"])

  // }