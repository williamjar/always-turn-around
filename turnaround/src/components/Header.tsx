import styles from './styles/header.module.css'
import React from "react";
import Button from './Button';
import { MenuButton } from './MenuButton';

const Header = () => {
    return (
        <div className={styles.header}>
            <div className='button-container' id="menu-button-container">
                <MenuButton/>
            </div>
            <div className='title-container'>
                <h1 className="title">It Can Always Turn Around</h1>
            </div>
            <div className='button-container user-buttons'>
                    <Button text={"Sign up"}/>

                    <Button text={"Log in"}/>
            </div>
        </div>
    )
}

export default Header