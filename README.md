# Neogene modification of cordilleran western North America

A demo of the [Corelle](https://github.com/UW-Macrostrat/Corelle) plate-rotation
engine. See the [live demo](https://davenquinn.com/viz/corelle-demo-neogene-north-america/).

This demo highlights the flexibility of the Corelle system to represent regional tectonic
models in addition to [global datasets](https://davenquinn.com/viz/corelle-demo-pbdb/).

The most critical piece of this demo are rotations from the [Wilson et al., 2005](https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2003TC001621)
tectonic model, extracted to [GPlates](https://www.gplates.org/) format and loaded into Macrostrat's [Corelle dev server](https://birdnest.geology.wisc.edu/corelle).
The raw data, extraction scripts, and output (a GPlates-compatible [rotation file](https://github.com/davenquinn/corelle-demo-neogene-north-america/blob/master/rotation-model/output/Wilson_etal2005.rot) and [plate features](https://github.com/davenquinn/corelle-demo-neogene-north-america/blob/master/rotation-model/output/plate-features.geojson)) can be found in the [`rotation-model` subfolder here](rotation-model).
This extraction will be improved over time.

## Changelog

### September 2019

- Original data received from Doug Wilson
- Started process of extracting to GPlates format

### September 2020

- Built basic web frontend using newer Corelle tools
- Improved extraction of plate features

## Todo

- Enable animation
- Create plate polygons from fault features
- Replace coastline features with pre-split Natural Earth data.

Hopefully in the future this can be combined with models of intraplate
Basin and Range extension, but this may require new mathematical extensions
to the Corelle system. We will be interested in discussing the best way forward
for this with the [EarthByte](https://www.earthbyte.org/) group and others.
