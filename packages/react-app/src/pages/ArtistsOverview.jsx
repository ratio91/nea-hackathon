import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import TextField from '@material-ui/core/TextField';

import ArtistOverviewCard from "../components/ArtistOverviewCard";

// placeholder artist data
const artistData = [
  {
    img: 'Image',
    name: 'Artist 1',
    about: 'Great artist 1',
    id: 1,
  },
  {
    img: 'Image',
    name: 'Artist 2',
    about: 'Great artist 2',
    id: 2,
  },
  {
    img: 'Image',
    name: 'Artist 3',
    about: 'Great artist 3',
    id: 3,
  },
  {
    img: 'Image',
    name: 'Artist 4',
    about: 'Great artist 4',
    id: 4,
  },
];

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
  gridListTile:{

  },
  SearchArtists: {
    justifyContent: 'center',
  },
}));

export default function Artists() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TextField
        label="Search"
        className={classes.SearchArtists}
        placeholder="Artist"
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <GridList cellHeight={260} className={classes.gridList} cols={2}>
        {artistData.map((artist, index) => (
          <GridListTile key={index} className={classes.gridListTile} cols={1}>
            <ArtistOverviewCard
              artist={artist} />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}
