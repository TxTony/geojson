export default class GeoJson {
  /**
   * @constructor
   * @param {string} type geoJson element.type
   */
  constructor(type = "FeatureCollection") {
    switch (type) {
      case "FeatureCollection":
        this.geoJson = this.useFeatureCollection();
        break;
      case "GeometryCollection":
        this.geoJson = this.useGeometryCollectionType();
        break;
      default:
        this.geoJson = this.useDefaultType(type);
        break;
    }
    return this;
  }
  /**
   * @return {object} geoJson
   */
  useFeatureCollection() {
    return {
      type: "FeatureCollection",
      features: []
    };
  }
  /**
   *
   * @param {string} type
   * @return {object} geoJson
   */
  useDefaultType(type) {
    return {
      type: type,
      coordinates: []
    };
  }
  /**
   *
   * @param {string} type
   * @return {object} geoJson
   */
  useGeometryCollectionType() {
    return {
      type: "GeometryCollection",
      geometries: []
    };
  }
  /**
   * Add elements in geoJson object, if its a feature it will be added
   * to featureCollection.features, elements for geometryCollection will be added to
   * geometryCollection.geometries, else it will be a single element added to geoJson
   * so it take only the first element of the array.
   *
   * @param {array} elements
   * @return {object} geoJson
   */
  add(elements) {
    if (this.isAFeatureCollection(this.geoJson)) {
      elements.forEach((element) => {
        this.addFeature(element.geometry, element.properties);
      });
    } else if (this.isAGeometryCollection(this.geoJson)) {
      this.geoJson.geometries = elements;
    } else {
      this.geoJson = elements[0];
    }
    return this.geoJson;
  }
  /**
   *
   * @param {array} geometry
   * @param {object} properties
   * @return {GeoJson} this
   */
  addFeature(geometry, properties = {}) {
    this.throwErrorIfNotFeatureCollection(this.geoJson);
    this.throwErrorIfisIllegalType(geometry.type);
    this.throwErrorIfNoTypeGiven(geometry);
    this.geoJson.features.push({
      type: "Feature",
      id: this.randomId(),
      properties: properties,
      geometry: geometry
    });
    return this;
  }
  /**
   *
   * @param {integer} id
   * @return {GeoJson} this
   */
  removeFeature(id) {
    this.throwErrorIfNotFeatureCollection(this.geoJson);
    let feature = this.geoJson.features.filter(
      (foundFeature) => foundFeature.id === id
    );
    if (feature) {
      this.geoJson.features.splice(this.geoJson.features.indexOf(feature), 1);
    }
    return this;
  }
  /**
   *
   * @param {integer} id
   * @param {object} feature
   * @return {GeoJson} this
   */
  updateFeature(id, feature) {
    this.throwErrorIfNotFeatureCollection(this.geoJson);
    this.throwErrorIfisIllegalType(feature.geometry.type);
    this.throwErrorIfNoTypeGiven(feature.geometry);
    this.geoJson.features.forEach((element, i) => {
      if (element.id === id) {
        this.geoJson.features[i] = feature;
      }
    });
    return this;
  }
  /**
   *
   * @param {object} element any vali geoJson type, point,multiline,line etc...
   * @param {object} properties
   * @return {object} geoJson
   */
  feature(element, properties) {
    return {
      type: "Feature",
      properties: properties,
      geometry: element
    };
  }
  /**
   *
   * @param {array} coordinates [100.0, 0.0]
   * @return {object} geoJson
   */
  point(coordinates) {
    return {
      type: "Point",
      coordinates: coordinates
    };
  }
  /**
   *
   * @param {array} coordinates [[100.0, 0.0],[101.0, 1.0]]
   * @return {object}
   */
  multiPoint(coordinates) {
    return {
      type: "MultiPoint",
      coordinates: coordinates
    };
  }
  /**
   *
   * @param {array} coordinates [
          [
            [100.0, 0.0],
            [101.0, 0.0],
            [101.0, 1.0],
            [100.0, 1.0],
            [100.0, 0.0]
           ]
         ]
   * @return {object}
   */
  polygone(coordinates) {
    return {
      type: "Polygon",
      coordinates: coordinates
    };
  }

  /**
   * @return {string}
   */
  getType() {
    return this.geoJson.type;
  }
  /**
   * @param {array} from coordinates lat lon
   * @param {array} to coordinates lat lon
   * @return {float}
   */
  getDistanceInPixels(from, to) {
    return Math.hypot(to[0] - from[0], to[1] - from[1]);
  }

  /**
   * @return {integer}
   */
  randomId() {
    return Math.floor(Math.random() * Date.now());
  }
  /**
   * @param {object} geoJson
   * @throw {Error}
   */
  throwErrorIfNotFeatureCollection(geoJson) {
    if (!this.isAFeatureCollection(geoJson)) {
      throw new Error("expect a FeatureCollection " + geoJson.type + " given");
    }
  }
  /**
   * @param {object} geoJson
   * @return {boolean}
   */
  isAFeatureCollection(geoJson) {
    return geoJson.type === "FeatureCollection" ? true : false;
  }
  /**
   * @param {object} geoJson
   * @return {boolean}
   */
  isAGeometryCollection(geoJson) {
    return geoJson.type === "GeometryCollection" ? true : false;
  }
  /**
   * @param {string} type
   * @throw {Error} if illegal geometry.type is given
   */
  throwErrorIfisIllegalType(type) {
    let authorizedType = [
      "Feature",
      "GeometryCollection",
      "LineString",
      "MultiLineString",
      "MultiPoint",
      "MultiPolygon",
      "Point",
      "Polygon"
    ];
    if (!authorizedType.includes(type)) {
      throw new Error("Illegal geometry.type given");
    }
  }
  /**
   * @param {object} geometry geoJson geometry
   * @throw {Error} if no type is given in geometry
   */
  throwErrorIfNoTypeGiven(geometry) {
    if (!geometry.hasOwnProperty("type")) {
      throw new Error("geometry.type is required");
    }
  }
}
