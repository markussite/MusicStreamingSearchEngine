import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, InputGroup, FormControl, Button} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import {useState} from 'react';
import '../index.css';
const Home = () => {
    const [searchInput, setSearchInput] = useState("");
    const navigate = useNavigate();

    const handleClick = (id) => {
      navigate(`/search/${id}`, {
      });
    }

    return (
      <div className='App'>
        <Container>
          <InputGroup className='mb-3' size='lg'>
            <FormControl
              placeholder='Search for Single/Album/Artist'
              type='input'
              onKeyDown={event => {
                if (event.key === 'Enter'){
                  handleClick(searchInput);
                }
              }}
              onChange={event => setSearchInput(event.target.value)}
            />
            <Button onClick={handleClick}>Search</Button>
          </InputGroup>
        </Container>
      </div>
    );
};

export default Home;