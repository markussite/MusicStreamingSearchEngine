import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import {useState, useEffect} from 'react';
import '../index.css';

const Home = () => {
    const [searchInput, setSearchInput] = useState("");
    const navigate = useNavigate();
    
    const CLIENT_ID = process.env.REACT_APP_SPOTIFY_API_ID; // Your client id
    const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET; // Your secret
    const CLIENT_ID_YT = process.env.REACT_APP_YT_API_ID;
    const [albums, setAlbum] = useState([]);
    const [tracks, setTrack] = useState([]);
    const [artists, setArtist] = useState([]);
    const [snippets, setSnippet] = useState([]);
    const [accessToken, setAccessToken] = useState("");
    const [hidden, setHidden] = useState(false);
    //API Access token
    useEffect(() => {
      if(!accessToken){
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
      }
    },[])


  async function search(){
    //Get request using search to get the Artist ID
    const searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }
    
    const searchID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=track,artist', searchParameters) //? to add variables
      .then(response => response.json())
      .then(data => {return [data.artists.items[0], data.tracks.items[0].id, data.tracks.items[1].id, data.tracks.items[2].id, data.tracks.items[3].id] }).catch(error => console.log(error));

    const returnedArtist = await fetch('https://api.spotify.com/v1/artists/' + searchID[0].id, searchParameters)
      .then(response => response.json())
      .then(data => {setArtist(data.items) }).catch(error => console.log(error));

    const returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + searchID[0].id + '/albums' + '?include_groups=album&market=DE&limit=3', searchParameters)
      .then(response => response.json())
      .then(data => {setAlbum(data.items);}).catch(error => console.log(error));
    
    const returnedTracks = await fetch('https://api.spotify.com/v1/tracks/' + '?market=DE&ids='+ searchID[1] + ',' + searchID[2] + ',' + searchID[3] + ',' + searchID[4], searchParameters)
      .then(response => response.json())
      .then(data => {setTrack(data.tracks);}).catch(error => console.log(error));

    const searchIDyt = await fetch('https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=' + searchInput + '&type=video&videoCategoryId=10&key=' + CLIENT_ID_YT)
      .then(response => response.json())
      .then(data => {setSnippet(data.items) }).catch(error => console.log(error));
  }
    return (
      <div className='Home'>
        <Container>
          <InputGroup className='mb-3' size='lg'>
            <FormControl
              placeholder='Search for Single/Album/Artist'
              type='input'
              onKeyDown={event => {
                if (event.key === 'Enter') {
                  search();
                }
              } }
              onChange={event => setSearchInput(event.target.value)} />
            <Button onClick={search}>Search</Button>
          </InputGroup>
        </Container>
      <h1>Spotify</h1><section className="top">
          <Container>
            <Row className='card'>
              {artists ? artists.map((artist, i) => {
                return (<Card>
                  <Card.Link href={'https://open.spotify.com/artist/' + artist.id}>{artist.name}</Card.Link>
                </Card>
                );
              }) : "Not loaded yet"}
            </Row>
          </Container>
          <Container className='child top-right'>
            <Row className='card'>
              {albums ? albums.map((album, i) => {
                return (<Card>
                    <img src={album.images[0].url} alt="Album" />
                      <Card.Link href={'https://open.spotify.com/album/' + album.id}>{album.name}</Card.Link>
                      <div className='card-text'>{album.artists[0].name}</div>
                </Card>
                );
              }) : "Not loaded yet"}
            </Row>
          </Container>
        </section><section className='bottom'>
          <div className='container'>
            <Row className='card flex-row flex-wrap'>
              {tracks ? tracks.map((track, i) => {
                //console.log(track);
                return (<Card>
                    <img src={track.album.images[0].url} align="left" alt="Track" />
                    <div className='ml-3'>
                      <Card.Link href={'https://open.spotify.com/track/' + track.id}>{track.name}</Card.Link>
                        <div className='card-title'>{track.artists[0].name}</div>
                    </div>
                </Card>
                );
              }) : "Not loaded yet"}
            </Row>
          </div>
        </section><h1>YouTube</h1><section className='bottom'>
          <Container>
            <Row className='card flex-row flex-wrap'>
              {snippets ? snippets.map((snippet, i) => {
                return (<Card>
                    <img src={snippet.snippet.thumbnails.default.url} align="left" alt="Video Thumbnail"/>
                      <Card.Link href={'https://www.youtube.com/watch?v=' + snippet.snippet.channelId}>{snippet.snippet.channelTitle}</Card.Link>
                      <Card.Link href={'https://www.youtube.com/watch?v=' + snippet.id.videoId}>{snippet.snippet.title}</Card.Link>
                </Card>
                );
              }) : "not loaded yet"}
            </Row>
          </Container>
        </section>
      </div>
  );
};

export default Home;