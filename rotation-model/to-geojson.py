#!/usr/bin/env python3
import json
from itertools import groupby
from shapely.geometry import shape, mapping
from shapely.ops import unary_union


def parse_lnlt(f):
    """Parse a lnlt file into coordinate/type mapping"""
    feature_type = None
    plate_id = None
    features = []
    coords = []
    for line in f:
        line = line.strip()
        if line.startswith(">"):
            # We are working with a metadata value
            vals = line[2:]
            if vals.startswith("## "):
                feature_type = vals[3:]
            if len(vals) == 2:
                # New plate ID, switch to a new feature
                if len(coords) >= 1:
                    features.append(
                        {"plate_id": plate_id, "coords": coords, "type": feature_type}
                    )
                # Set new plate id
                plate_id = vals
                coords = []
            continue
        lon, lat = [float(l.strip()) for l in line.split()]
        coords.append([lon, lat])
    return features


def build_geojson(objs):
    plate_id_index = json.load(open("output/plate-id.json"))
    for i, f in enumerate(objs):
        pid = f["plate_id"]
        yield {
            "type": "Feature",
            "id": i,
            "properties": {
                "type": f["type"],
                "plate_name": pid,
                "plate_id": plate_id_index.get(pid, None),
            },
            "geometry": {"type": "LineString", "coordinates": f["coords"]},
        }


def keyfunc(k):
    return k["properties"]["plate_id"] or -1


def get_plate_polygons(plate_features):
    """Attempt to dissolve arbitrary plate features into polygons"""
    group_features = groupby(sorted(plate_features, key=keyfunc), key=keyfunc)
    for key, group in group_features:
        if key == -1:
            continue
        geom = [shape(feature["geometry"]) for feature in group]
        yield {
            "id": key,
            # A coarse polygonization of all the features...
            "geometry": mapping(unary_union(geom).convex_hull),
            "properties": {"id": key, "old_lim": 500},
        }


with open("model/listWMS2005.lnlt") as source:
    with open("output/plate-features.geojson", "w") as sink:
        features = list(build_geojson(parse_lnlt(source)))
        coll = dict(type="FeatureCollection", features=features)
        json.dump(coll, sink)

    # Write out (empty!) plate polygons...
    with open("output/plate-polygons.geojson", "w") as f:
        plate_features = list(get_plate_polygons(features))
        coll = dict(type="FeatureCollection", features=plate_features)
        json.dump(coll, f)
