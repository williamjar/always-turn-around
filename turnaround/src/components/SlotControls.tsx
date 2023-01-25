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
            <div>Balance: {props.balance}</div>
            <div className={styles.spin} onClick={props.onSpin}>SPIN!!!</div>
            <div>Bet: {props.betAmount}</div>
        </div>
    )
}

export default SlotControls