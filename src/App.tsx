import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";

interface WMSTileLayerProps {
  url: string;
  wmsParams: Record<string, string>;
  show: boolean;
}

function WMSTileLayer({ url, wmsParams, show }: WMSTileLayerProps) {
  const tileLayerRef = useRef<L.TileLayer.WMS | null>(null);
  const map = useMap();

  useEffect(() => {
    const updateBbox = () => {
      const bounds = map.getBounds();
      const bbox = [
        bounds.getSouthWest().lng,
        bounds.getSouthWest().lat,
        bounds.getNorthEast().lng,
        bounds.getNorthEast().lat,
      ];
      console.log("Current bbox:", bbox);

      const wmsUrl = `${url}?service=WMS&version=1.1.0&request=GetMap&layers=${
        wmsParams.layers
      }&bbox=${bbox.join(
        ","
      )}&width=768&height=636&srs=EPSG:4326&styles=&format=application/openlayers`;
      console.log("WMS URL:", wmsUrl);
    };

    const handleMoveEnd = () => {
      updateBbox();
    };

    updateBbox();
    if (show) {
      console.log(wmsParams);
      tileLayerRef.current = L.tileLayer.wms(url, wmsParams).addTo(map);
      map.on("moveend", handleMoveEnd); // 添加 moveend 事件监听
    } else {
      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
        tileLayerRef.current = null;
      }
      map.off("moveend", handleMoveEnd); // 移除 moveend 事件监听
    }

    return () => {
      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
        tileLayerRef.current = null;
      }
      map.off("moveend", handleMoveEnd); // 在组件卸载时移除 moveend 事件监听
    };
  }, [url, wmsParams, show, map]);

  return null;
}

interface GeoServerMapProps {
  wmsUrl: string;
  wmsLayers: string;
}

function GeoServerMap({ wmsUrl, wmsLayers }: GeoServerMapProps) {
  const wmsParams: Record<string, string> = {
    layers: wmsLayers,
    format: "image/png",
    transparent: "true",
  };
  const [showWMSLayer, setShowWMSLayer] = useState(false);

  const toggleWMSLayer = () => {
    setShowWMSLayer(!showWMSLayer);
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <MapContainer
        center={[30.0447, 122.2981]}
        zoom={11}
        style={{ height: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <WMSTileLayer url={wmsUrl} wmsParams={wmsParams} show={showWMSLayer} />
      </MapContainer>
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          backgroundColor: "white",
          padding: "10px",
        }}
      >
        <label>
          Show Coastline
          <input
            type="checkbox"
            checked={showWMSLayer}
            onChange={toggleWMSLayer}
          />
        </label>
      </div>
    </div>
  );
}

function App() {
  return (
    <GeoServerMap
      wmsUrl="http://localhost:8080/geoserver/wms"
      wmsLayers="osm:osm_coastlines"
    />
  );
}

export default App;
