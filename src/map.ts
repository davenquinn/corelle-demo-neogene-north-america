import { geoStereographic, geoTransverseMercator } from "d3-geo";
import { useRef } from "react";
import { PlateFeatureLayer } from "@macrostrat/corelle";
import { hyperStyled } from "@macrostrat/hyper";
import { RotatedFeatureLayer } from "./feature-overlay";
import { Globe } from "@macrostrat/map-components";
import "@macrostrat/map-components/dist/esm/index.css";
import styles from "./main.styl";

const h = hyperStyled(styles);

const center = [-115, 30];

const createProjection = () => {
  return geoTransverseMercator().rotate([-center[0], -center[1], -40]);
};

const Map = (props) => {
  /** Map that implements callback to reset internal map state */
  const { width, height } = props;
  const projection = createProjection();
  const mapRef = useRef<Globe>();

  const resetMap = () => {
    // We have to totally recreate the projection for it to be immutable
    mapRef.current?.resetProjection(createProjection());
  };

  return h("div.world-map", { style: { width, height } }, [
    h(
      Globe,
      {
        ref: mapRef,
        keepNorthUp: true,
        projection,
        scale: width * 4,
        width,
        height,
        keepNorthUp: true,
      },
      [
        h(PlateFeatureLayer, {
          name: "ne_110m_land",
          useCanvas: false,
          style: {
            fill: "#E9FCEA",
            stroke: "#9dc99f",
          },
        }),
        h(RotatedFeatureLayer),
      ]
    ),
    h("a.reset-map", { onClick: resetMap }, "Reset projection"),
  ]);
};

export { Map };
