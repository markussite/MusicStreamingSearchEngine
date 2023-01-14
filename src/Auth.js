import {useState, useEffect} from 'react';

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_API_ID; // Your client id
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET; // Your secret

export default function Auth() {
  
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    //API Access token

    const authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded' //spotify wants it specifly like that
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token)) //errorHandling for fetch
  }, []) //setting api code
  return accessToken;
}