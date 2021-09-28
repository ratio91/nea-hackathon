import React, { useMemo, useState } from "react";
import { Button, CircularProgress, FormGroup, TextField } from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { useForm, Controller } from "react-hook-form";
import { useProfileApi } from "../hooks";
import { Alert } from "@material-ui/lab";

export default function Profile({ address, neaFactoryContract, neaContract, tx, signer, gasPrice, web3Modal, loadWeb3Modal}) {
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
      const tokenSymbol = profile.name
        .match(/\b(\w)/g)
        .join("")
        .toUpperCase();
      const transactionReceipt = await neaFactoryContract.deployNEA(tokenSymbol, tokenSymbol);
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
        gasLimit: Math.max(gasPrice / 100000000, 21000), // TODO: use a real limit
      }),
    );
    setError("");
    setMessage("Distribution initiated!");
  };

  const onSetAmount = x => {
    setAmount(parseFloat(x.target.value));
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (web3Modal) {
    if (web3Modal.cachedProvider) {
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
                    <TextField label="Amount" type="number" onChange={onSetAmount} />
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
    } else {
      return (<Button
        key="loginbutton"
        style={{ verticalAlign: "top", marginLeft: 8, marginTop: 4 }}
        shape="round"
        size="large"
        /* type={minimized ? "default" : "primary"}     too many people just defaulting to MM and having a bad time */
        onClick={loadWeb3Modal}
      >
        connect
      </Button>);
    }
  } else {
    window.location.href = '/';
  }
}
