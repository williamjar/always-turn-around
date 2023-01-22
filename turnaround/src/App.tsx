import React, { useState } from "react";
import "./App.css";

function App() {
  const payOutRate = 0.95;
  const [totalCashIn, setTotalCashIn] = useState(0);
  const [totalCashOut, setTotalCashOut] = useState(0);
  const [chance, setChance] = useState(6);

  const [winCondition, setWinCondition] = useState(false);
  const [tokens, setTokens] = useState(100);

  const calculateWinningChance = () => {
    const currentRatio = Math.floor(totalCashOut / totalCashIn);
    if (currentRatio <= 0.95) {
      if (chance <= 3) setChance(chance + 1);
    } else if (currentRatio >= 0.95) {
      if (chance >= 0) setChance(chance - 1);
    }
  };

  const calculatePayout = () => {
    const jackpot = Math.floor(0.95 * (totalCashIn - totalCashOut));
    const normalWin = Math.floor(100);
    let drawnNumber = Math.floor(Math.random() * 100);

    if (drawnNumber === 1) {
      return jackpot;
    }

    return normalWin;
  };

  const drawNumber = () => {
    if (tokens <= 0) return false;
    setTokens(tokens - 10);
    setTotalCashIn(totalCashIn + 10);

    calculateWinningChance();

    let drawnNumber = Math.floor(Math.random() * 100);

    for (let i = 0; i < chance; i++) {
      if (drawnNumber === i) {
        const payout = calculatePayout();
        setTokens(tokens + payout);
        setTotalCashOut(totalCashOut + payout);
        setWinCondition(true);
        alert("Du vant " + payout + " ,-");
      }
    }
  };

  const insertTokens = () => {
    setTokens(tokens + 100);
  };

  return (
    <div>
      <div className="itcanalwaysturnaround">
        <div className="banditkontroller">
          <button className="drawbutton" onClick={drawNumber}>
            SPILL
          </button>
        </div>

        <div className="showcasearea">
          <h1>{tokens},-</h1>
        </div>

        <div className="gamebox"></div>
      </div>
      <div className="debug">
        <p>Winning chance {chance}</p>
        <p>Total cash in {totalCashIn}</p>
        <p>Total cash out: {totalCashOut}</p>
        <p>Payout percentage: {totalCashOut / totalCashIn}</p>

        <button className="tokenbutton" onClick={insertTokens}>
          Sett inn penger
        </button>
      </div>
    </div>
  );
}

export default App;
