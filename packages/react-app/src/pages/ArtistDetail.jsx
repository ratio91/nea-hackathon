import React, { useState } from "react";
import { CircularProgress, TextField } from "@material-ui/core";
import { useProfileApi } from "../hooks";
import { useParams } from "react-router-dom";
import Button from "@material-ui/core/Button";

export default function ArtistDetail({ neaContract, signer, tx }) {
  const { id: address } = useParams();
  const { profile, isLoading } = useProfileApi(address);
  const [amount, setAmount] = useState();

  if (!profile || isLoading) {
    return <CircularProgress />;
  }
  const dateOfBirth = profile && profile.dateOfBirth ? profile.dateOfBirth.substr(0, 10) : "-";
  const contract = profile && profile.contractAddress ? neaContract.attach(profile.contractAddress) : null;

  const onInvest = async () => {
    if (!contract) return;
    console.log("On invest..");
    tx(
      signer.sendTransaction({
        to: profile.contractAddress,
        value: amount,
      }),
    );
  };

  return (
    <div className="Box">
      <h1>{profile.name}</h1>
      <p>Biography: {profile.biography}</p>
      <p>Date of birth: {dateOfBirth}</p>
      <p>Art style: {profile.artStyle}</p>
      <TextField label="Amount" type="amount" value={amount} onChange={x => setAmount(x.data)} />
      <Button onClick={onInvest} variant="contained" color="primary">
        Invest
      </Button>
    </div>
  );
}
