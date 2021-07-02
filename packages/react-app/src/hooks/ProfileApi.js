import axios from "axios";
import { useEffect, useState } from "react";

export default function useProfileApi(address, reset, setDate) {
  const [profile, setProfile] = useState({});
  const [isLoading, setLoading] = useState(false);
  const apiUrl = `${process.env.REACT_APP_API_BASEURL}user/`;

  const getProfile = async () => {
    axios
      .get(`${apiUrl}${address}`)
      .then(response => {
        setProfile(response.data /* || { name: "", biography: "", dateOfBirth: new Date(), artStyle: "" })*/);
        if (reset) reset(response.data);
        if (response.data && setDate) setDate(response.data.dateOfBirth);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });
  };

  const updateProfile = async data => {
    setLoading(true);
    axios
      .post(apiUrl, { ...data, id: address /*, dateOfBirth: data.dateOfBirth.toISOString().substr(0, 10) */ })
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
