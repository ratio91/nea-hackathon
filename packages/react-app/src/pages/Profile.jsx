import React, { useState } from "react";
import { Button, FormControl, FormGroup, TextField } from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { useForm } from "react-hook-form";
import { useProfileApi } from "../hooks";

export default function Profile({ address }) {
  const { getProfile, updateProfile } = useProfileApi(address);
  const { register, handleSubmit, setValue } = useForm();

  const [date, setDate] = useState(new Date());
  const onChangeDate = data => {
    setDate(data);
    setValue("dateOfBirth", data);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div className="Box">
        <h1>Your profile</h1>
        <form onSubmit={handleSubmit(updateProfile)}>
          <FormGroup>
            <TextField label="Name" {...register("name")} />
            <TextField label="Biography" {...register("biography")} />
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
            <TextField name="artStyle" {...register("artStyle")} label="Art style" />
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </FormGroup>
        </form>
      </div>
    </MuiPickersUtilsProvider>
  );
}
