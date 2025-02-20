import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'; // Importar el archivo de estilos desde la carpeta src

const ExchangeRate = () => {
  const [rate, setRate] = useState(null);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/610f9ff4857bf3be497f56b9/latest/${fromCurrency}`);
        console.log(response.data);
        setRate(response.data.conversion_rates[toCurrency]); 
        setCurrencies(Object.keys(response.data.conversion_rates)); 
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRate();
    const interval = setInterval(fetchRate, 60000); 

    return () => clearInterval(interval);
  }, [fromCurrency, toCurrency]);

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleFromCurrencyChange = (event) => {
    setFromCurrency(event.target.value);
  };

  const handleToCurrencyChange = (event) => {
    setToCurrency(event.target.value);
  };

  if (error) return <div>Error: {error}</div>;
  if (rate === null) return <div>Cargando...</div>;

  const convertedAmount = (amount * rate).toFixed(2);

  return (
    <div className="container">
      <div className="exchange-rate">
        <h1>Tipo de Cambio en Tiempo Real</h1>
        <div className="input-group">
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Ingresa cantidad"
          />
          <select value={fromCurrency} onChange={handleFromCurrencyChange}>
            {currencies.map(currency => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <span> a </span>
          <select value={toCurrency} onChange={handleToCurrencyChange}>
            {currencies.map(currency => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <p>{amount} {fromCurrency} = {convertedAmount} {toCurrency}</p>
      </div>
    </div>
  );
};

export default ExchangeRate;
