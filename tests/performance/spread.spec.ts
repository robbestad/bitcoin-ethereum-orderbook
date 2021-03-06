import microtime from "microtime";
import { expect } from "chai";
import calculateSpread from "../../src/functions/calculateSpread";
import { OrderWithTotal } from "../../src/typings/interfaces";

const perf = function (
  testName: string,
  fn: (...args: any) => string,
  ...args: any
) {
  let startTime = microtime.now();
  fn(...args);
  let endTime = microtime.now();
  let result = endTime - startTime;
  return {
    result: testName + ": " + result + "µs",
    time: result,
  };
};

describe("Performance test calculateSpread", () => {
  it("Calculate spread is reasonably fast", () => {
    const bids: OrderWithTotal[] = [{ size: 0.1, price: 1, total: 0 }];
    const asks: OrderWithTotal[] = [{ size: 1, price: 2, total: 0 }];
    const spreadPerf = perf("spread", calculateSpread, bids, asks);
    expect(spreadPerf.time).to.be.lessThanOrEqual(150_000); //150 milliseconds
  });
});
