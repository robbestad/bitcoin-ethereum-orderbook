import { expect } from "chai";
import { updateOrderbook } from "../../src/components/updateOrderbook";
import { TicketSize } from "../../src/typings/enums";
import { RawOrder } from "../../src/typings/types";

describe("Update orderbook", () => {
  let bids: RawOrder[];
  let asks: RawOrder[];

  beforeEach(() => {
    bids = [
      [33768, 5],
      [33677, 10],
      [33768.5, 1],
      [33672, 20],
      [32931.5, 100],
      [32931, 100],
      [32929.5, 500],
      [32929, 800],
      [32930, 900],
      [32799, 50],
    ];
    asks = [
      [33776.0, 1],
      [33777.5, 1],
      [33780.0, 1],
      [33780.09, 1],
    ];
  });
  it("update asks in the right order", () => {
    const newAsks = updateOrderbook([], asks, true, TicketSize.BTCDefault);
    expect(newAsks[0].price).to.equal(33776);
    expect(newAsks[0].size).to.equal(1);
    expect(newAsks[0].total).to.equal(1);
    expect(newAsks[1].total).to.equal(2);
    expect(newAsks[2].total).to.equal(3);
    expect(newAsks[3].total).to.equal(4);
  });
  it("updates bids in the right order", () => {
    const newBids = updateOrderbook([], bids, false, TicketSize.BTCDefault);
    expect(newBids[0].price).to.equal(33768.5);
    expect(newBids[0].size).to.equal(1);
    expect(newBids[0].total).to.equal(1);
    expect(newBids[1].total).to.equal(6);
    expect(newBids[2].total).to.equal(16);
    expect(newBids[3].total).to.equal(36);
    expect(newBids[8].total).to.equal(2436);
  });
  it("updates bids in the right order with grouping BTCMedium", () => {
    const newBids = updateOrderbook([], bids, false, TicketSize.BTCMedium);
    expect(newBids.length).to.equal(6);
    expect(newBids[0].price).to.equal(33768.5);
    expect(newBids[0].size).to.equal(6);
    expect(newBids[0].total).to.equal(6);
  });
  it("updates bids in the right order with grouping BTCLarge", () => {
    const newBids = updateOrderbook([], bids, false, TicketSize.BTCLarge);
    expect(newBids.length).to.equal(5);
    expect(newBids[0].price).to.equal(33768.5);
    expect(newBids[0].size).to.equal(6);
    expect(newBids[0].total).to.equal(6);
  });
});
