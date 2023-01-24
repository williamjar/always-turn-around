import React from "react";
import {SlotControls} from "./SlotControls";
import {SlotReel} from "./SlotReel";

export class Slot extends React.Component<any, any>{
    render() {
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
}