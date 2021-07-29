import styles from "../../styles/Titlebar.module.css";
import { Feed, TicketSize } from "../typings/enums";
import Select from "./selectGrouping";

type Props = {
  feed: Feed;
  currentGrouping: TicketSize;
  handleChangeGrouping: (grouping: TicketSize) => void;
  spread: string;
  children: React.ReactNode;
};

function Titlebar({
  feed,
  currentGrouping,
  handleChangeGrouping,
  spread,
  children,
}: Props) {
  return (
    <section className={styles.titlebarContainer}>
      <h1 className={styles.title}>Order Book</h1>
      <div className={styles.spread}>Spread {spread}</div>
      <div className={styles.titleSliders}>{children}</div>
      <div className={styles.grouping}>
        <Select
          currentGrouping={currentGrouping}
          feed={feed}
          callback={(value) => handleChangeGrouping(value)}
        />
      </div>
    </section>
  );
}
export default Titlebar;
