import { useEffect, useState } from "react";
import Register from "./components/Register";

// db from firestore
import { db, auth, storage } from "./config/firebaseConfig";

import { getDocs, addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";

// toast imports
import toast, { Toaster } from 'react-hot-toast';

import "./App.css"


// getting bucket ref and function to Upload files
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";

// importing uuid to give random name to the files
import { v4 } from "uuid";

const App = () => {
  const [movieList, setMovieList] = useState([]);

  // first getting collection ref to get the movies lists
  const moviesCollection = collection(db, "movies");

  // states for adding movies
  const [movieDetails, setMovieDetails] = useState({
    title: "",
    releaseDate: "",
    isReceivedAnOscar: false
  })

  // state to update the new title 
  const [newTitle, setNewTitle] = useState("")

  // state for handling files
  const [fileUpload, setFileUpload] = useState(null)

  // state to store all the images url list
  const [imageList, setImageList] = useState([])

  // fetching all the movies from firestore db
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


// change function
  const handleChange = (item, e) =>{

    // changing details on input name
    if(item === "text" || item === "number"){
      setMovieDetails((prev)=>({
        ...prev, [e.target.name]: e.target.value
      }))
    }else{
      setMovieDetails((prev)=>({
        ...prev, [e.target.name]: e.target.checked
      }))
    }
  }

  // function to add movie into the firebase database
  const addMovie = async () =>{
    try {

      // first getting collection reference and then adding data obj
      await addDoc(moviesCollection, {
        title: movieDetails.title,
        releaseDate: movieDetails.releaseDate,
        receivedAnOscar: movieDetails.isReceivedAnOscar,
        userId: auth?.currentUser?.uid  //adding the id of the user in the collection
      })

      // success toast
      toast.success("Movie Added Successfully", {
        position: "top-center",
      })

      // reseting the details to default
      setMovieDetails({
        title: "",
        releaseDate: "",
        isReceivedAnOscar: false

      })

      getMovies();

    } catch (err) {
      console.log(err)
      toast.error("Could not add movie")
    }
  }

  // function to delete movie
  const deleteMovie = async (id) =>{
    try {
      const movieDoc = doc(db, "movies", id)  // Gets a DocumentReference instance that refers to the document at the specified absolute path.
      await deleteDoc(movieDoc)
  
      toast.success("Deleted Successfully", {
        position: "top-center"
      })
      getMovies()
      
    } catch (err) {
      console.log(err)
    }
  }

  const updateMovieTitle = async (id) =>{
    const movieDoc = doc(db, "movies", id)
    await updateDoc(movieDoc, {
      title: newTitle
    })

    toast.success("Updated Successfully", {
      position: "top-center"
    })

    getMovies()
  }

  // getting imageList folder ref
  const imageListFolder = ref(storage, `projectfiles/`)


  // handleUploadFile
  const handleUploadFile = async () =>{
    if(!fileUpload) return;

    // to get the reference of the folder to Upload into
    const fileUploadFolder = ref(storage, `projectfiles/${fileUpload.name.concat(v4())}`)
    try {
      await uploadBytes(fileUploadFolder, fileUpload)
      toast.success("File Uploaded")
    } catch (err) {
      console.log(err)
    }
  }

  const listAllImages = async () =>{
    // getting all the imageList
    const data = await listAll(imageListFolder)
    data.items.forEach(async (item)=>{
      const url = await getDownloadURL(item)
      setImageList((prev)=>([...prev, url]))
    })
  }

  useEffect(() => {
    getMovies();

    listAllImages()
  
  }, []);
  return (
    <div>
      <Register />
      <div>
        <input 
          onChange={(e)=> {handleChange("text", e)}}
          type="text"
          name="title"
          placeholder="Movie title"
          value={movieDetails.title}
          min={3}
          required={true}
        />
        <input 
          onChange={(e)=> {handleChange("number", e)}}
          type="number"
          name="releaseDate"
          placeholder="ReleaseDate"
          value={movieDetails.releaseDate ? Number(movieDetails.releaseDate) : "" }
          required={true}
        />
        <input 
          onChange={(e)=>{handleChange("checkbox", e)}}
          type="checkbox"
          name="isReceivedAnOscar"
          value={Boolean(movieDetails.isReceivedAnOscar)}
        />
        <label>Received an Oscar</label>
        <button onClick={addMovie}>Add Movie</button>
      </div>
      { movieList.map(movie=>(
        <div key={movie.id}>
          <h2 style={{ color: movie.receivedAnOscar ? "green" : "red" }} >Title: {movie.title}</h2>
          <h3>Release Date: {movie.releaseDate}</h3>
          <h2>Received an oscar? {movie.receivedAnOscar ? "Yes" : "No"}</h2>
          <button onClick={()=>{deleteMovie(movie.id)}} >Delete Movie</button>
          <input 
            onChange={(e)=> setNewTitle(e.target.value)}
          />
          <button onClick={()=> updateMovieTitle(movie.id)}>Update Title</button>
        </div>
      ))}
      <div>
        <input type="file" 
          onChange={(e)=> setFileUpload(e.target.files[0])}
        />
        <button
          onClick={handleUploadFile}
        >
          Upload File
        </button>
      </div>
      <div>
        {imageList.map((url, i) =>(
          <img src={url} key={i} />
        ))}
      </div>
      <Toaster/>
    </div>
  );
};

export default App;
