import { useEffect, useState } from "react";

import "./App.css";
import { createUser, getUsers, loginUser, userLogout } from "./api/userApi.js";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const onSubmit = async (event) => {
    try {
      event.preventDefault();
      // console.log({
      //   name,
      //   email,
      //   age,
      // });
      const data = {
        name,
        email,
        age,
        password,
      };
      const response = await createUser(data);
      console.log(response);
      alert(response.msg);
      setAge("");
      setEmail("");
      setName("");
      setPassword("");
    } catch (error) {
      console.log(error.message);
    }
  };
  const getUser = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  const hendelLogin = async (event) => {
    try {
      event.preventDefault();
      const data = {
        email: loginEmail,
        password: loginPassword,
      };
      const response = await loginUser(data);
      const userdata = response.data;
      console.log(userdata);
      localStorage.setItem("user", JSON.stringify(userdata));
      alert(response.msg);
      setLoginEmail("");
      setLoginPassword("");
    } catch (error) {
      console.log(error.message);
    }
  };
  const handelLoutout = async () => {
    try {
      const response = await userLogout();
      console.log(response.data);
      localStorage.removeItem("user");
      alert(response.msg);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      <div>
        <h1>User Management</h1>
        <form onSubmit={onSubmit}>
          <label htmlFor="name">name</label>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <label htmlFor="email">Email</label>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <label htmlFor="age">Age</label>
          <input
            type="text"
            placeholder="Age"
            value={age}
            onChange={(event) => setAge(event.target.value)}
          />
          <label htmlFor="password">password</label>
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button type="submit">Create user</button>
        </form>
        <div>
          <h1>User Data</h1>
          {users.map((data) => (
            <div key={data._id}>
              <ul>
                <li>{data.name}</li>
                <li>{data.email}</li>
                <li>{data.age}</li>
              </ul>
            </div>
          ))}
        </div>
        <div>
          <h1>Login User</h1>
          <form onSubmit={hendelLogin}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter you email"
              value={loginEmail}
              onChange={(event) => setLoginEmail(event.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
            />
            <button type="submit">Login</button>
          </form>
          <button onClick={handelLoutout}>Logout</button>
        </div>
      </div>
    </>
  );
}

export default App;
