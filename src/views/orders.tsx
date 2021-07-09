import cn from "classnames";
import styles from "../../styles/Orderbook.module.css";
import { BidWithTotal } from "../typings/interfaces";
import Entry from "./orderEntry";
import { Variant } from "../typings/enums";

type Props = {
  entries: BidWithTotal[];
  reverse: boolean;
  depth: number;
  variant?: Variant;
};

function Bids({ entries, reverse, depth, variant = Variant.desktop }: Props) {
  let highestTotal = entries[depth - 1]?.total;
  if (variant === Variant.mobile) {
    highestTotal = entries[0]?.total;
  }
  return (
    <div
      className={cn({
        [styles.asks]: reverse,
        [styles.bids]: !reverse,
        [styles.asksMobile]: reverse && variant === Variant.mobile,
        [styles.asksDesktop]: reverse && variant === Variant.desktop,
      })}
    >
      <div className={styles.bidContainer}>
        <div className={styles.total}>Total</div>
        <div className={styles.size}>Size</div>
        <div className={styles.price}>Price</div>
      </div>
      {entries.map(
        (bid, index) =>
          index < depth && (
            <Entry
              key={`${index}${bid.price}`}
              highestTotal={highestTotal}
              reverse={reverse}
              bid={bid}
              variant={variant}
            />
          )
      )}
    </div>
  );
}

export default Bids;
