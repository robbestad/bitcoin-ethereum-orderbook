import { TicketSize } from "./enums";
import { RawOrder } from "./types";

export interface OrderWithTotal {
  price: number;
  size: number;
  total: number;
}

export interface IState {
  asks: OrderWithTotal[];
  asksReversed: OrderWithTotal[];
  bids: OrderWithTotal[];
  currentGrouping: TicketSize;
  depth: number;
}

export interface IPayload {
  feed: string;
  product_id: string;
  asks: RawOrder[];
  bids: RawOrder[];
}
