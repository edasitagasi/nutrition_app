import { useState } from "react";
import { useEffect } from "react";
import { Nutrition } from "./Nutrition";
import { LoaderPage } from "./LoaderPage";
import image from './foodpic.jpg';
import Swal from "sweetalert2";
import './App.css';

function App() {

  const [mySearch, setMySearch] = useState();
  const [wordSubmitted, setWordSubmitted] = useState('');
  const [myNutrition, setMyNutrition] = useState();
  const [stateLoader, setStateLoader] = useState(false);

  const myAlert = () => {
    Swal.fire('Enter quantity + name of ingredient')
  }

  const APP_ID = '1002871d';
  const APP_KEY = '8557c80ca77dab876714b8549f530f08';
  const APP_URL = 'https://api.edamam.com/api/nutrition-details'

  const fetchData = async (ingr) => {
    setStateLoader(true);

    const response = await fetch(`${APP_URL}?app_id=${APP_ID}&app_key=${APP_KEY}`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingr: ingr })
    })

    if(response.ok) {
      setStateLoader(false);
      const data = await response.json();
      setMyNutrition(data);
    } else {
      setStateLoader(false);
      myAlert();
    }
  }

  const myRecipeSearch = e => {
    setMySearch(e.target.value);
  }

  const finalSearch = e => {
    e.preventDefault();
    setWordSubmitted(mySearch);
  }

  useEffect(() => {
    if (wordSubmitted !== '') {
      let ingr = wordSubmitted.split(/[,,;,\n,\r]/);
      fetchData(ingr);
    }
  }, [wordSubmitted])


  return (
    <div className="container">
    <div className="App">
      {stateLoader && <LoaderPage />}
      <img src={image} alt="pic" width="200px" className="foodpic"/>
      <h1>Take your nutrition under control</h1>
      <form onSubmit={finalSearch} className="Search">
        <input
          placeholder="Ex:  1 egg OR 50 gr rice"
          onChange={myRecipeSearch}
        />
        <button type="submit">Search</button>
      </form>
      <div className="ingr">
        {
          myNutrition && <p>{myNutrition.calories} kcal</p>
        }
        {
          myNutrition && Object.values(myNutrition.totalNutrients)
            .map(({label, quantity, unit }) =>
              <Nutrition
                key={label}
                label={label}
                quantity={quantity.toFixed()}
                unit={unit}
              />
            )
        }
      </div>
    </div>
    </div>
  );
}

export default App;
