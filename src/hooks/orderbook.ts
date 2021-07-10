import { useCallback, useEffect, useReducer, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
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
    asksReversed: [],
    currentGrouping: TicketSize.BTCDefault,
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const [socketUrl, setSocketUrl] = useState(url);
  const [displayError, setDisplayError] = useState(false);
  const [hasConnectedOnce, setHasConnectedOnce] = useState(false);

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    socketUrl,
    {}
  );
  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const sendMessageEvent = curry(sendMessageToFeed)(
    sendJsonMessage,
    "book_ui_1"
  );
  const setGroupingEvent = curry(setGrouping)(dispatch);
  const clearOrderBook = curry(reset)(dispatch);

  const crashFeed = () => setSocketUrl("wss://error");
  const restartFeed = () => setSocketUrl(url);

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      if (displayError) setDisplayError(false);
      if (!hasConnectedOnce) setHasConnectedOnce(true);
      return;
    } else {
      if (hasConnectedOnce) setDisplayError(true);
    }
    sendMessageEvent(product_ids, "subscribe");
  }, [connectionStatus, hasConnectedOnce, readyState, sendMessageEvent]);

  useEffect(() => {
    if (!lastJsonMessage) return;
    dispatch({ type: "newData", payload: lastJsonMessage });
  }, [lastJsonMessage]);

  return {
    ...state,
    sendMessageEvent,
    setGroupingEvent,
    crashFeed,
    restartFeed,
    displayError,
    clearOrderBook,
  };
};
export default useOrderBook;
