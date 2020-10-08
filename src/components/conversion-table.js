import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/conversion-table.css"

/*
Needs to have four interactive boxes
An arrow made with html css
*/


export function ConversionTable() {
    const [ input, setInput] = useState(0.00);
    const [ initialCurrency, setInitialCurrency] = useState("USD");
    const [ output, setOutput] = useState(0.00);
    const [ finalCurrency, setFinalCurrency] = useState("EUR");
    const [ hiddenAmount, setHiddenAmount] = useState(0.00)
    const [ conversionFactor, setConversionFactor] = useState(1);
    const [ currencyList, setCurrencyList] = useState([]);

    useEffect( () => {
        const getData = async () => {
            try {
                const res = await axios({
                    "method":"GET",
                    "url":"https://currency-exchange.p.rapidapi.com/listquotes",
                    "headers":{
                    "content-type":"application/octet-stream",
                    "x-rapidapi-host":"currency-exchange.p.rapidapi.com",
                    "x-rapidapi-key":"08670f6036msh087f2b8073d8296p1956a9jsn2560793564ed",
                    "useQueryString":true
                    }
                })
                const currencyList = res.data;
                setCurrencyList(currencyList);
            } catch (err) {
                console.error(err);
            }
        }
        getData();
    },[])

    useEffect( () => {
        const getData = async () => {
            try {
                const res = await axios({
                    "method":"GET",
                    "url":"https://currency-exchange.p.rapidapi.com/exchange",
                    "headers":{
                    "content-type":"application/octet-stream",
                    "x-rapidapi-host":"currency-exchange.p.rapidapi.com",
                    "x-rapidapi-key":"08670f6036msh087f2b8073d8296p1956a9jsn2560793564ed",
                    "useQueryString":true
                    },"params":{
                    "q":"1.0",
                    "from":initialCurrency,
                    "to":finalCurrency
                    }
                })
                const conversionFactor = res.data;
                setConversionFactor(conversionFactor);
            } catch (err) {
                console.error(err);
            }
        }
        getData();
    }, [initialCurrency, finalCurrency])
    
    useEffect( () => {
        //to make the conversions more readable we format the ouputs to remove excessive decimals if input amount is greater than 1
        function formatNumber(number){
            const decimals = number - Number.parseInt(number);
            if (Number.isInteger(number)) return number;
            if (number > 1) return Number.parseInt(number) + Number.parseFloat(decimals.toFixed(2));
            return number;
        }

        const newRawInput = hiddenAmount;
        const newRawOutput = conversionFactor*hiddenAmount;

        const newInput = formatNumber(newRawInput)
        const newOutput = formatNumber(newRawOutput)

        setInput(newInput);
        setOutput(newOutput);
    }, [hiddenAmount, conversionFactor]);


    return (
        <div className="conversion-table">
            <form >
                <input 
                    id="initial-amount" 
                    type="number"
                    min="0"
                    placeholder={0.00}
                    value={input}     
                    onChange={event => setHiddenAmount(parseFloat(event.target.value)) }               
                />

                <select value = {initialCurrency} onChange={event => setInitialCurrency(event.target.value)}>
                    { currencyList.map( (currency) => <option value={currency} key={currency}> {currency} </option> ) }
                </select>
            </form>
                <div className="arrow">
                    <div className="left"></div>
                    <div className="down"></div>
                    <div className="right"></div>
                </div>
            <form>
                <input 
                    id="final-amount" 
                    type="number"
                    min="0"
                    placeholder={0.00}
                    value={output}     
                    onChange= {event => setHiddenAmount(parseFloat(event.target.value)/conversionFactor)}     
                />
                

                <select value = {finalCurrency} onChange={event => setFinalCurrency(event.target.value)}  >
                    { currencyList.map( (currency) => <option value={currency} key={currency}> {currency} </option> ) }
                </select>

            </form>        
        </div>
    )
}


/*

function formatNumber(number){
    if (Number.isInteger(number)) return number;
    const decimals = number - Number.parseInt(number);
    if (decimals.toString().length > 5){
        return Number.praseInt(number) + decimals.toFixed(5);
    }
    return number;
}


*/