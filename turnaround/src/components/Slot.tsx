import React, {KeyboardEvent, useState} from "react";
import SlotControls from "./SlotControls";
import SlotReel from "./SlotReel";

import styles from './styles/slot.module.css'
import SlotLog from "./SlotLog";

const Slot = () => {
    const [reels, setReels] = useState([0, 0, 0, 0, 0])
    const [betAmount, setBetAmount] = useState(10.0)
    const betAmounts = [0.10, 0.5, 1.0, 2.5, 5.0, 10.0, 25.0, 50.0, 100.0, 250.0, 500.0, 1000.0]
    const [balance, setBalance] = useState(1000.0)
    const [wins, setWins] = useState<Array<number>>([])
    const [spins, setSpins] = useState(0)

    const spin = () => {
        if(balance < betAmount) return;
        setSpins((spins) => spins+1)
        setBalance(balance - betAmount)

        let res = []
        let resMap = new Map<number, number>()
        for(let i = 0; i < reels.length; i++){
            let n = Math.floor(Math.random() * 5)
            res.push(n)
            let mapRes = resMap.get(n)
            resMap.set(n, mapRes ? mapRes+1 : 1)
        }

        setReels(res)

        if(resMap.get(0) === reels.length){
            let amt = 100*betAmount
            setBalance(balance + amt)
            setWins((old) => [...old, amt])
        }
    }

    const keySpin = (e: KeyboardEvent<HTMLDivElement>) => {
        if(e.code !== 'Space') return;
        e.preventDefault()
        spin()
    }

    return (
        <div className={styles.slot}>
            <div className={styles.slotDisplay} onKeyDown={keySpin} tabIndex={0}>
                {reels.map((r, v) => (
                    <SlotReel key={v} value={r}/>
                ))}
            </div>
            <SlotControls onSpin={spin} betAmount={betAmount} balance={balance} />
            {spins}
            <SlotLog wins={wins}/>
        </div>
    );
}

export default Slot