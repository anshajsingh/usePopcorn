// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

import React, { useState, useEffect } from 'react';

export default function CurrencyApp() {

    const [amount, setAmount] = useState(100);
    const [fromCurrency, setFromCurrency] = useState("EUR");
    const [toCurrency, setToCurrency] = useState("USD");
    const [output, setOutput] = useState(null);


    function handleAmountChange(event) {
        setAmount(event.target.value);
    }

    useEffect(function() {
        async function fetchExchangeRate() {
            const response = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`);
            const data = await response.json();
            console.log(data);
            setOutput(data.rates[toCurrency]);
        }
        fetchExchangeRate();
    }, [amount, fromCurrency, toCurrency]);

  return (
    <div>
      <input type="text" value={amount} onChange={handleAmountChange} />
      <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <p>{output}</p>
    </div>
  );
}
