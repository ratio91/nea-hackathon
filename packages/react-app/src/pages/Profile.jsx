import React, { useMemo, useState } from "react";
import { Button, CircularProgress, FormGroup, TextField } from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { useForm, Controller } from "react-hook-form";
import { useProfileApi } from "../hooks";
import { Alert } from "@material-ui/lab";

export default function Profile({ address, neaFactory }) {
  const { register, reset, control, handleSubmit, setValue } = useForm();
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState("");
  const { profile, updateProfile, isLoading } = useProfileApi(address, reset, setDate);
  const onChangeDate = data => {
    setDate(data);
    setValue("dateOfBirth", data);
  };
  const onDeploySmartContract = async () => {
    if (!neaFactory) return;
    try {
      const tx = await neaFactory.deployNEA("test nea", "TN");
      console.log(tx);
      const neaDeployedAtAddress = tx.to;
      console.log(neaDeployedAtAddress);
      // TODO: update contract address in the profile
    } catch (exception) {
      setError("Unable to deploy contract.");
      console.log(exception);
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div className="Box">
        <h1>Your profile</h1>
        <form onSubmit={handleSubmit(updateProfile)}>
          <FormGroup>
            <Controller
              name="name"
              control={control}
              defaultValue={profile.name}
              render={({ field }) => <TextField label="Name" {...field} />}
            />
            <Controller
              name="biography"
              control={control}
              defaultValue={profile.biography}
              render={({ field }) => <TextField label="Biography" {...field} />}
            />
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              label="Date of birth"
              onChange={onChangeDate}
              value={date}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
            <Controller
              name="artStyle"
              control={control}
              defaultValue={profile.artStyle}
              render={({ field }) => <TextField label="Art style" {...field} />}
            />
            <Button type="submit" variant="contained" color="primary">
              Update profile
            </Button>
            <Button type="button" variant="contained" color="secondary" onClick={onDeploySmartContract}>
              Deploy smart contract
            </Button>
            {error && <Alert severity="error">{error}</Alert>}
          </FormGroup>
        </form>
      </div>
    </MuiPickersUtilsProvider>
  );
}
