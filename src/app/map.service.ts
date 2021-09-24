import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as L from 'leaflet';

//theater marker icon
const cinemaiconUrl = 'assets/images/cinema-marker.png';
const iconUrl = 'assets/images/cinema-marker.png';
const shadowUrl = 'assets/images/marker-shadow.png';
const cinemaIcon = L.icon({
  cinemaiconUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

@Injectable({
  providedIn: 'root',
})
export class MapService {
  states_url = '/assets/data/states_india.geojson';
  markers_url = '/assets/data/india_markers.geojson';
  random_markers_url =
    'https://api.tomtom.com/search/2/categorySearch/cinema.json?key=<INSERT_API_KEY>&&radius=100000';
  constructor(private http: HttpClient) {}

  //marking states and union territories
  makeStateMarkers(map: L.map): void {
    this.http.get(this.markers_url).subscribe((res: any) => {
      for (const c of res.features) {
        const lon = c.geometry.coordinates[0];
        const lat = c.geometry.coordinates[1];
        const marker = L.marker([lat, lon]);
        marker.bindPopup(this.makeStatePopup(c.properties));
        marker.addTo(map);
      }
    });
  }

  //marking the nearest theaters
  individualStateMarkers(map: L.map, e): void {
    this.http
      .get(this.random_markers_url + '&lat=' + e.lat + '&lon=' + e.lng)
      .subscribe((res) => {
        let results = res['results'];
        let index = 0;
        for (let result of results) {
          index++;
          if (index > 4) {
            break;
          }
          const marker = L.marker(
            [result['position'].lat, result['position'].lon],
            { icon: cinemaIcon }
          );
          marker.bindPopup(
            this.randomPopup(
              result['poi'].name,
              result['address'].freeformAddress
            )
          );
          marker.addTo(map);
        }
      });
  }

  //coordinates for visualizing states
  getStateShapes() {
    return this.http.get(this.states_url);
  }

  //theater names
  randomPopup(i: String, a: String) {
    return `` + `<div> ${i}</div>` + `<div><b>Address</b> : ${a}</div>`;
  }

  //state and UT names
  makeStatePopup(data: any): string {
    if (data.State) {
      return `` + `<div><b>State :</b> ${data.State}</div>`;
    }
    return (
      `` + `<div><b>Union Territory :</b> ${data['Union Territory']}</div>`
    );
  }
}
