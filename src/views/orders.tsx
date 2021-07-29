import cn from "classnames";
import styles from "../../styles/Orders.module.css";
import { OrderWithTotal } from "../typings/interfaces";
import Entry from "./orderEntry";
import { Variant } from "../typings/enums";

type Props = {
  entries: OrderWithTotal[];
  greenColorScheme: boolean;
  depth: number;
  total: number;
  variant?: Variant;
};
let padArray = function (
  arr: OrderWithTotal[],
  len: number,
  fill: OrderWithTotal
) {
  return arr.concat(Array(len).fill(fill)).slice(0, len);
};

function Bids({
  entries,
  greenColorScheme,
  depth,
  variant = Variant.desktop,
}: Props) {
  if (!entries) return null;
  let orders = entries;
  if (entries.length < depth) {
    orders = padArray(entries, depth, { price: 0, size: 0, total: 0 });
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

      {orders.map(
        (bid, index) =>
          index < depth && (
            <Entry
              key={`${index}${bid.price}`}
              highestTotal={orders[depth - 1].total}
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
