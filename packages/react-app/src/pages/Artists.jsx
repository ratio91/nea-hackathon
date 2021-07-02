import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// placeholder artist data
const artistData = [
  {
    img: 'Image',
    name: 'Artist 1',
    about: 'Great artist 1',
  },
  {
    img: 'Image',
    name: 'Artist 2',
    about: 'Great artist 2',
  },
  {
    img: 'Image',
    name: 'Artist 3',
    about: 'Great artist 3',
  },
  {
    img: 'Image',
    name: 'Artist 4',
    about: 'Great artist 4',
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
    height: 450,
  },
  card: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
}));

export default function Artists() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TextField
        label="Search"
        style={{ margin: 8 }}
        placeholder="Artist"
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <GridList cellHeight={160} className={classes.gridList} cols={2}>
        {artistData.map((artist, index) => (
          <GridListTile key={index} cols={1}>
            <Card className={classes.card}>
              <CardActionArea>
                {/* <CardMedia
                  className={classes.media}
                  image={artist.img}
                  title="Artist img"
                /> */}
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {artist.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {artist.about}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary">
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}
