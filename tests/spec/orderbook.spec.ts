import { expect } from "chai";
import { updateOrderbook } from "../../src/components/updateOrderbook";
import { TicketSize } from "../../src/typings/enums";
import { RawBid } from "../../src/typings/types";

describe("Update orderbook", () => {
  it("update asks in the right order", () => {
    const bids: RawBid[] = [
      [33768.5, 1],
      [33768, 5],
      [337677, 10],
      [33672, 20],
    ];
    const asks: RawBid[] = [
      [33776.0, 1],
      [33777.5, 1],
      [33780.0, 1],
      [33780.09, 1],
    ];
    const newAsks = updateOrderbook([], asks, true, TicketSize.BTCDefault);
    const newBids = updateOrderbook([], bids, false, TicketSize.BTCDefault);
    expect(newAsks[0].price).to.equal(33776);
    expect(newAsks[0].size).to.equal(1);
    expect(newAsks[0].total).to.equal(1);
    expect(newAsks[1].total).to.equal(2);
    expect(newAsks[2].total).to.equal(3);
    expect(newAsks[3].total).to.equal(4);
  });
  it("updates bids in the right order", () => {
    const bids: RawBid[] = [
      [33768, 5],
      [33677, 10],
      [33768.5, 1],
      [33672, 20],
    ];
    const newBids = updateOrderbook([], bids, false, TicketSize.BTCDefault);
    expect(newBids[0].price).to.equal(33768.5);
    expect(newBids[0].size).to.equal(1);
    expect(newBids[0].total).to.equal(1);
    expect(newBids[1].total).to.equal(6);
    expect(newBids[2].total).to.equal(16);
    expect(newBids[3].total).to.equal(36);
  });
});
