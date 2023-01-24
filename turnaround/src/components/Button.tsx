import styles from './styles/button.module.css'
import React from "react";

type Props = {
    text: string
}

export const Button = ({text}: Props) => {
    return (
        <button className={styles.btn}>{text}</button>
    )
}