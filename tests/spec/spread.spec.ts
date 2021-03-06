import { expect } from "chai";
import calculateSpread from "../../src/functions/calculateSpread";
import { OrderWithTotal } from "../../src/typings/interfaces";

describe("Calculate spread", () => {
  it("spread value and percentage is calculated correctly", () => {
    const bids: OrderWithTotal[] = [
      { size: 1, price: 33768.5, total: 1 },
      { size: 5, price: 33768, total: 6 },
      { size: 10, price: 33677, total: 16 },
      { size: 20, price: 33672, total: 36 },
    ];
    const asks: OrderWithTotal[] = [
      { size: 1, price: 33776.0, total: 1 },
      { size: 2, price: 33777.5, total: 3 },
      { size: 3, price: 33780.0, total: 6 },
      { size: 4, price: 33780.0, total: 10 },
    ];
    const spread = calculateSpread(bids, asks);
    expect(spread).to.equal("7.5 (0.022%)");
  });
});
