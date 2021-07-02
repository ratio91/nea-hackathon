import React from "react";
import { CircularProgress } from "@material-ui/core";
import { useProfileApi } from "../hooks";
import { useParams } from "react-router-dom";

export default function ArtistDetail() {
  const { id: address } = useParams();
  const { profile, isLoading } = useProfileApi(address);

  if (!profile || isLoading) {
    return <CircularProgress />;
  }
  const dateOfBirth = profile && profile.dateOfBirth ? profile.dateOfBirth.substr(0, 10) : "-";
  return (
    <div className="Box">
      <h1>{profile.name}</h1>
      <p>Biography: {profile.biography}</p>
      <p>Date of birth: {dateOfBirth}</p>
      <p>Art style: {profile.artStyle}</p>
    </div>
  );
}
