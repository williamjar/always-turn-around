import Slot from "../../components/Slot";
import Header from "../../components/Header";
import styles from './slot.module.css'

export const SlotPage = () => {
    return (
        <>
            <Header/>
            <div className={styles.slotContainer}>
                <Slot/>
                <iframe width="400" height="600" src="https://www.youtube.com/embed/nNGQ7kMhGuQ?controls=1&autoplay=1"
                        title="YouTube video player" frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen></iframe>

            </div>
        </>
    )
}

export default SlotPage