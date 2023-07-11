import * as Cesium from "cesium";

export const setRayCollision = (
  viewer: Cesium.Viewer,
  longitude: number,
  latitude: number,
  height?: number
) => {
  // 同时也可以将经度度转回为笛卡尔
  let ellipsoid = viewer.scene.globe.ellipsoid;
  // 定义84坐标为一个Cartesian值
  height = height ? height + 1 : 300;
  let wgs84_cartesian_0 = Cesium.Cartographic.fromDegrees(
    longitude,
    latitude,
    height
  );
  let wgs84_cartesian_1 = Cesium.Cartographic.fromDegrees(
    longitude,
    latitude,
    -1
  );
  // 将84坐标转换为笛卡尔
  let coordinatePoint_0 = ellipsoid.cartographicToCartesian(wgs84_cartesian_0);
  let coordinatePoint_1 = ellipsoid.cartographicToCartesian(wgs84_cartesian_1);

  let cartesian3_result = new Cesium.Cartesian3();
  let direction = Cesium.Cartesian3.normalize(
    Cesium.Cartesian3.subtract(
      coordinatePoint_1,
      coordinatePoint_0,
      cartesian3_result
    ),
    cartesian3_result
  );
  let pickRay = new Cesium.Ray(coordinatePoint_0, direction) as Cesium.Ray;
  let featuresPromise = viewer.imageryLayers.pickImageryLayerFeatures(
    pickRay,
    viewer.scene
  ) as Promise<Cesium.ImageryLayerFeatureInfo[]>;
  if (!Cesium.defined(featuresPromise)) {
  } else {
    Promise.resolve(featuresPromise).then((features: any) => {
      if (features.length > 0) {
        let properties = features[0].properties;
        console.log("properties", properties);
      }
    });
  }
};
