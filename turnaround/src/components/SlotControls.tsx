import React from "react";
import styles from './styles/slotControls.module.css'

type Props = {
    onSpin: () => void,
    betAmount: number,
    balance: number
}

const SlotControls = (props: Props) => {
    return (
        <div className={styles.slotControls}>
            <div className={styles.balance}><h3>Balance: {props.balance}</h3></div>
            <div className={styles.drawButton} onClick={props.onSpin}><h3>SPIN!!!</h3></div>
            <div className={styles.betAmmount}><h3>Bet: {props.betAmount}</h3></div>
        </div>
    )
}

export default SlotControls