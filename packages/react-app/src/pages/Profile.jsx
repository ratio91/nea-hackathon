import React, { useMemo, useState } from "react";
import { Button, CircularProgress, FormGroup, TextField } from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { useForm, Controller } from "react-hook-form";
import { useProfileApi } from "../hooks";

export default function Profile({ address }) {
  const { register, reset, control, handleSubmit, setValue } = useForm();
  const [date, setDate] = useState(new Date());
  const { profile, updateProfile, isLoading } = useProfileApi(address, reset, setDate);
  const onChangeDate = data => {
    setDate(data);
    setValue("dateOfBirth", data);
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
              Submit
            </Button>
          </FormGroup>
        </form>
      </div>
    </MuiPickersUtilsProvider>
  );
}
