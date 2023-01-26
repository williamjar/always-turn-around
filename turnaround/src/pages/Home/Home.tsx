import React, { useState, useEffect } from 'react'
import '../../App.css'
import Header from "../../components/Header"
import SlotControls from '../../components/SlotControls'

function HomePage() {
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

    const keySpin = (e: KeyboardEvent) => {
        if(e.code !== 'Space') return;
        e.preventDefault()
        drawNumber()
    }

    useEffect(() => {
        document.addEventListener('keypress', keySpin)
        return function cleanup(){
            document.removeEventListener('keypress', keySpin)
        }
    })

    return (
        <div>
            <header>
                <Header/>
            </header>
            <div className="main">
                <div className="main-col">
                    <iframe className="surfers" width="315" height="1200" src="https://www.youtube.com/embed/ChBg4aowzX8?autoplay=1" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
                </div>

                <div className="main-col" id="game-container">
                    <div className="game-screen">
                        <div className="slot-container">
                            <div className="slot" id="slot-1">
                                <div className="slot-text">{slotString[0]}</div>
                            </div>
                            <div className="slot" id="slot-2">
                                {' '}
                                <div className="slot-text">{slotString[1]}</div>
                            </div>
                            <div className="slot" id="slot-3">
                                {' '}
                                <div className="slot-text">{slotString[2]}</div>
                            </div>
                        </div>
                        <div className="game-message-container">
                            <div className="credit-box">
                                <h1>{tokens}</h1>
                            </div>
                            <div className="actions-box">
                                {messageFeed.map((t, index) => (
                                    <p key={index}>{t}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                    <SlotControls onSpin={drawNumber} betAmount={100} balance={tokens}/>
                </div>

                <div className="main-col"><iframe className="surfers" width="315" height="1200" src="https://www.youtube.com/embed/ChBg4aowzX8?autoplay=1" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe></div>
            </div>
        </div>
    )
}

export default HomePage
