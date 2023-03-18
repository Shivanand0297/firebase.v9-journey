import { useEffect, useState } from "react";
import Register from "./components/Register";

// db from firestore
import { db } from "./config/firebaseConfig";

import { getDocs, collection } from "firebase/firestore";

const App = () => {
  const [movieList, setMovieList] = useState([]);

  // first getting collection ref to get the movies lists
  const moviesCollection = collection(db, "movies");

  const getMovies = async () => {
    // READ THE DATA FROM FIRESTORE
    // SET THE DATA movieList
    try {
      const data = await getDocs(moviesCollection);
      
      const filteredData = data.docs.map((doc)=>{
        return {
          ...doc.data(),
          id: doc.id
        }
      })

      setMovieList(filteredData)

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <div>
      <Register />
      { movieList.map(movie=>(
        <div key={movie.id}>
          <h2 style={{ color: movie.receivedAnOscar ? "green" : "red" }} >Title: {movie.title}</h2>
          <h3>Release Date: {movie.releaseDate}</h3>
          <h2>Received an oscar? {movie.receivedAnOscar ? "Yes" : "No"}</h2>
          
        </div>
      ))}
    </div>
  );
};

export default App;
