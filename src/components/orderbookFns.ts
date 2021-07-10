import { Dispatch } from "react";
import { IPayload, IState } from "../typings/interfaces";
import { TicketSize } from "../typings/enums";
import { updateOrderbook } from "./updateOrderbook";
import orderBy from "lodash.orderby";

export function reducer(
  state: IState,
  action: { type: string; payload?: IPayload | TicketSize }
): IState {
  switch (action.type) {
    case "newData": {
      const { asks, bids } = action.payload as IPayload;
      const newAsks = updateOrderbook(
        state.asks,
        asks,
        true,
        state.currentGrouping
      );
      let asksReversed = orderBy(newAsks, "price", "desc");
      let newBids = updateOrderbook(
        state.bids,
        bids,
        false,
        state.currentGrouping
      );
      return {
        ...state,
        asksReversed: asksReversed.slice(0, 15),
        asks: newAsks.slice(0, 15),
        bids: newBids.slice(0, 15),
      };
    }
    case "setGrouping": {
      return {
        ...state,
        currentGrouping: action.payload as TicketSize,
      };
    }
    case "reset": {
      return {
        currentGrouping: state.currentGrouping,
        asks: [],
        bids: [],
        asksReversed: [],
      };
    }
    default:
      throw new Error();
  }
}

export function sendMessageToFeed(
  sendJsonMessage: Function,
  feed: string,
  product_ids: string[],
  event: string
) {
  sendJsonMessage({
    event,
    feed,
    product_ids,
  });
}

export function setGrouping(
  dispatch: Dispatch<{ type: string; payload: TicketSize }>,
  ticketSize: TicketSize
) {
  dispatch({ type: "setGrouping", payload: ticketSize });
}

export function reset(dispatch: Dispatch<{ type: string }>, type: string) {
  dispatch({ type });
}
