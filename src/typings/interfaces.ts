import { TicketSize } from "./enums";
import { RawBid } from "./types";

export interface BidWithTotal {
  price: number;
  size: number;
  total: number;
}

export interface IState {
  asks: BidWithTotal[];
  asksReversed: BidWithTotal[];
  bids: BidWithTotal[];
  currentGrouping: TicketSize;
}

export interface IPayload {
  feed: string;
  product_id: string;
  asks: RawBid[];
  bids: RawBid[];
}
