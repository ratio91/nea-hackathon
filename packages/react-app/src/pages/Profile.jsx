import React, { useState } from "react";
import {Button, CircularProgress, FormGroup, TextField} from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { useForm } from "react-hook-form";
import { useProfileApi } from "../hooks";

export default function Profile({ address }) {
  const { profile, updateProfile, isLoading } = useProfileApi(address);
  const { register, handleSubmit, setValue } = useForm({defaultValues: profile});
  const [date, setDate] = useState(new Date());
  const onChangeDate = data => {
    setDate(data);
    setValue("dateOfBirth", data);
  };
  if (profile && date === new Date()) {
    setDate(profile.dateOfBirth);
  }

  if (isLoading) {
    return <CircularProgress />;
  }
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div className="Box">
        <h1>Your profile</h1>
        <form onSubmit={handleSubmit(updateProfile)}>
          <FormGroup>
            <TextField label="Name" defaultValue={profile.name} {...register("name")} />
            <TextField label="Biography" defaultValue={profile.biography} {...register("biography")} />
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
            <TextField name="artStyle" defaultValue={profile.artStyle} {...register("artStyle")} label="Art style" />
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </FormGroup>
        </form>
      </div>
    </MuiPickersUtilsProvider>
  );
}
