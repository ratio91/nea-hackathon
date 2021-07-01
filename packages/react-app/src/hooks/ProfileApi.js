import axios from "axios";
import { useEffect, useState } from "react";

export default function useProfileApi(address) {
  const [profile, setProfile] = useState({});
  const [isLoading, setLoading] = useState(false);
  const apiUrl = `${process.env.REACT_APP_API_BASEURL}user/`;

  const getProfile = async () => {
    axios
      .get(`${apiUrl}${address}`)
      .then(response => {
        setProfile(response.data /* || { name: "", biography: "", dateOfBirth: new Date(), artStyle: "" })*/);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });
  };

  const updateProfile = async data => {
    setLoading(true);
    const profileData = {
      name: data.name || profile.name,
      biography: data.biography || profile.biography,
      dateOfBirth: data.dateOfBirth || profile.dateOfBirth,
      artStyle: data.artStyle || profile.artStyle,
    };
    axios
      .post(apiUrl, { ...profileData, id: address /*, dateOfBirth: data.dateOfBirth.toISOString().substr(0, 10) */ })
      .then(() => {
        console.log("done updating profile");
        getProfile();
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (Object.keys(profile).length === 0 && address) {
      setLoading(true);
      getProfile();
    }
  }, [profile, address]);

  return { profile, updateProfile, isLoading };
}
