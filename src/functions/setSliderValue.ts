import { Dispatch } from "react";

export function setSliderValue(
  dispatch: Dispatch<{ type: string; payload: number }>,
  type: string,
  value: number
) {
  dispatch({ type, payload: value });
}
