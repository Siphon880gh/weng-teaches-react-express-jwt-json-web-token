import { useState, useEffect} from "react";
import logo from './logo.svg';
import './App.css';

import Auth from './utils/auth';


function App() {

  const [formUsername, setFormUsername] = useState('')
  const [formPassword, setFormPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(()=>{
    if(Auth.loggedIn())
      setLoggedIn(true);
    else
      setLoggedIn(false);
  }, [])

  const handleLogin = async () => {

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({username:formUsername, password:formPassword})
      });

      if (response.ok) {
        var {userPasswordFound, token} = await response.json();
        if(userPasswordFound) {
          setLoggedIn(true); // Visual feedback you're logged in
          Auth.login(token); // Save to localStorage the token generated from backend's Auth.signToken()
          console.log("Login successful");
        } else {
          alert("Access Denied! Incorrect credentials")
          Auth.logout();
          setLoggedIn(false); // Visual feedback you're logged out
          console.error("Error incorrect credentials");
        }
      } else {
        console.error("Error authenticating user other than incorrect credentials");
      }

    } catch (error) {
      console.error(error);
    }
  } // handleLogin

  function handleProfileView() {
    // All authorized routes must be passed the json web token
    let token = Auth?.getToken()?Auth.getToken():"Not_Found";

    fetch("/profile", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).then(response=>response.text()).then(msg=> {alert(msg)})
    .catch(error => {
      // Handle any errors during the request
      console.error(error);
    });
  } // handleProfileView


  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{marginTop:"50px"}}>Test JSON Web Token React-Express</h1>
        <ul className="instructions">
          <li>Login with admin/admin. </li>
          <li>Faded React logo is logged out. Colored React logo is logged in. </li>
          <li>Close webpage and revisit to see if login sticks. </li>
          <li>Check DevTools Applications to see json web token hashed value saved. - Weng</li>
        </ul>

        <div style={{position:"fixed",top:"10px", right:"15px", color:"lightblue", padding:"0 10px"}}>
          <button onClick={()=>{
            handleProfileView();
          }}>Profile (Regardless if logged in)</button>
        </div>

        <div
          className={loggedIn?"clickable":""}
          onClick={()=>{
            if(Auth.loggedIn()) { // Check localStorage for for a valid json web token value
              // eslint-disable-next-line no-restricted-globals
              let wantLogOut = confirm("Want to log out? This will fade the logo colors");
              if(wantLogOut) {
                Auth.logout(); // Clears localStorage of the json web token value
              }
            }
        }}
        >
          <img 
            alt="logo" 
            src={logo} 
            className={`App-logo ${loggedIn?"logged-in":"logged-out"}`} 
            /> 
            </div>

        <form onSubmit={(event) => { event.preventDefault(); handleLogin(); }}>
          <div className="input-group">
            <label htmlFor="field-1">Username</label>
            <input id="field-1" type="text" onChange={(event)=>setFormUsername(event.target.value)} />
          </div>
          
          <div className="input-group">
            <label htmlFor="field-2">Password</label>
            <input id="field-2" type="password" onChange={(event)=>setFormPassword(event.target.value)} />
          </div>

          <input type="submit" value="Login"/>
        </form>
        <br/><br/>

      </header>
    </div>
  );
}

export default App;
