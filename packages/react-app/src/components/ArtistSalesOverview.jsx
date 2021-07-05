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

export default function ArtistSalesOverview({ SalesData }) {
  console.log("salesData", SalesData);
  return (
    <Card>
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          Sales
        </Typography>
        {SalesData ?
          SalesData.map((sale, index) => (
            <>
              <Typography variant="body2" color="textSecondary" component="p">
                {sale.createdAt}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {sale.makePriceUsd}
              </Typography>
            </>
          ))
          : ""}
      </CardContent>
    </Card>
  );
}