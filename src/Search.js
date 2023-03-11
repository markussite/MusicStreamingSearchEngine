import {useState, useEffect} from 'react';

export default async function Search(params) {
    console.log('Search for ' + params);
    const CLIENT_ID = process.env.REACT_APP_SPOTIFY_API_ID; // Your client id
    const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET; // Your secret
    const CLIENT_ID_YT = process.env.REACT_APP_YT_API_ID;
    const [accessToken, setAccessToken] = useState("");
    const [albums, setAlbum] = useState([]);
    const [tracks, setTrack] = useState([]);
    const [artists, setArtist] = useState([]);
    const [snippets, setSnippet] = useState([]);

    
    //API Access token
    useEffect(() => {
    const authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded' //spotify wants it specifly like that
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token)).catch(error => console.log(error));
    },[])

    const handleError = response => {
      if (!response.ok) { 
         throw Error(response.statusText);
      } else {
         return response.json();
      }
   };

    console.log("accesstoken: "+ accessToken);
    //Get request using search to get the Artist ID
    const searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }
    const searchID = await fetch('https://api.spotify.com/v1/search?q=' + params + '&type=tracks,artist', searchParameters) //? to add variables
      .then(response => response.json())
      .then(data => {return [data.artists.items[0], data.tracks.items[0].id, data.tracks.items[1].id, data.tracks.items[2].id, data.tracks.items[3].id] }).catch(error => console.log(error));

    const returnedArtist = await fetch('https://api.spotify.com/v1/search?q=' + params + '&type=tracks,artist ', searchParameters) //? to add variables
      .then(response => response.json())
      .then(data => {setArtist(data.artists.items[0]) }).catch(error => console.log(error));

    const returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + searchID[0].id + '/albums' + '?include_groups=album&market=DE&limit=3', searchParameters)
      .then(response => response.json())
      .then(data => {setAlbum(data.items);}).catch(error => console.log(error));
    
    const returnedTracks = await fetch('https://api.spotify.com/v1/tracks/' + '?market=DE&ids='+ searchID[1] + ',' + searchID[2] + ',' + searchID[3] + ',' + searchID[4], searchParameters)
      .then(response => response.json())
      .then(data => {setTrack(data.tracks);}).catch(error => console.log(error));
    //Get request with Artist ID grab all the albums from that artist
    const searchIDyt = await fetch('https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=' + params.id + '&type=video&videoCategoryId=10&key=' + CLIENT_ID_YT) //? to add variables
      .then(handleError)
      .then(response => response.json())
      .then(data => {setSnippet(data.items) }).catch(console.log());

    return{albums, tracks, artists, snippets}
}