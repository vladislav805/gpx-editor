import * as React from 'react';
import './App.scss';
import { Map, Marker, Polyline, TileLayer } from 'react-leaflet';
import { IManager, IWayPoint } from '../../manager/manager';
import Button from '../Button';
import { browseFile, readFileAsText } from '../../utils';
import GPXManager from '../../manager/gpx';
import * as Leaflet from 'leaflet';
import { LatLngLiteral, LatLngTuple, Marker as LMarker } from 'leaflet';
import { List } from '../List';
import WaypointEditModal from '../WaypointEditModal';
import Checkbox from '../Checkbox';
import { markerBlue, markerRed } from '../MapMarker';
import * as L from 'leaflet';

type IAppProps = unknown;

interface IAppState {
    manager: IManager;
    editing?: IWayPoint;
    showRouteLine: boolean;
    hoverPointId?: number;
}

export default class App extends React.Component<IAppProps, IAppState> {
    state: IAppState;

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            manager: GPXManager.empty(),
            showRouteLine: false,
        };
    }

    private onClickOpen = () => {
        browseFile()
            .then(readFileAsText)
            .then(xmlString => GPXManager.open(xmlString))
            .then(manager => this.setState({ manager }));
    };

    private onClickSave = () => {
        this.state.manager.save();
    };

    private onMapClick = (pos: LatLngLiteral) => {
        const { lat, lng } = pos;
        this.setState(({ manager }) => ({
            manager: manager.add({
                lat,
                lng,
                title: undefined,
                description: undefined,
            }),
        }));
    };

    private onRequestEditWaypoint = (point: IWayPoint) => this.setState({ editing: point });

    private onUpdateWaypoint = (point: IWayPoint) => {
        this.setState(({ manager }) => ({ manager: manager.edit(point) }));
    };

    private onRemoveWaypoint = (point: IWayPoint) => {
        this.setState(({ manager }) => ({ manager: manager.remove(point) }));
    };

    private onDragPointEnd = (event: Leaflet.DragEndEvent, point: IWayPoint) => {
        const { lat, lng } = (event.target as LMarker<unknown>).getLatLng();
        point.lat = lat;
        point.lng = lng;
        this.setState(({ manager }) => ({ manager: manager.edit(point) }));
    };

    private onEditedDone = (point: IWayPoint) => {
        this.onUpdateWaypoint(point);
        this.onRequestEditWaypoint(null);
    };

    private onEditCancel = () => {
        this.onRequestEditWaypoint(null);
    };

    private onSortUpdate = () => {
        this.setState(({ manager }) => ({ manager }));
    };

    private onHighlightUpdate = (pointId: number) => this.setState({ hoverPointId: pointId });

    private onShowLineChange = () => this.setState(({ showRouteLine }) => ({
        showRouteLine: !showRouteLine,
    }));

    private lastMouseDown: L.LeafletMouseEvent;
    private onMouseDown = (e: L.LeafletMouseEvent) => {
        this.lastMouseDown = e;
    };

    private onMouseUp = (e: L.LeafletMouseEvent) => {
        const delta = this.lastMouseDown.originalEvent.timeStamp - e.originalEvent.timeStamp;

        if (delta < 100 && this.lastMouseDown.latlng.lat === e.latlng.lat && this.lastMouseDown.latlng.lng === e.latlng.lng) {
            this.onMapClick(this.lastMouseDown.latlng);
        }
    }

    render() {
        const { manager, showRouteLine, hoverPointId } = this.state;

        return (
            <div className="app">
                <div className="app-menu">
                    <Button
                        label="Open GPX"
                        onClick={this.onClickOpen} />
                    <Button
                        label="Save GPX"
                        onClick={this.onClickSave} />
                    <Checkbox
                        name="show_line"
                        label="Show route line"
                        onSetChecked={this.onShowLineChange} />
                </div>
                <Map
                    center={[60, 30.3]}
                    zoom={13}
                    className="app-map"
                    onmousedown={this.onMouseDown}
                    onmouseup={this.onMouseUp}>
                    <TileLayer
                        attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
                        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {manager?.getItems().map(point => (
                        <Marker
                            key={point.id}
                            position={[point.lat, point.lng]}
                            draggable
                            onclick={e => L.DomEvent.stopPropagation(e)}
                            ondragend={e => this.onDragPointEnd(e, point)}
                            icon={point.id === hoverPointId ? markerRed() : markerBlue()}
                            title={point.title} />
                    ))}
                    {showRouteLine && manager?.getItems().length > 0 && (
                        <Polyline
                            positions={manager?.getItems().map(({ lat, lng }) => [lat, lng] as LatLngTuple)} />
                    )}
                </Map>
                <List
                    items={manager?.getItems() ?? []}
                    onRequestEditWaypoint={this.onRequestEditWaypoint}
                    onRemoveWaypoint={this.onRemoveWaypoint}
                    onSortUpdate={this.onSortUpdate}
                    onHighlightUpdate={this.onHighlightUpdate} />
                <WaypointEditModal
                    onDone={this.onEditedDone}
                    onCancel={this.onEditCancel}
                    waypoint={this.state.editing} />
            </div>
        );
    }
}
