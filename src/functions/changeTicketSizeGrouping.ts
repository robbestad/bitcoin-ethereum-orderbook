import { TicketSize } from "../typings/enums";

export default function changeTicketSizeGrouping(
  setGroupingEvent: (grouping: TicketSize) => void,
  clearOrderBook: () => void,
  ticketSize: TicketSize
) {
  clearOrderBook();
  const timer = setTimeout(() => {
    setGroupingEvent(ticketSize);
  }, 250);
  return () => clearTimeout(timer);
}
