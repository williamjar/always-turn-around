import React from "react";
import drawNumber from "../App";
import styles from './styles/slotControls.module.css';

export const SlotControls = () => {
    return (
        <div className={styles.slotControls}>
            <div className={styles.sideSpacer}></div>
            <div className={styles.bandit}>
              <button className={styles.drawbutton} onClick={drawNumber}>
                SPIN
              </button>
            </div>
            <div className={styles.sideSpacer}></div>
        </div>
    )
}