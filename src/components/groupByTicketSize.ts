import { RawOrder } from "../typings/types";
import { TicketSize } from "../typings/enums";

export default function groupByTicketsize(
  bids: RawOrder[],
  grouping: TicketSize
) {
  return bids.reduce<RawOrder[]>((acc, order) => {
    const [price, size] = order;
    const [prevPrice, prevSize] = acc[acc.length - 1] || [];
    const roundedPrice = Math.ceil(Number(price) / grouping) * grouping;
    if (roundedPrice !== prevPrice) {
      return [...acc, [roundedPrice, size]];
    }
    const nextSize = prevSize + size;
    return [...acc.slice(0, acc.length - 1), [roundedPrice, nextSize]];
  }, []);
}
