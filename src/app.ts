import "./app.css";
import * as Cesium from "cesium";
import * as dat from "dat.gui";
import { viewer } from "./main";
import Camera from "./Camera/index";
import { setRayCollision } from "./Layer/utils/setRayCollision";

const gui = new dat.GUI({
  name: "Cesium GUI",
  width: 450,
  autoPlace: true,
  closed: false,
});
gui.domElement.id = "gui";
gui.show();

const camera = new Camera(viewer, gui);

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
  }
});
const imageryLayer_香蜜湖 = new Cesium.ImageryLayer(provider_香蜜湖);
viewer.imageryLayers.add(imageryLayer_香蜜湖, 1);

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
