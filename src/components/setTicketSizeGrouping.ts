import { Dispatch } from "react";
import { TicketSize } from "../typings/enums";

export function setTicketSizeGrouping(
  dispatch: Dispatch<{ type: string; payload: TicketSize }>,
  ticketSize: TicketSize
) {
  dispatch({ type: "setTicketSizeGrouping", payload: ticketSize });
}
