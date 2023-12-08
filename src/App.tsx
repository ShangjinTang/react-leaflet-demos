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

  const getCurrentBbox = () => {
    const bounds = map.getBounds();
    const bbox = [
      bounds.getSouthWest().lng,
      bounds.getSouthWest().lat,
      bounds.getNorthEast().lng,
      bounds.getNorthEast().lat,
    ];
    return bbox;
  };

  useEffect(() => {
    if (show) {
      console.log(wmsParams);
      console.log("Current bbox:", getCurrentBbox());
      tileLayerRef.current = L.tileLayer.wms(url, wmsParams).addTo(map);
    } else {
      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
        tileLayerRef.current = null;
      }
    }

    return () => {
      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
        tileLayerRef.current = null;
      }
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
