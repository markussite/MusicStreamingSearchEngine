import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, InputGroup, FormControl, Button, Row, Cards, Card} from 'react-bootstrap';
import {useState, useEffect} from 'react';

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_API_ID; // Your client id
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET; // Your secret

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbum] = useState([]);

  async function search() {
    console.log("Search for " + searchInput);

    //Get request using search to get the Artist ID
    const searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }
    const artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist' , searchParameters) //? to add variables
    .then(response => response.json())
    .then(data => {return data.artists.items[0].id }).catch(error => console.log(error))

    const returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=DE&limit=50', searchParameters)
      .then(response => response.json())
      .then(data => {
        setAlbum(data.items);
      });
    //Get request with Artist ID grab all the albums from that artist

    

    //Display those albums to the user
  }
  return (
    <div className="App">
      <Container>
        <InputGroup className="mb-3" size="lg">
          <FormControl
            placeholder="Search for Artist"
            type="input"
            onKeyDown={event => {
              if (event.key === "Enter"){
                search();
              }
            }}
            onChange={event => setSearchInput(event.target.value)}
          />
          <Button onClick={search}>Search</Button>
        </InputGroup>
      </Container>
      <div class ="container">
        <Row className="card flex-row flex-wrap">
          {albums.map((album, i) => {
            console.log(album);
            return (<Card key={i}>
              <a href={'https://open.spotify.com/album/' + album.id}>
                <img src={album.images[2].url} align="left"/>  
                <div className="ml-3" align="left">
                  <div className="card-title">{album.artists[0].name}</div>
                  <div className="card-text">{album.name}</div>
                </div>
              </a>  
            </Card>
            )
          })}
        
        </Row>
      </div>
    </div>
  );
}

export default App;
