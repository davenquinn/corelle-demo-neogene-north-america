/// https://paleobiodb.org/data1.2/colls/summary.json?show=time&min_ma=10&max_ma=12&level=3

import { FeatureLayer } from "@macrostrat/map-components";
import { PlateFeature } from "@macrostrat/corelle";
import h from "@macrostrat/hyper";
import fs from "fs";

const coll = JSON.parse(
  fs.readFileSync(
    `${__dirname}/../rotation-model/output/plate-features.geojson`
  )
);

export function RotatedFeatureLayer(props) {
  return h(
    FeatureLayer,
    { className: "features", useCanvas: false, style: {} },
    coll.features.map(function (feature, i) {
      const { id, properties } = feature;
      const { plate_id } = properties;
      return h(PlateFeature, {
        key: i,
        feature,
        className: feature.properties.type,
        plateId: plate_id,
        oldLim: 500,
        youngLim: 0,
      });
    })
  );
}
