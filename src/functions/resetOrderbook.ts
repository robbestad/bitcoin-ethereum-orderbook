import { Dispatch } from "react";
import { ReducerName } from "../typings/enums";

export function resetOrderbook(dispatch: Dispatch<{ type: ReducerName }>) {
  dispatch({ type: ReducerName.reset });
}
