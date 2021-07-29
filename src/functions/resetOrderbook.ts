import { Dispatch } from "react";

export function resetOrderbook(
  dispatch: Dispatch<{ type: string }>,
  type: string
) {
  dispatch({ type });
}
