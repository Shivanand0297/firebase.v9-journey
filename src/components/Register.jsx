// importing auth from firebase config
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../config/firebaseConfig";

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
        />
        <input
          type="password"
          required
          name="password"
          placeholder="Enter Password"
          onChange={handleInputs}
          value={password}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
