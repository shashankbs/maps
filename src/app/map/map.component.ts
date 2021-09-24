import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from '../map.service';

//creating icon to display states
const iconRetinaUrl = 'assets/images/marker-icon-2x.png';
const iconUrl = 'assets/images/marker-icon.png';
const shadowUrl = 'assets/images/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [12, 20],
  iconAnchor: [6, 20],
  popupAnchor: [0.5, -17],
  tooltipAnchor: [8, -14],
  shadowSize: [20, 20],
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  private map; //storing the map object
  private states; //storing states coordinates to create layers

  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    this.initMap();
    this.mapService.makeStateMarkers(this.map);
    this.map.on('click', (e) => {
      this.map.setView(e.latlng, 7);
      this.mapService.individualStateMarkers(this.map, e.latlng);
    });
    this.mapService.getStateShapes().subscribe((states) => {
      this.states = states;
      this.initStatesLayer();
    });
  }

  //representing each states by boundary
  private initStatesLayer() {
    const stateLayer = L.geoJSON(this.states, {
      style: (feature) => ({
        weight: 3,
        opacity: 0.5,
        color: '#008f68',
        fillOpacity: 0.8,
        fillColor: '#6DB65B',
      }),
    });
    this.map.addLayer(stateLayer);
  }

  //creating the initial map
  private initMap(): void {
    this.map = L.map('map', {
      center: [21, 78],
      zoom: 4,
    });
    const tiles = L.tileLayer(
      'https://tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tiles.addTo(this.map);
  }
}
