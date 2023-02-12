import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Card } from 'react-bootstrap';
import { useParams } from "react-router-dom";
import search from "../Search"

const SearchResult = () => {
    const params = useParams();
    const searchResult = search(params.id);
    console.log(searchResult);
    return(
        <><h1>Spotify</h1><section className="top">
        <div className='container child top-left'>
            <Row className='card'>
                    {searchResult[2] ? searchResult[2].map((artist, i) => {
                    return (<Card key={i}>
                    <a href={'https://open.spotify.com/artist/' + artist.id}>
                        <div className='ml-3' align='left'>
                            <div className='card-title'>{artist.name}</div>
                        </div>
                    </a>
                </Card>
                );
            }): "Not loaded yet"}
            </Row>
        </div>
            <div className='container child top-right'>
                <Row className='card'>
                    {console.log(searchResult[0])}
                    {searchResult[0] ? searchResult[0].map((album, i) => {
                        return (<Card key={i}>
                            <a href={'https://open.spotify.com/album/' + album.id}>
                                <img src={album.images[2].url} align="left" alt="Album" />
                                <div className='ml-3' align='left'>
                                    <div className='card-title'>{album.artists[0].name}</div>
                                    <div className='card-text'>{album.name}</div>
                                </div>
                            </a>
                        </Card>
                        );
                    }): "Not loaded yet"}
                </Row>
            </div>
        </section>
        <section className='bottom'>
                <div className='container'>
                    <Row className='card flex-row flex-wrap'>
                        {searchResult[1] ? searchResult[1]((track, i) => {
                            //console.log(track);
                            return (<Card key={i}>
                                <a href={'https://open.spotify.com/track/' + track.id}>
                                    <img src={track.album.images[2].url} align="left" alt="Track" />
                                    <div className='ml-3' align='left'>
                                        <a href={'https://open.spotify.com/artist/' + track.artists[0].id}>
                                            <div className='card-title'>{track.artists[0].name}</div>
                                        </a>
                                        <div className='card-text'>{track.name}</div>
                                    </div>
                                </a>
                            </Card>
                            );
                        }): "Not loaded yet"}
                    </Row>
                </div>
            </section>
            <h1>YouTube</h1>
            <section className='bottom'>
                <div className='container'>
                    <Row className='card flex-row flex-wrap'>
                        {searchResult[3] == null ? searchResult[3].map((snippet, i) => {
                            return (<Card key={i}>
                                <a href={'https://www.youtube.com/watch?v=' + snippet.id.videoId}>
                                    <img src={snippet.snippet.thumbnails.default.url} align="left" alt="Video Thumbnail" />
                                    <div className='ml-3' align='left'>
                                        <a href={'https://open.spotify.com/artist/' + snippet.snippet.channelId}>
                                            <div className='card-title'>{snippet.snippet.channelTitle}</div>
                                        </a>
                                        <div className='card-text'>{snippet.snippet.title}</div>
                                    </div>
                                </a>
                            </Card>
                            );
                        }): "not loaded yet"}
                    </Row>
                </div>
            </section></>
    );
};

export default SearchResult;