import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers'
import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";

export default function App() {

  const [stake, setStake] = useState(0)
  const [error, setError] = useState()
  const [txs, setTxs] = useState([])


  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  const startPayment = async ({ setError, setTxs, ether, addr }) => {
    try {
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");
  
      await window.ethereum.send("eth_requestAccounts");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      ethers.utils.getAddress(addr);
      const tx = await signer.sendTransaction({
        to: addr,
        value: ethers.utils.parseEther(ether)
      });
      console.log({ ether, addr });
      console.log("tx", tx);
      setTxs([tx]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setError();
    await startPayment({
      setError,
      setTxs,
      ether: stake,
      addr: data.get("addr")
    }); 
  };
  


  const stakeAmount = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setStake(data.get("stake"));
    console.log({stake});
  };

  return (
    <div className="App">
      <form className="m-4" onSubmit={stakeAmount}>
        <div className="credit-card w-full lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
          <main className="mt-4 p-4">
            <h1 className="text-xl font-semibold text-gray-700 text-center">
              Stake an amount before playing the game
            </h1>
            <div className="">
              <div className="my-3">
                <input
                  name="stake"
                  type="text"
                  className="input input-bordered block w-full focus:ring focus:outline-none"
                  placeholder="Amount in ETH"
                />
              </div>
            </div>
          </main>
          <footer className="p-4">
            <button type="submit" className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
            >
              Stake Amount
            </button>
          </footer>
        </div>
      </form>

      <form className="m-4" onSubmit={handleDonate}>
        <div className="credit-card w-full lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
          <main className="mt-4 p-4">
            <h1 className="text-xl font-semibold text-gray-700 text-center">
              You staked {stake} ETH
            </h1>
            <div className="">
              <div className="my-3">
                <input name="addr" type="text" className="input input-bordered block w-full focus:ring focus:outline-none"
                  placeholder="Recipient Address"/>
              </div>
            </div>
          </main>
          <footer className="p-4">
            <button type="submit" className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
            >
              Donate ETH
            </button>
          </footer>
        </div>       
      </form>

    </div>
  );
  
}
