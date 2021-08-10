import { useCallback, useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";

export default function useWeb3Modal(web3Modal) {
  const [injectedProvider, setInjectedProvider] = useState();

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  return { logoutOfWeb3Modal, injectedProvider, web3Modal, loadWeb3Modal };
}
