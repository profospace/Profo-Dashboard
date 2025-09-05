import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { base_url } from "../../../utils/base_url";
// Hardcoded for quick local UI test (user requested). Replace with env var in production.
const GOOGLE_API_KEY = "AIzaSyCAxLPWJ3If855zICuSdKNWCYrSDhPauVM";
const PROPERTIES_API = `${base_url}/api/web/properties/filter?purpose=Buy`;
// Assume ~3 meters per floor for extrusion
const METERS_PER_FLOOR = 3;
function loadGoogleMapsScript() {
  const src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&v=beta&libraries=maps3d`;
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("No window available"));
    if (window.google && window.google.maps) return resolve(window.google);
    const existing = Array.from(document.getElementsByTagName("script")).find(
      (s) => s.src && s.src.startsWith("https://maps.googleapis.com/maps/api/js")
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(window.google));
      existing.addEventListener("error", () => reject(new Error("Google Maps script failed to load")));
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error("Google Maps script failed to load"));
    document.head.appendChild(script);
  });
}
function extractLatLng(item) {
  if (!item) return null;
  if (typeof item.latitude === "number" && typeof item.longitude === "number") return { lat: item.latitude, lng: item.longitude };
  if (typeof item.lat === "number" && typeof item.lng === "number") return { lat: item.lat, lng: item.lng };
  if (item.location && Array.isArray(item.location.coordinates)) {
    const [lng, lat] = item.location.coordinates;
    return { lat: Number(lat), lng: Number(lng) };
  }
  return null;
}
function extractFloors(item) {
  if (!item) return null;
  if (item.totalFloors) return Number(item.totalFloors);
  if (item.floorNumber) return Number(item.floorNumber);
  if (item.floor) return Number(item.floor);
  return null;
}
export default function GoogleMaps3D() {
  const mapRef = useRef(null);
  const [count, setCount] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        await loadGoogleMapsScript();
        if (!mapRef.current || !window.google) return;
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 19.076, lng: 72.8777 },
          zoom: 13,
          mapId: "DEMO_MAP_ID",
        });
        const overlay = new window.google.maps.WebGLOverlayView();
        overlay.onAdd = () => {
          overlay.scene = new THREE.Scene();
          overlay.camera = new THREE.PerspectiveCamera();
          const light = new THREE.DirectionalLight(0xffffff, 0.8);
          light.position.set(0, 10, 50);
          overlay.scene.add(light);
          overlay.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
        };
        overlay.onContextRestored = ({ gl }) => {
          overlay.renderer = new THREE.WebGLRenderer({ canvas: gl.canvas, context: gl, ...gl.getContextAttributes() });
          overlay.renderer.autoClear = false;
        };
        overlay.onDraw = ({ gl, transformer }) => {
          overlay.renderer.resetState();
          overlay.renderer.render(overlay.scene, overlay.camera);
        };
        overlay.setMap(map);
        // Fetch properties and extrude
        const res = await fetch(PROPERTIES_API);
        let data = await res.json().catch(() => []);
        if (!Array.isArray(data)) {
          data = data?.data || [];
        }
        let added = 0;
        data.forEach((item) => {
          const coord = extractLatLng(item);
          if (!coord) return;
          // Use totalFloors -> floorNumber -> floor -> fallback random
          const floors = extractFloors(item) || Math.floor(Math.random() * 10 + 5);
          const height = floors * METERS_PER_FLOOR;
          const geometry = new THREE.BoxGeometry(20, 20, height);
          const material = new THREE.MeshLambertMaterial({ color: 0x1976d2, opacity: 0.7, transparent: true });
          const mesh = new THREE.Mesh(geometry, material);
          const { lat, lng } = coord;
          const matrix = new window.google.maps.LatLngAltitude(lat, lng, 0);
          const pos = transformer.fromLatLngAltitude(matrix);
          mesh.position.copy(pos);
          overlay.scene.add(mesh);
          added++;
        });
        if (mounted) {
          setCount(added);
          setLoading(false);
        }
      } catch (err) {
        console.error("Map init error", err);
        if (mounted) setError(err.message);
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <div style={{ position: "relative", width: "100%", minHeight: "70vh", height: "80vh" }}>
      <div ref={mapRef} style={{ width: "100%, height: 100%" }} />
      <div style={{ position: "absolute", top: 16, left: 16, background: "white", padding: 12, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
        <div style={{ fontWeight: 600 }}>3D Buildings Layer</div>
        {loading ? <div>Loading...</div> : <div>Loaded {count} buildings</div>}
        {error && <div style={{ color: "red" }}>Error: {error}</div>}
        <div style={{ fontSize: "0.85em", color: "#666" }}>Height = totalFloors × {METERS_PER_FLOOR}m</div>
      </div>
    </div>
  );
}