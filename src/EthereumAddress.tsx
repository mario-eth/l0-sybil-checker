// src/EthereumAddressChecker.tsx
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Helmet } from 'react-helmet';
import "./EthereumAddress.css";

const EthereumAddressChecker: React.FC = () => {
  const [addresses, setAddresses] = useState<string[]>([]);
  const [inputAddress, setInputAddress] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    async function fetchAddresses() {
      const response = await fetch('https://l0-r2.soldeer.xyz/addresses.csv'); // Replace with your actual CSV URL
      const reader = response.body?.getReader();
      const result = await reader?.read();
      const decoder = new TextDecoder('utf-8');
      const csv = decoder.decode(result?.value);

      Papa.parse<string[]>(csv, {
        complete: (results) => {
          const addresses = results.data.map((row) => (row[0] as string).trim().toLowerCase());
          setAddresses(addresses);
        },
        skipEmptyLines: true
      });
    }

    fetchAddresses();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputAddress(event.target.value);
  };

  const handleCheckAddress = () => {
    const normalizedInput = inputAddress.trim().toLowerCase();
    if (addresses.includes(normalizedInput)) {
      setMessage('The address is in the CSV file.');
    } else {
      setMessage('The address is not in the CSV file.');
    }
  };

  return (
    <div className="Main__Card min-h-screen flex items-center justify-center bg-gray-100">
      <Helmet>
        <title>LayerZero Sybil Checker</title>
        <link rel="icon" href="https://layerzero.network/favicon.ico" />
      </Helmet>
      <div className="Content__Card bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="Title text-2xl font-bold mb-6 text-center">Soldeer Sybil Checker</h1>
        <div className="Subtitle">Check if any Sybil address exist for an Ethereum Address</div>
        <div className="SybilInput__Box flex items-center justify-center">
          <input
            type="text"
            value={inputAddress}
            onChange={handleInputChange}
            placeholder="Ethereum address"
            className="InputBox w-[300px] h-[30px] p-[5px] mr-[10px] border border-gray-300 rounded"
          />
          <button
            onClick={handleCheckAddress}
            className="Button__Check bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-200"
          >
            Find Address
          </button>
        </div>
        {message && (
          <p className="Results mt-4 text-center text-lg">
            {message}
          </p>
        )}
      </div>

    </div>
  );
};

export default EthereumAddressChecker;

