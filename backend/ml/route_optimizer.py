import numpy as np
from sklearn.cluster import KMeans
from geopy.distance import geodesic

def nearest_neighbor_route(locations):
    if len(locations) == 0:
        return []
    unvisited = list(range(len(locations)))
    route = [unvisited.pop(0)]
    while unvisited:
        last = route[-1]
        nearest = min(
            unvisited,
            key=lambda x: geodesic(
                (locations[last]["lat"], locations[last]["lng"]),
                (locations[x]["lat"],   locations[x]["lng"])
            ).km
        )
        route.append(nearest)
        unvisited.remove(nearest)
    return route

def calculate_route_distance(locations, route):
    total = 0.0
    for i in range(len(route) - 1):
        a = locations[route[i]]
        b = locations[route[i + 1]]
        total += geodesic((a["lat"], a["lng"]), (b["lat"], b["lng"])).km
    return round(total, 2)

def optimize_routes(pickups, num_vehicles=3):
    if len(pickups) == 0:
        return []

    # Assign default coords if missing
    default_coords = [
        (11.0168, 76.9558), (11.0200, 76.9800), (11.0100, 76.9400),
        (11.0300, 76.9700), (11.0050, 76.9650), (11.0250, 76.9500),
        (11.0150, 76.9900), (11.0350, 76.9600), (11.0080, 76.9750),
        (11.0220, 76.9450), (11.0180, 76.9620), (11.0120, 76.9850),
    ]

    locations = []
    for i, p in enumerate(pickups):
        lat = p.get("latitude") or default_coords[i % len(default_coords)][0]
        lng = p.get("longitude") or default_coords[i % len(default_coords)][1]
        locations.append({
            "id": p["id"],
            "lat": lat,
            "lng": lng,
            "address": p["location"],
            "waste_type": p["waste_type"],
            "citizen_name": p.get("citizen_name", "Citizen")
        })

    # Use KMeans to cluster into zones
    n_clusters = min(num_vehicles, len(locations))
    coords = np.array([[loc["lat"], loc["lng"]] for loc in locations])
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    labels = kmeans.fit_predict(coords)

    # Build routes per vehicle
    routes = []
    colors = ["#16a34a", "#0891b2", "#d97706", "#7c3aed", "#e11d48"]

    for v in range(n_clusters):
        cluster_locs = [loc for loc, label in zip(locations, labels) if label == v]
        if not cluster_locs:
            continue
        order = nearest_neighbor_route(cluster_locs)
        ordered = [cluster_locs[i] for i in order]
        distance = calculate_route_distance(cluster_locs, order)
        routes.append({
            "vehicle_id": v + 1,
            "color": colors[v % len(colors)],
            "total_stops": len(ordered),
            "total_distance_km": distance,
            "stops": ordered
        })

    return routes