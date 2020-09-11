#!/usr/bin/env python

def get_rotations():
    """Get rotations from `pub05` file"""
    with open("model/fort.9.pub05") as f:
        for line in f:
            tokens = line.split()
            if len(tokens) != 5:
                continue
            (plate_id, time, lon, lat, angle) = (t.strip() for t in tokens)
            yield (
                plate_id,
                # Convert integer time to Ma
                int(time)*0.1,
                float(lon),
                float(lat),
                float(angle)
            )

plate_id_index = {}
idx = 1
for r in get_rotations():
    (plate_id, *rest) = r
    if plate_id not in plate_id_index:
        plate_id_index[plate_id] = idx
        idx += 1
    plateno = plate_id_index.get(plate_id)
    relative_to = plate_id_index.get("NA")
    st = f"{plateno:03g}"
    for k in rest:
        st += f"  {k:10.3f}"
    st += f"    {relative_to:03g}"
    print(st)
