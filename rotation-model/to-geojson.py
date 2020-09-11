#!/usr/bin/env python3
import re
import json

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
                    features.append({
                        "plate_id": plate_id,
                        "coords": coords,
                        "type": feature_type
                    })
                # Set new plate id
                plate_id = vals
                coords = []
            continue
        lon,lat = [float(l.strip()) for l in line.split()]
        coords.append([lon,lat])
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
                "plate_id": plate_id_index.get(pid,None)
            },
            "geometry": {
                "type": "LineString",
                "coordinates": f["coords"]
            }
        }

with open("model/listWMS2005.lnlt") as source:
    with open("output/plate-features.geojson", "w") as sink:
        features = build_geojson(parse_lnlt(source))
        coll = dict(type="FeatureCollection", features=list(features))
        json.dump(coll, sink)
