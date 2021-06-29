import React, { useState } from "react";
import { Button, FormGroup, TextField } from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { useProfileApi } from "../hooks";

export default function Profile({ address }) {
  const { getProfile, updateProfile } = useProfileApi(address);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div className="Box">
        <h1>Your profile</h1>
        <FormGroup>
          <input type="hidden" value={address} />
          <TextField id="name" label="Name" />
          <TextField id="biography" label="Biography" />
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="dateOfBirth"
            label="Date of birth"
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
          <TextField id="artStyle" label="Art style" />
          <Button variant="contained" color="primary">
            Submit
          </Button>
        </FormGroup>
      </div>
    </MuiPickersUtilsProvider>
  );
}
