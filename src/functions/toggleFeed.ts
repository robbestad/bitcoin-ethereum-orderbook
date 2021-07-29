import { Feed, ReducerTypes, TicketSize } from "../typings/enums";

export default function toggleFeed(
  sendMessageEvent: (productIds: Feed[], eventName: string) => void,
  setFeed: (feed: Feed) => void,
  setGroupingEvent: (ticketSize: TicketSize) => void,
  clearOrderBook: () => void,
  feed: Feed
) {
  let newFeed: Feed;
  if (feed === Feed.Bitcoin_USD) {
    sendMessageEvent([Feed.Bitcoin_USD], "unsubscribe");
    setGroupingEvent(TicketSize.BTCDefault);
    newFeed = Feed.Ethereum_USD;
  } else {
    sendMessageEvent([Feed.Ethereum_USD], "unsubscribe");
    setGroupingEvent(TicketSize.EthDefault);
    newFeed = Feed.Bitcoin_USD;
  }
  const timer = setTimeout(() => {
    clearOrderBook();
    setFeed(newFeed);
    sendMessageEvent([newFeed], "subscribe");
  }, 400);
  return () => clearTimeout(timer);
}
