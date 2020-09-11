#!/usr/bin/env python
import sys

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

def get_platenames():
    """Get platenames dict"""
    with open("model/platenames") as f:
        k_v = (l.split() for l in f)
        return {k:v for k,v in k_v}

class PlateIDIndex:
    """An index mapping plate 2-letter code to integer ID"""
    _index = {}
    idx = 1
    def get(self, id):
        if id not in self._index:
            self._index[id] = self.idx
            self.idx += 1
        return self._index.get(id)

plate_id_index = PlateIDIndex()
plate_names = get_platenames()

with open("output/Wilson_etal2005.rot", "w") as f:
    for r in get_rotations():
        (plate_id, *rest) = r
        plateno = plate_id_index.get(plate_id)
        # This relies on 'NA' being the first plate
        relative_to = plate_id_index.get("NA")
        st = f"{plateno:03g}"
        for k in rest:
            st += f"  {k:10.3f}"
        st += f"    {relative_to:03g}"
        # Add comment about plate
        st += f"  ! {plate_id}"
        if plate_name := plate_names.get(plate_id, None):
            st += f" - {plate_name}"
        print(st, file=f)
