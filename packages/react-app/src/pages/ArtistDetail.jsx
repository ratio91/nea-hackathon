import React, { useState } from "react";
import { CircularProgress, TextField } from "@material-ui/core";
import { useProfileApi } from "../hooks";
import { useParams } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { Alert } from "@material-ui/lab";

export default function ArtistDetail({ neaContract }) {
  const { id: address } = useParams();
  const { profile, isLoading } = useProfileApi(address);
  const [amount, setAmount] = useState();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  if (!profile || isLoading) {
    return <CircularProgress />;
  }
  const dateOfBirth = profile && profile.dateOfBirth ? profile.dateOfBirth.substr(0, 10) : "-";
  const contract = profile && profile.contractAddress ? neaContract.attach(profile.contractAddress) : null;

  const onInvest = async () => {
    if (!contract) {
      setError("No artist contract has been deployed yet!");
      return;
    }
    console.log("On invest..");
    const txResult = await contract.supportNEA(amount);
    console.log(txResult);
    setError("");
    setMessage("Thanks for investing!");
  };

  return (
    <div className="Box">
      <h1>{profile.name}</h1>
      <p>Biography: {profile.biography}</p>
      <p>Date of birth: {dateOfBirth}</p>
      <p>Art style: {profile.artStyle}</p>
      <TextField label="Amount" type="number" value={amount} onChange={x => setAmount(x.data)} />
      <Button onClick={onInvest} variant="contained" color="primary">
        Invest
      </Button>
      {error && <Alert severity="error">{error}</Alert>}
      {message && <Alert severity="success">{message}</Alert>}
    </div>
  );
}