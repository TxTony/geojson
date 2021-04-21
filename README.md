# geojson
geoJson helper class respecting the standard RFC 7946.

### Exemples

#### add points in feature collection
```js
let gj = new GeoJson("FeatureCollection");
gj.add([
  gj.feature(gj.point([175.2, 145]), {}),
  gj.feature(gj.point([180.2, 145]), {}),
  gj.feature(gj.point([200.2, 145]), {})
]);
```
#### add geometries in geoMetryCollection
```js
let gj = new GeoJson("geoMetryCollection");
let polygon = gj.polygone([
  [
    [100.0, 0.0],
    [101.0, 0.0],
    [101.0, 1.0],
    [100.0, 1.0],
    [100.0, 0.0]
   ]
 ]);
 
gj.add([
  gj.point([175.2, 145]),
  gj.point([180.2, 145]),
  polygon
]);
```
#### use a single element
```js
let gj = new GeoJson();
gj.add([
  gj.point([175.2, 145])
]);
```
