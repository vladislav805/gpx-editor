import * as React from 'react';
import { IWayPoint } from '../../manager/manager';
import WaypointItem from '../WaypointItem';

interface IListProps {
    items: IWayPoint[];
    onUpdateWaypoint: (point: IWayPoint) => void;
    onRemoveWaypoint: (point: IWayPoint) => void;
    onRequestEditWaypoint: (point: IWayPoint) => void;
}

interface IListState {

}

export class List extends React.Component<IListProps, IListState> {


    render() {
        const { items, onUpdateWaypoint, onRemoveWaypoint, onRequestEditWaypoint } = this.props;

        return (
            <div className="app-list">
                {items.map(point => (
                    <WaypointItem
                        key={point.id}
                        waypoint={point}
                        onRequestEditWaypoint={onRequestEditWaypoint}
                        onUpdateWaypoint={onUpdateWaypoint}
                        onRemoveWaypoint={onRemoveWaypoint} />
                ))}
            </div>
        );
    }
}
