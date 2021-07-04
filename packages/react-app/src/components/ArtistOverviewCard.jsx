import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  CardActionsLink: {
    justifyContent: 'center',
  },
  SearchArtists: {
    justifyContent: 'center',
  },
}));

function ArtistOverviewCard({ artist }) {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      {/* <CardActionArea> 
        <CardMedia
          className={classes.media}
          image={artist.img}
          title="Artist img"
        /> 
      </CardActionArea>*/}
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {artist.name}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {artist.about}
        </Typography>
      </CardContent>
      <CardActions className={classes.CardActionsLink}>
        <Link to={`/artists/${artist.id}`}>Learn More</Link>
      </CardActions>
    </Card>
  );
}

export default ArtistOverviewCard;