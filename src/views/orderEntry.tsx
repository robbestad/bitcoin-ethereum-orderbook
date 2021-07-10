import { OrderWithTotal } from "../typings/interfaces";
import cn from "classnames";
import styles from "../../styles/Orderbook.module.css";
import { Variant } from "../typings/enums";

type EntryProps = {
  bid: OrderWithTotal;
  highestTotal: number;
  reverse: boolean;
  variant: Variant;
};

export default function Entry({
  bid,
  highestTotal,
  reverse,
  variant = Variant.desktop,
}: EntryProps) {
  if (!bid) return null;
  let percentage = (bid.total / highestTotal) * 100;
  if (variant === Variant.mobile) {
    percentage = (bid.total / highestTotal) * 100;
  }
  return (
    <span className={cn(styles.bidContainer, { [styles.reverse]: reverse })}>
      <div className={styles.total}>{bid.total.toLocaleString("en-US")}</div>
      <div className={styles.size}>{bid.size.toLocaleString("en-US")}</div>
      <div
        className={cn(styles.price, {
          [styles.price__green]: !reverse,
          [styles.price__red]: reverse,
        })}
      >
        {bid.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </div>
      <div
        className={cn({
          [styles.chart]: !reverse,
          [styles.chartReversed]: reverse,
        })}
        style={{ width: `${percentage}%` }}
      />
    </span>
  );
}
