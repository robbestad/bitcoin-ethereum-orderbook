import { TicketSize } from "../typings/enums";

export default function changeTicketSizeGrouping(
  setGroupingEvent: (grouping: TicketSize) => void,
  clearOrderBook: (eventName: string) => void,
  ticketSize: TicketSize
) {
  clearOrderBook("reset");
  const timer = setTimeout(() => {
    setGroupingEvent(ticketSize);
  }, 250);
  return () => clearTimeout(timer);
}
