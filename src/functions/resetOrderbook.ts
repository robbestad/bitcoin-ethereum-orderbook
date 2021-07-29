import { Dispatch } from "react";
import { ReducerTypes } from "../typings/enums";

export function resetOrderbook(dispatch: Dispatch<{ type: ReducerTypes }>) {
  dispatch({ type: ReducerTypes.reset });
}
