import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import { useParams } from "react-router-dom";
import {useState} from 'react';
import auth from "../Auth"
import { useEffect } from "react";

const SearchResult = () => {
    const [searchInput, setSearchInput] = useState("");
    const [albums, setAlbum] = useState([]);
    const [tracks, setTrack] = useState([]);
    const [artists, setArtist] = useState([]);
    const params = useParams();
    console.log(params);
    const accessToken = auth();
    async function search() {
      console.log('Search for ' + searchInput);
  
      //Get request using search to get the Artist ID
      const searchParameters = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        }
      }
      const searchID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=track,artist' , searchParameters) //? to add variables
        .then(response => response.json())
        .then(data => {return [data.artists.items[0], data.tracks.items[0].id, data.tracks.items[1].id, data.tracks.items[2].id, data.tracks.items[3].id, setArtist(data.artists.items)] }).catch(error => console.log(error));
      const returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + searchID[0].id + '/albums' + '?include_groups=album&market=DE&limit=3', searchParameters)
        .then(response => response.json())
        .then(data => {setAlbum(data.items);}).catch(error => console.log(error));
      
      const returnedTracks = await fetch('https://api.spotify.com/v1/tracks/' + '?market=DE&ids='+ searchID[1] + ',' + searchID[2] + ',' + searchID[3] + ',' + searchID[4], searchParameters)
        .then(response => response.json())
        .then(data => {setTrack(data.tracks);}).catch(error => console.log(error));
      //Get request with Artist ID grab all the albums from that artist
  
      
  
      //Display those albums to the user
    }
    useEffect(() => {
        setSearchInput(params.id);
        console.log("showing: " + searchInput);
        search(); 
    }, []);
    return(
        <><section className='top'>
            <div className='container child top-left'>
                <Row className='card'>
                    <Card>
                        <a href={'https://open.spotify.com/artist/' + artists.id}>
                            <img src="https://i.scdn.co/image/ab67616d00004851346d77e155d854735410ed18" align="left" />
                            <div className='ml-3' align='left'>
                                <div className='card-title'>{artists.name}</div>
                            </div>
                        </a>
                    </Card>
                </Row>
            </div>
            <div className='container child top-right'>
                <Row className='card'>
                    {albums.map((album, i) => {
                        return (<Card key={i}>
                            <a href={'https://open.spotify.com/album/' + album.id}>
                                <img src={album.images[2].url} align="left" />
                                <div className='ml-3' align='left'>
                                    <div className='card-title'>{album.artists[0].name}</div>
                                    <div className='card-text'>{album.name}</div>
                                </div>
                            </a>
                        </Card>
                        );
                    })}
                </Row>
            </div>
        </section><section className='bottom'>
                <div className='container'>
                    <Row className='card flex-row flex-wrap'>
                        {tracks.map((track, i) => {
                            //console.log(track);
                            return (<Card key={i}>
                                <a href={'https://open.spotify.com/track/' + track.id}>
                                    <img src={track.album.images[2].url} align="left" />
                                    <div className='ml-3' align='left'>
                                        <a href={'https://open.spotify.com/artist/' + track.artists[0].id}>
                                            <div className='card-title'>{track.artists[0].name}</div>
                                        </a>
                                        <div className='card-text'>{track.name}</div>
                                    </div>
                                </a>
                            </Card>
                            );
                        })}
                    </Row>
                </div>
            </section></>
    );
};

export default SearchResult;