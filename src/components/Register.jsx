import { useState } from "react";

// importing auth from firebase config
import { createUserWithEmailAndPassword, signOut, signInWithPopup } from "firebase/auth";

// firebase config
import { auth, provider } from "../config/firebaseConfig";
import { toast } from "react-hot-toast";

const Register = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const { email } = inputs;
  const { password } = inputs;

  const handleInputs = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // console.log(auth?.currentUser?.email) //to get the logged in user
  // console.log(auth?.currentUser) //to get the information about logged in user

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // signing user with email and password
      const credentials = await createUserWithEmailAndPassword(auth, email, password);
      console.log(credentials.user);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signout Successfully")
    } catch (err) {
      console.log(err);
      toast.error(err.message)
    }
  };

  const signInWithGoogle = async () =>{
    try {
      await signInWithPopup(auth, provider)
      toast.success("Signedin Successfully")
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          required
          name="email"
          placeholder="Enter email"
          onChange={handleInputs}
          value={email}
          min={3}
        />
        <input
          type="password"
          required
          name="password"
          placeholder="Enter Password"
          onChange={handleInputs}
          value={password}
          min={3}
        />
        <button type="submit">Register</button>
      </form>
        <button onClick={handleSignOut}>Sign Out</button>
        <button onClick={signInWithGoogle}>Sign in with google</button>
    </div>
  );
};

export default Register;
