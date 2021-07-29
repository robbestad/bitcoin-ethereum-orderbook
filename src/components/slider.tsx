import debounce from "lodash.debounce";
import styles from "../../styles/Slider.module.css";
interface Props {
  size: number;
  minVal: number;
  maxVal: number;
  updateFn: (value: number) => void;
}
export default function Slider({ size, updateFn, minVal, maxVal }: Props) {
  return (
    <div className={styles.sliderContainer}>
      <input
        type="range"
        min={minVal}
        max={maxVal}
        className={styles.slider}
        step="1"
        defaultValue={size}
        onChange={debounce(function (e: any) {
          updateFn(Number(e.target.value));
        }, 150)}
      />
    </div>
  );
}
