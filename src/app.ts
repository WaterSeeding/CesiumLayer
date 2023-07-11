import "./app.css";
import * as Cesium from "cesium";
import * as dat from "dat.gui";
import { viewer } from "./main";

const setRayCollision = (
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

const gui = new dat.GUI({
  name: "Cesium GUI",
  width: 450,
  autoPlace: true,
  closed: false,
});
gui.domElement.id = "gui";
gui.show();

viewer.imageryLayers.addImageryProvider(
  new Cesium.ArcGisMapServerImageryProvider({
    url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
  })
);

const provider_香蜜湖 = new Cesium.WebMapServiceImageryProvider({
  url: "http://127.0.0.1:8080/geoserver/wms",
  layers: "	ShenZhen_xiangmihu:深圳福田0618",
  parameters: {
    name: "	ShenZhen_xiangmihu:深圳福田0618",
    service: "WMS",
    format: "image/png",
    transparent: true,
  },
});
const imageryLayer_香蜜湖 = new Cesium.ImageryLayer(provider_香蜜湖);
viewer.imageryLayers.add(imageryLayer_香蜜湖);

const provider_测试图层 = new Cesium.WebMapServiceImageryProvider({
  url: "http://127.0.0.1:8080/geoserver/wms",
  layers: "Fubaojiedao:福保街道图层数据",
  parameters: {
    name: "Fubaojiedao:福保街道图层数据",
    service: "WMS",
    format: "image/png",
    transparent: true,
  },
});
const imageryLayer_测试图层 = new Cesium.ImageryLayer(provider_测试图层);
viewer.imageryLayers.add(imageryLayer_测试图层);

let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction(function (event: any) {
  let earthPosition = viewer.camera.pickEllipsoid(
    event.position,
    viewer.scene.globe.ellipsoid
  );
  let cartographic = Cesium.Cartographic.fromCartesian(
    earthPosition,
    viewer.scene.globe.ellipsoid,
    new Cesium.Cartographic()
  );
  let lat = Cesium.Math.toDegrees(cartographic.latitude);
  let lng = Cesium.Math.toDegrees(cartographic.longitude);
  let height = cartographic.height;
  setRayCollision(viewer, lng, lat, height);
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
