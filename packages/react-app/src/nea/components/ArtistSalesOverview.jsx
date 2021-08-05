import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

export default function ArtistSalesOverview({ SalesData }) {
  console.log("salesData", SalesData);
  return (
    <Card>
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          Past Artwork Sales
        </Typography>
        {SalesData ?
          SalesData.map((sale, index) => (
            <>
              <Typography variant="body2" color="textSecondary" component="p">
                {sale.createdAt.substr(0, 10) + ":" + Math.round(sale.makePriceUsd, 2) + " $"}
              </Typography>
            </>
          ))
          : ""}
      </CardContent>
    </Card>
  );
}