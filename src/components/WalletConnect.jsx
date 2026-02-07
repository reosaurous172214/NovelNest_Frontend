// frontend/src/components/WalletConnect.js
import React, { useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

const WalletConnect = ({ existingWallet }) => {
  const [wallet, setWallet] = useState(existingWallet || "");
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    // 1. Check if MetaMask is installed
    if (!window.ethereum) {
      alert("Please install MetaMask extension!");
      return;
    }

    try {
      setLoading(true);

      // 2. Request account access from MetaMask
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const connectedAddress = accounts[0];

      // 3. Send the address to your backend to save in MongoDB
      const token = localStorage.getItem("userInfo"); // Or however you store your JWT
      const config = { headers: { Authorization: `Bearer ${JSON.parse(token).token}` } };
      
      await axios.put("http://localhost:5000/api/users/update-wallet", 
        { walletAddress: connectedAddress }, 
        config
      );

      setWallet(connectedAddress);
      alert("Wallet linked to NovelHub successfully!");
    } catch (err) {
      console.error(err);
      alert("Connection failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-bold mb-2">Author Royalty Wallet</h3>
      {wallet ? (
        <div className="text-green-600">
          <p className="text-sm text-gray-600">Connected Wallet:</p>
          <code className="bg-gray-200 p-1 rounded">{wallet}</code>
        </div>
      ) : (
        <button 
          onClick={handleConnect}
          disabled={loading}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          {loading ? "Connecting..." : "Connect MetaMask"}
        </button>
      )}
    </div>
  );
};

export default WalletConnect;