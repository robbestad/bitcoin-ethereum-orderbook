import { useEffect, useReducer } from "react";
import useWebSocket from "react-use-websocket";
import { IState } from "../typings/interfaces";
import curry from "lodash.curry";
import { TicketSize } from "../typings/enums";
import {
  reducer,
  reset,
  sendMessageToFeed,
  setGrouping,
} from "../components/orderbookFns";

const useOrderBook = (url: string, product_ids: string[]) => {
  const initialState = <IState>{
    asks: [],
    bids: [],
    currentGrouping: TicketSize.BTCDefault,
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(url, {
    onError: () => alert("Websocket connection failed."),
  });
  const sendMessageEvent = curry(sendMessageToFeed)(
    sendJsonMessage,
    "book_ui_1"
  );
  const setGroupingEvent = curry(setGrouping)(dispatch);
  const clearOrderBook = curry(reset)(dispatch);

  useEffect(() => {
    if (readyState === 1) return;
    sendMessageEvent(product_ids, "subscribe");
  }, [readyState, sendMessageEvent]);

  useEffect(() => {
    if (!lastJsonMessage) return;
    dispatch({ type: "newData", payload: lastJsonMessage });
  }, [lastJsonMessage]);

  return { ...state, sendMessageEvent, setGroupingEvent, clearOrderBook };
};
export default useOrderBook;
