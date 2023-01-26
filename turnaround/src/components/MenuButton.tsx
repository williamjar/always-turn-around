import styles from './styles/menuButton.module.css'
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export const MenuButton = () => {
    return (
        <button className={styles.menuBtn}>
            <FontAwesomeIcon icon={faBars} size="2x"/>
        </button>
    )
}