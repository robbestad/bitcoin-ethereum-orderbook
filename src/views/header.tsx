import styles from "../../styles/Header.module.css";
import {Feed, TicketSize} from "../typings/enums";
import Select from "./selectGrouping";

type Props = {
    feed: Feed,
    currentGrouping: TicketSize,
    handleChangeGrouping: (grouping: TicketSize) => void,
    spread: string
}

function Header({feed, currentGrouping, handleChangeGrouping, spread}: Props) {
    return (
        <section className={styles.headerContainer}>
            <h1 className={styles.title}>Order Book</h1>
            <div className={styles.spread}>Spread {spread}</div>
            <div className={styles.grouping}>
               <Select currentGrouping={currentGrouping} feed={feed} callback={(value)=>handleChangeGrouping(value)} />
            </div>
        </section>
    );
}
export default Header;
