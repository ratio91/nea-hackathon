import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { CircularProgress } from "@material-ui/core";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import ArtistSalesOverview from "./ArtistSalesOverview";

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
    margin: "15px",
  },
  SearchArtists: {
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: "10px",
    marginBottom: "10px"
  },
  media: {
    height: "150px",
  }
}));

export default function ArtistsArtworkOverview() {
  const [artistAddress, setArtistAddress] = useState("0x37aa4edf12504daf88eab7811988d63483e78345");
  const [artistsArtworks, setArtistsArtworks] = useState();
  const [artistsSales, setArtistsSales] = useState();
  const [artworksMetaData, setArtworksMetaData] = useState();
  const [downloading, setDownloading] = useState();
  const classes = useStyles();

  const artistsArtworksUrl = `https://api.rarible.com/protocol/v0.1/ethereum/nft/items/byCreator?creator=${artistAddress}`;
  const artistsSellOrdersUrl = `https://api.rarible.com/protocol/v0.1/ethereum/order/orders/sell/byMaker?maker=${artistAddress}`;
  // get all artwork data by artist address from rarible
  useEffect(() => {
    async function getArtistsArtworkAndSalesData() {
      setDownloading(true);
      await axios
        .all([axios.get(artistsArtworksUrl), axios.get(artistsSellOrdersUrl)])
        .then(axios.spread((artworkResponse, salesResponse) => {
          console.log(artworkResponse.data.items);
          console.log(salesResponse.data);
          setArtistsArtworks(artworkResponse.data.items);
          setArtistsSales(salesResponse.data.orders);
        }))
        .catch(error => console.log("ApiCall failed", error));
    }
    getArtistsArtworkAndSalesData();
    setDownloading(false);
  }, [artistAddress]);

  // get artwork metadata to display
  useEffect(() => {
    if (!artistsArtworks) {
      return;
    }
    let isMounted = true;
    async function getArtistsArtworksMetadata() {
      const ArtworksMetadata = [];
      for (let tokenIndex = 0; tokenIndex < artistsArtworks.length; tokenIndex++) {
        console.log("inside getArtistsArtworksMetadata  ", tokenIndex);
        let collectionContract = artistsArtworks[tokenIndex].contract;
        let tokenId = artistsArtworks[tokenIndex].tokenId;
        let metadataUrl = `https://api.rarible.com/protocol/v0.1/ethereum/nft/items/${collectionContract}:${tokenId}/meta`;
        console.log("metadataUrl", metadataUrl);
        await axios
          .get(metadataUrl)
          .then(response => {
            console.log(response.data);
            console.log(response.data.name);
            console.log(response.data.image.url.PREVIEW);
            ArtworksMetadata.push(response.data);
          })
          .catch(error => console.log("Metadata ApiCall failed", error));
      }
      setArtworksMetaData(ArtworksMetadata);
    };
    getArtistsArtworksMetadata();
    return () => isMounted = false;
  }, [artistAddress, artistsArtworks]);

  return (
    <>
      <ArtistSalesOverview
        SalesData={artistsSales} />

      <GridList cellHeight={260} className={classes.gridList} cols={3}>
        {artworksMetaData
          ? artworksMetaData.map((artwork, index) => (
            <GridListTile key={index} className={classes.gridListTile} cols={1}>
              <Card>
                <CardActionArea href={`https://rarible.com/token/${artistsArtworks[index].id}`} target="_blank">
                  <CardMedia className={classes.media} image={artwork.image.url.PREVIEW} />
                  <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                      {artwork.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </GridListTile>
          ))
          : <CircularProgress />}
      </GridList>
    </>
  );
}
