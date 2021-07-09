import {RawBid} from "../typings/types";
import {TicketSize} from "../typings/enums";

export default function groupByTicketsize(bids: RawBid[], ticketSize: TicketSize) {
    let currentBid = bids[0];
    let newBids: RawBid[] = [];
    let bidGroup: RawBid[][] = [];
    let bidGroupCount = 0;
    let tempBids: RawBid[] = [];
    bids.forEach((bid, index) => {
        const [currentPrice, currentSize] = currentBid;
        const [nextPrice, nextSize] = bid;
        let delta = nextPrice - currentPrice;
        if (delta <= ticketSize) {
            tempBids.push(bid);
        } else {
            bidGroup[bidGroupCount] = tempBids;
            tempBids = [bid];
            currentBid = bid;
            bidGroupCount++;
        }

        //if last bid:
        if (index + 1 === bids.length) {
            const [currentPrice, currentSize] = currentBid;
            const [nextPrice, nextSize] = bids[index];
            let delta = nextPrice - currentPrice;
            bidGroup[bidGroupCount] = tempBids;
        }

    });
    bidGroup.forEach(bids => {
        let priceSum = 0;
        let sizeSum = 0;
        for (let b in bids) {
            sizeSum += bids[b][1];
            priceSum += bids[b][0];
        }
        let price = Math.floor(priceSum/bids.length / ticketSize) * ticketSize;

        price = bids[bids.length-1][0];

        newBids.push([price, sizeSum]);
    });

    return newBids;
}
