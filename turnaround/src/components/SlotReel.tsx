import React from "react";

type Props = {
    value: number
}

export const SlotReel = ({value}: Props) =>{
    return (
        <div>
            {value}
        </div>
    )
}