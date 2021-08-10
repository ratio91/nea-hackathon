/*
  Web3 modal helps us "connect" external wallets:
*/
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { INFURA_ID } from "../../constants";

export const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
});

export const initWeb3Modal = () => {
  /* eslint-disable */
  window.ethereum &&
  window.ethereum.on("chainChanged", chainId => {
    web3Modal.cachedProvider &&
    setTimeout(() => {
      window.location.reload();
    }, 1);
  });

  window.ethereum &&
  window.ethereum.on("accountsChanged", accounts => {
    web3Modal.cachedProvider &&
    setTimeout(() => {
      window.location.reload();
    }, 1);
  });
  /* eslint-enable */
};
