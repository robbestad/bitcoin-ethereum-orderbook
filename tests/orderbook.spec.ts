import { expect } from 'chai';
import 'mocha';
import events from "./fixtures/events"
import Orderbook from "../components/orderbook";

describe('Render snapshot', () => {
    const snapshot = events.filter((e)=>e.indexOf("book_ui_1_snapshot")!==-1)[0];
    let levels = JSON.parse(snapshot);
    it('Should parse snapshot', () => {
        expect(levels["numLevels"]).to.equal(25);
        expect(levels["bids"].length).to.equal(25);
        expect(levels["asks"].length).to.equal(25);
    });

    it('Should add a bid', () => {
        let orderbook = Orderbook();
        expect(orderbook.bids()).to.eql([]);
        expect(orderbook.addBid(25000,1000)).to.equal(0);
        expect(orderbook.addBid(27000,1000)).to.equal(1);
        expect(orderbook.addBid(26000,1000)).to.equal(2);
        expect(orderbook.addBid(25000,4000)).to.equal(0);
        expect(orderbook.addBid(27000,4000)).to.equal(1);
        expect(orderbook.bids().length).to.eql(3);
    });


})
