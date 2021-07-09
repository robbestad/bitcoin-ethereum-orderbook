import orderBy from "lodash.orderby";
import {BidWithTotal} from "../typings/interfaces";
import {TicketSize} from "../typings/enums";
import groupByTicketsize from "./groupByTicketSize";
import {RawBid} from "../typings/types";

export const updateOrderbook = (
    bids: BidWithTotal[],
    delta: RawBid[] = [],
    reverseOrder = false,
    ticketSize: TicketSize = TicketSize.BTCDefault
) => {
    const deltaPrices = delta.map(d => d[0]);
    let updatedOrderBook = bids.filter(bid => !deltaPrices.includes(bid.price));
    const deltaBidsWithSize = delta.filter(d => d[1] > 0).map(d => ({price: d[0], size: d[1], total: 0}));
    deltaBidsWithSize.forEach(delta => updatedOrderBook.push(delta));

    // Sort orderbook (no need to reverse yet)
    const newOrderbook = orderBy(updatedOrderBook, "price");

    // Group by ticketsize (unless BTCDefault)
    if (ticketSize !== TicketSize.BTCDefault) {
        const groupedOrderBook = groupByTicketsize(newOrderbook.map(bid => ([bid.price, bid.size])), ticketSize);
        updatedOrderBook = groupedOrderBook.map(bid => ({price: bid[0], size: bid[1], total: 0}));
    }
    let total = 0;

    return orderBy(updatedOrderBook, "price", reverseOrder ? "asc" : "desc").map(bid => ({
        ...bid,
        total: total += bid.size
    }));


};
