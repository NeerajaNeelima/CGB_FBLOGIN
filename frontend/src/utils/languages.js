import language_data from "../assets/data/languages_data.json"

let languages = language_data.map((language)=>{
    return (
      <>
      <option value={language}>{language}</option>
      </>
    )
  })

export default languages;