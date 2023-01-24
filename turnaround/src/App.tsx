import React, { useState, useEffect } from 'react'
import './App.css'
import {Button} from "./components/Button";

function App() {
  const payOutRate = 0.95
  const [totalCashIn, setTotalCashIn] = useState(0)
  const [totalCashOut, setTotalCashOut] = useState(0)
  const [chance, setChance] = useState(6)
  const [messageFeed, setMessageFeed] = useState(['...'])
  const [showDebug, setShowDebug] = useState(false)
  const [loading, setLoading] = useState(false)

  const [winCondition, setWinCondition] = useState(false)
  const [tokens, setTokens] = useState(1000)
  const [slotString, setSlotString] = useState(['X', 'X', 'X'])

  const calculateWinningChance = () => {
    const currentRatio = Math.floor(totalCashOut / totalCashIn)
    if (currentRatio <= 0.95) {
      if (chance <= 3) setChance(chance + 1)
    } else if (currentRatio >= 0.95) {
      if (chance >= 0) setChance(chance - 1)
    }
  }

  const calculatePayout = () => {
    const jackpot = Math.floor(0.95 * (totalCashIn - totalCashOut))
    const normalWin = Math.floor(100)
    let drawnNumber = Math.floor(Math.random() * 100)

    if (drawnNumber >= 95 && jackpot >= 100) {
      setSlotString(['J', 'A', 'K'])
      addToMessageFeed('Jackpot! You won ' + jackpot + ' ,- !')
      return jackpot
    }
    setSlotString(['W', 'I', 'N'])
    addToMessageFeed('You won ' + normalWin + ' ,- !')
    return normalWin
  }

  const drawNumber = () => {
    if (tokens <= 9) return false

    setTokens(tokens - 10)
    setLoading(!loading)
    setTotalCashIn(totalCashIn + 10)
    calculateWinningChance()
    generateString(3)

    let drawnNumber = Math.floor(Math.random() * 100)

    for (let i = 0; i < chance; i++) {
      if (drawnNumber === i) {
        const payout = calculatePayout()
        setTokens(tokens + payout)
        setTotalCashOut(totalCashOut + payout)
        setWinCondition(true)
      }
    }
  }

  const addToMessageFeed = (message: string) => {
    if (messageFeed.length >= 5) {
      messageFeed.shift()
    }
    messageFeed.push(message)
  }

  const insertTokens = () => {
    setTokens(tokens + 100)
  }

  const generateString = (length: any) => {
    let finalArray = []
    slotString.length = 0
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let charactersLength = characters.length

    for (var i = 0; i < length; i++) {
      finalArray.push(
        characters.charAt(Math.floor(Math.random() * charactersLength))
      )
    }
    setSlotString(finalArray)
  }

  const sideMenu = () => (
    <div className="side-menu">
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
  )

  /*function ExampleCounter() {
    const speed = 100

    useEffect(() => {
      const interval = setInterval(() => {
        generateString(3)
      }, speed)

      return () => clearInterval(interval)
    }, [])

    return <div></div>
  }*/

  return (
    <div>
      <header>
        <button className='nav-button'>
          <svg height="24px" viewBox="0 0 24 24" fill="none">
          <path d="M21.008 16c.537 0 .992.447.992.999v1.002a.992.992 0 01-.992.999H2.992C2.455 19 2 18.553 2 18.001v-1.002c0-.556.444-.999.992-.999h18.016zm0-6c.537 0 .992.447.992.999v1.002a.992.992 0 01-.992.999H2.992C2.455 13 2 12.553 2 12.001v-1.002c0-.556.444-.999.992-.999h18.016zm0-6c.537 0 .992.447.992.999v1.002a.992.992 0 01-.992.999H2.992C2.455 7 2 6.553 2 6.001V4.999C2 4.443 2.444 4 2.992 4h18.016z" fill="currentColor">
          </path></svg>
        </button>
        <h2 className="site-title">It Can Always Turn Around</h2>
        <Button text={"Logg inn"}/>
      </header>
      <div className="main-container">
        <div className="side-spacer"></div>    
        <div className="game-container">
          <div className="game-screen">
            <div className="slots">
              <div className="slot">
                <div className="slot-text">{slotString[0]}</div>
              </div>
              <div className="slot">
                {' '}
                <div className="slot-text">{slotString[1]}</div>
              </div>
              <div className="slot">
                {' '}
                <div className="slot-text">{slotString[2]}</div>
              </div>
            </div>
            <div className="game-message">
              <div className="credit-box">
                <h1>{tokens}</h1>
              </div>
              <div className="actions-box">
                {messageFeed.map((t, index) => (
                  <p>{t}</p>
                ))}
              </div>
            </div>
          </div>
          <div className="button-container">
            <div className="side-spacer"></div>
            <div className="bandit">
              <button className="drawbutton" onClick={drawNumber}>
                SPIN
              </button>
            </div>
            <div className="side-spacer"></div>
          </div>
        </div>
        <div className="side-spacer"></div>
      </div>
    </div>
  )
}

export default App
