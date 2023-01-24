import styles from './styles/button.module.css'
import React from "react";

type Props = {
    text: string
}

export class Button extends React.Component<Props, any>{
    render() {
        return (
            <button className={styles.btn}>{this.props.text}</button>
        )
    }
}