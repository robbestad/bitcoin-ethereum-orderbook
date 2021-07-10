import cn from "classnames";
import styles from "../../styles/Orderbook.module.css";
import { OrderWithTotal } from "../typings/interfaces";
import Entry from "./orderEntry";
import { Variant } from "../typings/enums";

type Props = {
  entries: OrderWithTotal[];
  greenColorScheme: boolean;
  depth: number;
  variant?: Variant;
};

function Bids({
  entries,
  greenColorScheme,
  depth,
  variant = Variant.desktop,
}: Props) {
  if (!entries) return null;
  let highestTotal = entries[depth - 1]?.total;
  if (variant === Variant.mobile) {
    highestTotal = entries[0]?.total;
  }
  return (
    <div
      className={cn({
        [styles.asks]: greenColorScheme,
        [styles.bids]: !greenColorScheme,
        [styles.asksMobile]: greenColorScheme && variant === Variant.mobile,
        [styles.asksDesktop]: greenColorScheme && variant === Variant.desktop,
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
              reverse={greenColorScheme}
              bid={bid}
              variant={variant}
            />
          )
      )}
    </div>
  );
}

export default Bids;
