import { IPayload, IState, OrderWithTotal } from "../typings/interfaces";
import { ReducerTypes, TicketSize } from "../typings/enums";
import { updateOrderbook } from "../functions/updateOrderbook";
import orderBy from "lodash.orderby";

export function reducer(
  state: IState,
  action: { type: string; payload?: IPayload | TicketSize }
): IState {
  switch (action.type) {
    case ReducerTypes.newData: {
      let newAsks: OrderWithTotal[] = state.asks;
      let asksReversed: OrderWithTotal[] = [];
      let newBids: OrderWithTotal[] = state.bids;
      const { asks, bids } = <IPayload>action.payload;
      newAsks = updateOrderbook(newAsks, asks, true, state.currentGrouping);
      newBids = updateOrderbook(newBids, bids, false, state.currentGrouping);
      asksReversed = orderBy(newAsks, "price", "desc").slice(
        newAsks.length - state.depth,
        newAsks.length
      );

      return {
        ...state,
        asksReversed: asksReversed,
        asks: newAsks,
        bids: newBids,
      };
    }
    case ReducerTypes.setTicketSizeGrouping: {
      return {
        ...state,
        currentGrouping: action.payload as TicketSize,
      };
    }
    case ReducerTypes.depth: {
      return {
        ...state,
        depth: action.payload as number,
      };
    }
    case ReducerTypes.reset: {
      return {
        ...state,
        newAsks: [],
        newBids: [],
        asks: [],
        bids: [],
        asksReversed: [],
      };
    }
    default: {
      throw new Error();
    }
  }
}
