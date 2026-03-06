// City grid paths for visualization - simulating road networks
export interface CityPath {
  coords: [number, number][];
  color: string;
}

export interface CityData {
  name: string;
  lat: number;
  lng: number;
  paths: CityPath[];
}

// Generate grid-like paths around a city center
function generateCityGrid(
  centerLat: number,
  centerLng: number,
  color: string = "rgba(6, 182, 212, 0.6)"
): CityPath[] {
  const paths: CityPath[] = [];
  const gridSize = 0.8;
  const steps = 5;

  // Horizontal lines
  for (let i = -steps; i <= steps; i++) {
    const lat = centerLat + (i * gridSize) / steps;
    paths.push({
      coords: [
        [lat, centerLng - gridSize],
        [lat, centerLng + gridSize],
      ],
      color: i === 0 ? color.replace("0.6", "0.9") : color,
    });
  }

  // Vertical lines
  for (let i = -steps; i <= steps; i++) {
    const lng = centerLng + (i * gridSize) / steps;
    paths.push({
      coords: [
        [centerLat - gridSize, lng],
        [centerLat + gridSize, lng],
      ],
      color: i === 0 ? color.replace("0.6", "0.9") : color,
    });
  }

  // Diagonal accent lines
  paths.push({
    coords: [
      [centerLat - gridSize * 0.7, centerLng - gridSize * 0.7],
      [centerLat + gridSize * 0.7, centerLng + gridSize * 0.7],
    ],
    color: "rgba(251, 191, 36, 0.4)",
  });

  paths.push({
    coords: [
      [centerLat + gridSize * 0.7, centerLng - gridSize * 0.7],
      [centerLat - gridSize * 0.7, centerLng + gridSize * 0.7],
    ],
    color: "rgba(251, 191, 36, 0.4)",
  });

  return paths;
}

// Major cities with conflict/economic significance
export const cities: CityData[] = [
  {
    name: "Washington DC",
    lat: 38.9072,
    lng: -77.0369,
    paths: generateCityGrid(38.9072, -77.0369, "rgba(6, 182, 212, 0.5)"),
  },
  {
    name: "Kyiv",
    lat: 50.4501,
    lng: 30.5234,
    paths: generateCityGrid(50.4501, 30.5234, "rgba(248, 113, 113, 0.5)"),
  },
  {
    name: "Moscow",
    lat: 55.7558,
    lng: 37.6173,
    paths: generateCityGrid(55.7558, 37.6173, "rgba(248, 113, 113, 0.4)"),
  },
  {
    name: "Tehran",
    lat: 35.6892,
    lng: 51.389,
    paths: generateCityGrid(35.6892, 51.389, "rgba(251, 191, 36, 0.5)"),
  },
  {
    name: "Taipei",
    lat: 25.033,
    lng: 121.5654,
    paths: generateCityGrid(25.033, 121.5654, "rgba(6, 182, 212, 0.5)"),
  },
  {
    name: "Beijing",
    lat: 39.9042,
    lng: 116.4074,
    paths: generateCityGrid(39.9042, 116.4074, "rgba(168, 85, 247, 0.4)"),
  },
  {
    name: "Riyadh",
    lat: 24.7136,
    lng: 46.6753,
    paths: generateCityGrid(24.7136, 46.6753, "rgba(251, 191, 36, 0.5)"),
  },
  {
    name: "London",
    lat: 51.5074,
    lng: -0.1278,
    paths: generateCityGrid(51.5074, -0.1278, "rgba(6, 182, 212, 0.4)"),
  },
  {
    name: "Houston",
    lat: 29.7604,
    lng: -95.3698,
    paths: generateCityGrid(29.7604, -95.3698, "rgba(6, 182, 212, 0.4)"),
  },
  {
    name: "San Francisco",
    lat: 37.7749,
    lng: -122.4194,
    paths: generateCityGrid(37.7749, -122.4194, "rgba(6, 182, 212, 0.5)"),
  },
];

// Flatten all paths for globe.gl
export function getAllCityPaths() {
  const allPaths: Array<{
    coords: [number, number][];
    color: string;
    city: string;
  }> = [];

  cities.forEach((city) => {
    city.paths.forEach((path) => {
      allPaths.push({
        ...path,
        city: city.name,
      });
    });
  });

  return allPaths;
}
