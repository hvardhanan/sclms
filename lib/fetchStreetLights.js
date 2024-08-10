export async function fetchStreetLights() {
  const res = await fetch('/api/streetlights');
  const data = await res.json();
  return data;
}
