"use client";

import { useEffect, useRef } from "react";
import type { Map as MapType } from "ol";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/XYZ";
import { fromLonLat } from "ol/proj";

interface Props {
  lat: number;
  lng: number;
  zoom?: number;
  markers?: Array<{ lat: number; lng: number; label?: string }>;
}

export function OSMMap({ lat, lng, zoom = 12 }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapObj = useRef<MapType | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapObj.current) return;

    mapObj.current = new Map({
      target: mapRef.current,
      view: new View({
        center: fromLonLat([lng, lat]),
        zoom,
        maxZoom: 18,
        minZoom: 4
      }),
      layers: [
        new TileLayer({
          source: new OSM({
            url: `${process.env.NEXT_PUBLIC_MAP_TILE_URL}/tiles/{z}/{x}/{y}.png`,
            attributions:
              '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
          })
        })
      ]
    });

    return () => {
      mapObj.current?.setTarget(undefined);
      mapObj.current = null;
    };
  }, [lat, lng, zoom]);

  return <div ref={mapRef} className="h-72 w-full rounded-2xl border border-white/10" />;
}


