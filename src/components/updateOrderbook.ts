import orderBy from "lodash.orderby";
import { BidWithTotal } from "../typings/interfaces";
import { TicketSize } from "../typings/enums";
import groupByTicketsize from "./groupByTicketSize";
import { RawBid } from "../typings/types";

export const updateOrderbook = (
  orderbook: BidWithTotal[],
  delta: RawBid[] = [],
  reverseOrder = false,
  ticketSize: TicketSize = TicketSize.BTCDefault
) => {
  const deltaPrices = delta.map((d) => d[0]);
  let updatedOrderBook = orderbook.filter(
    (bid) => !deltaPrices.includes(bid.price)
  );
  delta
    .filter((order) => order[1] > 0)
    .forEach((order) => {
      updatedOrderBook.push({ price: order[0], size: order[1], total: 0 });
    });

  if (ticketSize !== TicketSize.BTCDefault) {
    const newOrderbook = orderBy(updatedOrderBook, "price");
    const groupedOrderBook = groupByTicketsize(
      newOrderbook.map((bid) => [bid.price, bid.size]),
      ticketSize
    );
    updatedOrderBook = groupedOrderBook.map((bid) => ({
      price: bid[0],
      size: bid[1],
      total: 0,
    }));
  }
  let total = 0;

  return orderBy(updatedOrderBook, "price", reverseOrder ? "asc" : "desc").map(
    (bid) => ({
      ...bid,
      total: (total += bid.size),
    })
  );
};
