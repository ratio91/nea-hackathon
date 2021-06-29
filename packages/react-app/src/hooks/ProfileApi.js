import axios from "axios";
import { useEffect, useState } from "react";

export default function useProfileApi(address) {
  const [profile, setProfile] = useState({});
  const apiUrl = `${process.env.REACT_APP_API_BASEURL}user/${address}`;

  const getProfile = async () => {
    axios
      .get(apiUrl)
      .then(response => {
        setProfile(response);
      })
      .catch(error => console.log(error));
  };

  const updateProfile = async data => {
    axios
      .post(apiUrl, data)
      .then(() => {
        console.log("done updating profile");
      })
      .catch(error => console.log(error));
  };

  useEffect(async () => {
    if (Object.keys(profile).length === 0 && address) {
      await getProfile();
    }
  }, [profile]);

  return { profile, updateProfile };
}
