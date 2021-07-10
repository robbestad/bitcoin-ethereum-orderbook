import styles from "../../styles/Orderbook.module.css";
import { Feed } from "../typings/enums";

type Props = {
  feed: Feed;
  handleToggleFeed: (feed: Feed) => void;
  displayError: boolean;
  handleToggleCrash: () => void;
};
export default function Controls({
  feed,
  handleToggleFeed,
  displayError,
  handleToggleCrash,
}: Props) {
  return (
    <div className={styles.controls}>
      <button
        className={styles.btnToggleFeed}
        onClick={() => handleToggleFeed(feed)}
      >
        Toggle feed
      </button>
      <button className={styles.btnKillFeed} onClick={handleToggleCrash}>
        {displayError ? "Restart" : "Kill feed"}
      </button>
    </div>
  );
}
