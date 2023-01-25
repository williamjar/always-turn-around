import React from "react";
import styles from './styles/slotReel.module.css'


type Props = {
    value: number
}

const SlotReel = ({value}: Props) =>{
    return (
        <div className={styles.slotReel}>
            {value}
        </div>
    )
}

export default SlotReel