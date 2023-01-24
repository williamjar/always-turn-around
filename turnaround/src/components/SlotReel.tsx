import React from "react";

type Props = {
    value: number
}

const SlotReel = ({value}: Props) =>{
    return (
        <div>
            {value}
        </div>
    )
}

export default SlotReel