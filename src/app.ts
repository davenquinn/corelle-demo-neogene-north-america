import h from "@macrostrat/hyper";
import { useState, useEffect } from "react";
import { ResizeSensor } from "@blueprintjs/core";
import { RotationsProvider } from "@macrostrat/corelle";
import { Timescale, TimescaleOrientation } from "@macrostrat/timescale";
import "@macrostrat/timescale/dist/timescale.css";
import { Map } from "./map";
import { Credits } from "./credits";
import { getQueryString, setQueryString } from "@macrostrat/ui-components";
import "./main.styl";

function useTimeState(initialValue) {
  /** Time state hook that also manages query URL */
  let { time: _initialValue } = getQueryString() ?? {};
  const val = parseInt(_initialValue);
  const _init = isNaN(val) ? initialValue : val;

  const [time, _setTime] = useState(_init);
  const setTime = (t) => {
    _setTime(t);
    setQueryString({ time: t });
  };

  return [time, setTime];
}

function useTimeRange(range: [number, number], initialValue: number) {
  /** A time range that can be stepped through with arrow keys */

  const [time, setTime] = useTimeState(initialValue);

  useEffect(() => {
    function checkKey(e) {
      e = e || window.event;
      if (e.keyCode == "37") {
        // left arrow
        setTime(Math.min(time + 2, range[0]));
      } else if (e.keyCode == "39") {
        // right arrow
        setTime(Math.max(time - 2, range[1]));
      }
    }
    document.onkeydown = checkKey;
  }, [time]);

  return [time, setTime];
}

function MapColumn({ onResize, children }) {
  return h("div.right-column", [
    h(
      ResizeSensor,
      {
        onResize(entries) {
          console.log(entries[0].contentRect);
          const { width, height } = entries[0].contentRect;
          return onResize({ width, height });
        },
      },
      children
    ),
  ]);
}

function App() {
  /** The core app component */
  const model = "Wilson2005";

  const [time, setTime] = useTimeRange([37, 0], 10);
  const [size, setSize] = useState(null);

  return h("div.app", [
    h("div.left-column", [
      h(Credits),
      h(Timescale, {
        ageRange: [37, 0],
        orientation: TimescaleOrientation.VERTICAL,
        length: 400,
        absoluteAgeScale: true,
        levels: [3, 4],
        cursorPosition: time,
        axisProps: {
          orientation: "right",
          tickLength: 4,
          hideAxisLine: true,
          labelOffset: 4,
          width: 32,
        },
        onClick(event, age) {
          setTime(Math.round(age));
        },
      }),
    ]),
    h(MapColumn, { onResize: setSize }, [
      h(
        RotationsProvider,
        { model, time, debounce: 1000, endpoint: "http://localhost:5480/api" },
        [
          h("div.map-container", [
            h(Map, { width: size?.width ?? 0, height: size?.height ?? 0 }),
          ]),
        ]
      ),
    ]),
  ]);
}

export { App };
