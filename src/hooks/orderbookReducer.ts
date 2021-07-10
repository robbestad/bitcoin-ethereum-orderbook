import { IPayload, IState } from "../typings/interfaces";
import { TicketSize } from "../typings/enums";
import { updateOrderbook } from "../components/updateOrderbook";
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
    case "setTicketSizeGrouping": {
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
    default: {
      debugger;
      throw new Error();
    }
  }
}
