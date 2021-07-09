import {TicketSize} from "../src/typings/enums";
import {expect} from "chai";
import groupByTicketsize from "../src/components/groupByTicketSize";
import {RawBid} from "../src/typings/types";

describe("Group by ticketsize", () => {
    it("groups by 2.5", () => {
        const orderbook: RawBid[] = [
            [34669.5, 1000], [34670.0, 1500], [34671, 3000.0],
            [34687.5, 5000], [34688.0, 3500], [34688.5, 3500],
            [34698.5, 3500]];
        const newOrderbook = groupByTicketsize(orderbook, TicketSize.BTCLarge);

        let sum1 = Math.floor(((orderbook[0][0] + orderbook[1][0] + orderbook[2][0])/3) / TicketSize.BTCLarge) * TicketSize.BTCLarge;
        expect(newOrderbook[0][0]).to.equal(orderbook[2][0]);
        expect(newOrderbook[0][1]).to.equal((orderbook[0][1] + orderbook[1][1] + orderbook[2][1]));

        let sum2 = Math.floor(((orderbook[3][0] + orderbook[4][0] + orderbook[5][0])/3) / TicketSize.BTCLarge) * TicketSize.BTCLarge;
        expect(newOrderbook[1][0]).to.equal(orderbook[5][0]);
        expect(newOrderbook[1][1]).to.equal((orderbook[3][1] + orderbook[4][1] + orderbook[5][1]));

        let sum3 = Math.floor(orderbook[6][0]/1 / TicketSize.BTCLarge) * TicketSize.BTCLarge;
        expect(newOrderbook[2][0]).to.equal(orderbook[6][0]);
        expect(newOrderbook[2][1]).to.equal(orderbook[6][1]);
    });

    it("groups by 1", () => {
        const orderbook: RawBid[] = [
            [34669.5, 1000], [34670.0, 1500],
            [34671, 3000.0], [34671.5, 5000],
            [34688.0, 3500], [34688.5, 3500],
            [34698.5, 3500]];
        const newOrderbook = groupByTicketsize(orderbook, TicketSize.BTCMedium);

        let sum1 = Math.floor(((orderbook[0][0] + orderbook[1][0] )/2) / TicketSize.BTCMedium) * TicketSize.BTCMedium;
        expect(newOrderbook[0][0]).to.equal(orderbook[1][0]);
        expect(newOrderbook[0][1]).to.equal((orderbook[0][1] + orderbook[1][1]));

        let sum2 = Math.floor(((orderbook[2][0] + orderbook[3][0] )/2) / TicketSize.BTCMedium) * TicketSize.BTCMedium;
        expect(newOrderbook[1][0]).to.equal(orderbook[3][0]);
        expect(newOrderbook[1][1]).to.equal((orderbook[2][1] + orderbook[3][1]));

        expect(newOrderbook[2][0]).to.equal(orderbook[5][0]);
        expect(newOrderbook[3][1]).to.equal(orderbook[6][1]);

    });

});
