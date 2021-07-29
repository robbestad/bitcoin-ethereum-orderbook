import cn from "classnames";
import styles from "../../styles/Orders.module.css";
import { OrderWithTotal } from "../typings/interfaces";
import Entry from "./orderEntry";
import { Variant } from "../typings/enums";

type Props = {
  entries: OrderWithTotal[];
  isAsk: boolean;
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

function Bids({ entries, isAsk, depth, variant = Variant.desktop }: Props) {
  if (!entries) return null;
  let orders = entries;
  if (entries.length < depth) {
    orders = padArray(entries, depth, { price: 0, size: 0, total: 0 });
  }

  let highestTotal = orders[depth - 1].total;
  let highestTotalReversed = orders[orders.length - depth].total;

  return (
    <div
      className={cn({
        [styles.asks]: isAsk,
        [styles.bids]: !isAsk,
        [styles.asksMobile]: isAsk && variant === Variant.mobile,
        [styles.asksDesktop]: isAsk && variant === Variant.desktop,
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
              highestTotal={
                variant === Variant.desktop
                  ? highestTotal
                  : isAsk
                  ? highestTotalReversed
                  : highestTotal
              }
              reverse={isAsk}
              bid={bid}
              variant={variant}
            />
          )
      )}
    </div>
  );
}

export default Bids;
