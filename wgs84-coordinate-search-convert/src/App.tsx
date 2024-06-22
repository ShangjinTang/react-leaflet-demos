import "leaflet/dist/leaflet.css";
import React, { useState } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import { Button, Input } from "antd";
import L from "leaflet";
import { wgs84tobd09, wgs84togcj02 } from "./components/CoordinateConvert";
import icon from "leaflet/dist/images/marker-icon.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
});
L.Marker.prototype.options.icon = DefaultIcon;

interface LocationData {
  coordinates: [number, number];
}

function convertWgs84ToBd09(coordinates: [number, number]): [number, number] {
  const [lat, lng] = coordinates;
  const [convertedLng, convertedLat] = wgs84tobd09(lng, lat);
  return [convertedLng, convertedLat];
}

function convertWgs84ToGcj02(coordinates: [number, number]): [number, number] {
  const [lat, lng] = coordinates;
  const [convertedLng, convertedLat] = wgs84togcj02(lng, lat);
  return [convertedLng, convertedLat];
}

interface AppProps {
  center?: [number, number];
}

const App: React.FC<AppProps> = ({ center }) => {
  const defaultCenter: [number, number] = [31.2304, 121.4737];

  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  );
  const [longitude, setLongitude] = useState<string>("");
  const [latitude, setLatitude] = useState<string>("");

  const handleLocationChange = () => {
    if (latitude && longitude) {
      const locationData: LocationData = {
        coordinates: [parseFloat(latitude), parseFloat(longitude)],
      };
      setSelectedLocation(locationData);
    }
  };

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLongitude(e.target.value);
  };

  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLatitude(e.target.value);
  };

  const ChangeView: React.FC<{ center: [number, number] }> = ({ center }) => {
    const map = useMap();
    map.setView(center, 13, { animate: true });
    return null;
  };

  return (
    <div className="app-container">
      <h1>WGS84 坐标查询系统</h1>
      <div>
        纬度：
        <Input
          placeholder="-90 ~ 90"
          value={latitude}
          onChange={handleLatitudeChange}
          style={{ width: "200px", marginRight: "10px" }}
        />
        经度：
        <Input
          placeholder="-180 ~ 180"
          value={longitude}
          onChange={handleLongitudeChange}
          style={{ width: "200px", marginRight: "10px" }}
        />
        <Button type="primary" onClick={handleLocationChange}>
          搜索
        </Button>
      </div>
      <br />
      <MapContainer center={defaultCenter} zoom={14} style={{ height: "80vh" }}>
        <ChangeView
          center={
            selectedLocation ? selectedLocation.coordinates : defaultCenter
          }
        />
        <TileLayer
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {selectedLocation && (
          <Marker position={selectedLocation.coordinates}>
            <Popup>
              <div>
                <p>
                  全球坐标 (WGS-84 坐标系)：
                  <br />
                  {selectedLocation.coordinates[0]},
                  {selectedLocation.coordinates[1]}
                </p>
                <p>
                  <a
                    href="https://api.map.baidu.com/lbsapi/getpoint/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    百度坐标 (BD-09 坐标系)
                  </a>
                  <br />
                  {convertWgs84ToBd09(selectedLocation.coordinates)[0]},
                  {convertWgs84ToBd09(selectedLocation.coordinates)[1]}
                </p>
                <p>
                  <a
                    href="https://lbs.amap.com/tools/picker"
                    target="_blank"
                    rel="noreferrer"
                  >
                    高德坐标 (GCJ-02 坐标系)
                  </a>
                  <br />
                  {convertWgs84ToGcj02(selectedLocation.coordinates)[0]},
                  {convertWgs84ToGcj02(selectedLocation.coordinates)[1]}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default App;
