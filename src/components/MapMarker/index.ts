import * as L from 'leaflet';
import iconBlue from '../../images/marker-blue.svg';
import iconRed from '../../images/marker-red.svg';

export const markerBlue = () => new L.Icon({
    iconUrl: iconBlue,
    iconAnchor: [13, 40],
    popupAnchor: [0, -27],
    iconSize: [35, 40],
    tooltipAnchor: [13, -20],
});

export const markerRed = () => new L.Icon({
    iconUrl: iconRed,
    iconAnchor: [13, 40],
    popupAnchor: [0, -27],
    iconSize: [35, 40],
    tooltipAnchor: [13, -20],
});
