import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

import ArtistOverviewCard from "../components/ArtistOverviewCard";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
  },
  gridList: {
    width: 500,
    height: "100vh",
  },
  gridListTile: {

  },
  SearchArtists: {
    justifyContent: 'center',
  },
}));

export default function Artists() {
  const classes = useStyles();
  const [searchInput, setSearchInput] = useState();
  const [allArtistData, setAllArtistData] = useState();

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

  function handleInputchange(event) {
    setSearchInput(event.target.value);
  }

  return (
    <div className={classes.root}>
      <TextField
        label="Search"
        className={classes.SearchArtists}
        placeholder="Artist"
        fullWidth
        value={searchInput}
        color="primary"
        onChange={handleInputchange}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <GridList cellHeight={260} className={classes.gridList} cols={2}>
        {allArtistData
          ? allArtistData.map((artist, index) => (
              <GridListTile key={index} className={classes.gridListTile} cols={1}>
                <ArtistOverviewCard artist={artist} />
              </GridListTile>
            ))
          : ""}
      </GridList>
    </div>
  );
}
