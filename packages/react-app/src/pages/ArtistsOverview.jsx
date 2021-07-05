import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import TextField from '@material-ui/core/TextField';
import { CircularProgress } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import ArtistOverviewCard from "../components/ArtistOverviewCard";


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
  },
  gridList: {
    width: "100vh",
    height: "100vh",
  },
  gridListTile: {
  },
  SearchArtists: {
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: "10px",
    marginBottom: "10px"
  },
  centerAdornment: {
    marginLeft: "42%" 
  },
}));

export default function Artists() {
  const classes = useStyles();
  const [searchInput, setSearchInput] = useState();
  const [allArtistData, setAllArtistData] = useState();
  const [searchResult, setSearchResult] = useState();

  // get artist data from api
  useEffect(() => {
    let isMounted = true;

    async function getAllArtistData() {
      axios
        .get("https://api.newemergingartists.com/v1/user/all")
        .then(response => {
          if (isMounted) {
            setAllArtistData(response.data);
          }
        })
        .catch(error => console.log(error));
    }
    getAllArtistData();
    return () => isMounted = false;
  }, []);

  // search for user input in artists names and set matching results in state
  useEffect(() => {
    if (!allArtistData) {
      return;
    }
    const matches = [];
    allArtistData.forEach(element => {
      console.log(element.name);
      if (element.name.toLowerCase().includes(searchInput.toLowerCase())) {
        matches.push(element);
      }
    });
    setSearchResult(matches);
  }, [searchInput]);

  function handleSearchInputChange(event) {
    setSearchInput(event.target.value);
  }

  return (
    <div className={classes.root}>
      <TextField
        className={classes.SearchArtists}
        placeholder="Search Artist"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" classes={{ positionStart: classes.centerAdornment}}>
              <SearchIcon />
            </InputAdornment>
          ),
          style: { textAlign: "center" },
        }}
        fullWidth
        value={searchInput || ""}
        color="primary"
        onChange={handleSearchInputChange}
      />
      <GridList cellHeight={260} className={classes.gridList} cols={3}>
        {searchResult
          ? searchResult.map((artist, index) => (
              <GridListTile key={index} className={classes.gridListTile} cols={1}>
                <ArtistOverviewCard artist={artist} />
              </GridListTile>
            ))
          : allArtistData
          ? allArtistData.map((artist, index) => (
              <GridListTile key={index} className={classes.gridListTile} cols={1}>
                <ArtistOverviewCard artist={artist} />
              </GridListTile>
            ))
          : <CircularProgress />}
      </GridList>
    </div>
  );
}
