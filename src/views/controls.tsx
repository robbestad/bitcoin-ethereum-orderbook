import styles from "../../styles/Orderbook.module.css";

type Props = {
  feed: string;
  curriedToggleFeed: (feed: string) => void;
  displayError: boolean;
  handleToggleCrash: () => void;
};
export default function Controls({
  feed,
  curriedToggleFeed,
  displayError,
  handleToggleCrash,
}: Props) {
  return (
    <div className={styles.controls}>
      <button
        className={styles.btnToggleFeed}
        onClick={() => curriedToggleFeed(feed)}
      >
        Toggle feed
      </button>
      <button className={styles.btnKillFeed} onClick={handleToggleCrash}>
        {displayError ? "Restart" : "Kill feed"}
      </button>
    </div>
  );
}
