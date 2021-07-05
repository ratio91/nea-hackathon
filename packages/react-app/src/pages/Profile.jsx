import React, { useMemo, useState } from "react";
import { Button, CircularProgress, FormGroup, TextField } from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { useForm, Controller } from "react-hook-form";
import { useProfileApi } from "../hooks";
import { Alert } from "@material-ui/lab";

export default function Profile({ address, neaFactoryContract, neaContract, tx, signer }) {
  const { register, reset, control, handleSubmit, setValue } = useForm();
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { profile, updateProfile, isLoading } = useProfileApi(address, reset, setDate);
  const contract = profile && profile.neaContractAddress ? neaContract.attach(profile.neaContractAddress) : null;

  const onChangeDate = data => {
    setDate(data);
    setValue("dateOfBirth", data);
  };
  const onDeploySmartContract = async () => {
    if (!neaFactoryContract) return;
    try {
      const transactionReceipt = await neaFactoryContract.deployNEA("test nea", "TN");
      await transactionReceipt.wait(1);
      console.log(transactionReceipt);
      const neaDeployedAtAddress = await neaFactoryContract.getIdentity(address);
      console.log(neaDeployedAtAddress);
      if (neaDeployedAtAddress && !/^0x0+$/.test(neaDeployedAtAddress)) {
        await updateProfile({ ...profile, neaContractAddress: neaDeployedAtAddress });
        setMessage("The contract has been deployed!");
      } else {
        setError("Unable to deploy contract.");
        setMessage("");
        console.log("Invalid NEA contract address.");
      }
    } catch (exception) {
      setError("Unable to deploy contract.");
      setMessage("");
      console.log(exception);
    }
  };

  const onDistribute = async () => {
    if (!contract) {
      setError("No artist contract has been deployed yet!");
      return;
    }
    console.log("On distribute..");
    tx(
      signer.sendTransaction({
        to: profile.neaContractAddress,
        value: amount,
      }),
    );
    setError("");
    setMessage("Distribution completed!");
  };

  if (isLoading) {
    return <CircularProgress />;
  }
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div className="Box">
        <h1>Your profile</h1>
        <form onSubmit={handleSubmit(updateProfile)}>
          <input
            type="hidden"
            name="neaContractAddress"
            value={profile.neaContractAddress}
            {...register("neaContractAddress")}
          />
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
            {profile.name && (
              <>
                {!profile.neaContractAddress && (
                  <Button type="button" variant="contained" color="secondary" onClick={onDeploySmartContract}>
                    Deploy smart contract
                  </Button>
                )}
                {profile.neaContractAddress && (
                  <div>Your NEA contract is deployed at: {profile.neaContractAddress}</div>
                )}
                <TextField label="Amount" type="number" value={amount} onChange={x => setAmount(x.data)} />
                <Button onClick={onDistribute} variant="contained" color="primary">
                  Distribute
                </Button>
              </>
            )}
            {error && <Alert severity="error">{error}</Alert>}
            {message && <Alert severity="success">{message}</Alert>}
          </FormGroup>
        </form>
      </div>
    </MuiPickersUtilsProvider>
  );
}
