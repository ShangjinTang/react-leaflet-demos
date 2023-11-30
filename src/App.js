import React, {useEffect, useRef, useState} from 'react';
import {MapContainer, TileLayer, Polygon} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-geoserver-request/src/L.Geoserver';

function Map() {
    const mapRef = useRef(null);
    const [showDefaultLayer, setShowDefaultLayer] = useState(true);
    const [showCoastlineLayer, setShowCoastlineLayer] = useState(false);

    useEffect(() => {
        let map = null;
        map = mapRef.current;
        if (!map) {
            return;
        }

        const coastlineLayer = L.Geoserver.wms('http://localhost:8080/geoserver/wms', {
            layers: 'osm:osm_coastlines',
        });

        if (showCoastlineLayer) {
            console.log("add coastline layer to map")
            coastlineLayer.addTo(map);
        } else {
            console.log("remove coastline layer from map")
            coastlineLayer.removeFrom(map);
        }

        if (showCoastlineLayer) {
            console.log("add coastline layer to map")
            coastlineLayer.addTo(map);
        } else {
            console.log("remove coastline layer from map")
            coastlineLayer.removeFrom(map);
        }


        return () => {
            coastlineLayer.removeFrom(map); // 清除 CoastlineLayer
        };
    }, [showCoastlineLayer]);

    const toggleDefaultLayer = () => {
        setShowDefaultLayer((prevShowDefaultLayer) => !prevShowDefaultLayer);
    };

    const toggleCoastlineLayer = () => {
        setShowCoastlineLayer((prevShowCoastlineLayer) => !prevShowCoastlineLayer);
    };

    return (
        <div>
            <label>
                <input type="checkbox" checked={showDefaultLayer} onChange={toggleDefaultLayer}/>
                Default Layer
            </label>
            <br/>
            <label>
                <input type="checkbox" checked={showCoastlineLayer} onChange={toggleCoastlineLayer}/>
                Coastline Layer
            </label>
            <MapContainer id="map" className="map-container" ref={mapRef}
                          center={[30.5047, 122.2981]} zoom={11}>
                {showDefaultLayer && <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>}
            </MapContainer>
        </div>
    );
}

function App() {
    return (
        <div className="App">
            <h1>Map with Leaflet</h1>
            <Map/>
        </div>
    );
}

export default App;