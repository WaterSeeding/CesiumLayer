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
  console.log("featuresPromise", featuresPromise);
  if (!Cesium.defined(featuresPromise)) {
  } else {
    Promise.resolve(featuresPromise).then((features) => {
      if (features.length > 0) {
        let { layerId, attributes, geometry, value } = features[0].data;
        if (layerId === 1 && attributes && geometry) {
          transferImageryLayerFeatures(attributes);
        }
      }
    });
  }
};

const transferImageryLayerFeatures = (attributes: any) => {
  console.warn("[发送信息...........]", attributes);
};

const gui = new dat.GUI({
  name: "Cesium GUI",
  width: 450,
  autoPlace: true,
  closed: false,
});
gui.domElement.id = "gui";
gui.show();

const scene = viewer.scene;

const provider_香蜜湖 = new Cesium.WebMapServiceImageryProvider({
  url: "http://127.0.0.1:8080/geoserver/wms",
  layers: "JYuan_xiangmihu_map:香蜜湖",
});
const imageryLayer_香蜜湖 = new Cesium.ImageryLayer(provider_香蜜湖);
viewer.imageryLayers.add(imageryLayer_香蜜湖);

const provider_测试图层 = new Cesium.WebMapServiceImageryProvider({
  url: "http://127.0.0.1:8080/geoserver/wms",
  layers: "gutouproject_map:0710gutouproject测试图层",
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
