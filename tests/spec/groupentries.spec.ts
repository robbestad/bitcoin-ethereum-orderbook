import { TicketSize } from "../../src/typings/enums";
import { expect } from "chai";
import groupByTicketsize from "../../src/functions/groupByTicketSize";
import { RawOrder } from "../../src/typings/types";

describe("Group stream by ticketsize", () => {
  describe("Groups Bitcoin by TicketSize", () => {
    let orders: RawOrder[];
    beforeEach(() => {
      orders = [
        [29000, 50],
        [29000.5, 50],
        [29001, 50],
        [29002, 50],
        [29003, 50],
      ];
    });

    it("should group items by ticketSize 1", () => {
      const results = groupByTicketsize(orders, TicketSize.BTCMedium);
      expect(results[0]).to.be.an("array").to.have.same.members([29000, 50]);
      expect(results[1]).to.be.an("array").to.have.same.members([29001, 100]);
      expect(results[2]).to.be.an("array").to.have.same.members([29002, 50]);
    });

    it("should group items by ticketSize 2.5", () => {
      const results = groupByTicketsize(orders, TicketSize.BTCLarge);
      expect(results[0]).to.be.an("array").to.have.same.members([29000, 50]);
      expect(results[1]).to.be.an("array").to.have.same.members([29002.5, 150]);
    });
  });
});
