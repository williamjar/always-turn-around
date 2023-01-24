import React, {useState} from "react";
import {SlotControls} from "./SlotControls";
import {SlotReel} from "./SlotReel";

export const Slot = () => {
    const [reels, setReels] = useState([0,0,0])

    return (
        <div className={'slot'}>
            <div className={'slotDisplay'}>
                <SlotReel/>
                <SlotReel/>
                <SlotReel/>
            </div>
            <SlotControls />
        </div>
    );
}