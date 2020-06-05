import * as React from 'react';
import './App.scss';
import { Map, Marker, Polyline, TileLayer } from 'react-leaflet';
import { IManager, IWayPoint } from '../../manager/manager';
import Button from '../Button';
import { browseFile, readFileAsText } from '../../utils';
import GPXManager from '../../manager/gpx';
import * as Leaflet from 'leaflet';
import { LatLngTuple, Marker as LMarker } from 'leaflet';
import { List } from '../List';
import WaypointEditModal from '../WaypointEditModal';
import Checkbox from '../Checkbox';

type IAppProps = unknown;

interface IAppState {
    manager: IManager;
    editing?: IWayPoint;
    showRouteLine: boolean;
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

    private onMapClick = (event: Leaflet.LeafletMouseEvent) => {
        const { lat, lng } = event.latlng;
        this.setState(({ manager }) => ({
            manager: manager.add({
                lat,
                lng,
                title: 'New waypoint',
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

    private onShowLineChange = () => this.setState(({ showRouteLine }) => ({
        showRouteLine: !showRouteLine,
    }));

    render() {
        const { manager, showRouteLine } = this.state;

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
                    onclick={this.onMapClick}>
                    <TileLayer
                        attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
                        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {manager?.getItems().map(point => (
                        <Marker
                            key={point.id}
                            position={[point.lat, point.lng]}
                            draggable
                            ondragend={e => this.onDragPointEnd(e, point)} />
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
                    onSortUpdate={this.onSortUpdate} />
                <WaypointEditModal
                    onDone={this.onEditedDone}
                    onCancel={this.onEditCancel}
                    waypoint={this.state.editing} />
            </div>
        );
    }
}
