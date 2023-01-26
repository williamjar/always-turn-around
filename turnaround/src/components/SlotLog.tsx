import React from "react";

type Props = {
    wins: Array<number>
}

const SlotLog = (props: Props) => {
    return(
        <div>
            This is the slot log of recent spins
            <div className={"winList"}>
                {props.wins.map((w, i) => (
                    <div className={"win"} key={i}>
                        You won: {w}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SlotLog