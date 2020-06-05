import * as React from 'react';
import './waypoint-item.scss';
import { IWayPoint } from '../../manager/manager';
import Button from '../Button';

interface IWaypointItemProps {
    waypoint: IWayPoint;
    onRemoveWaypoint: (point: IWayPoint) => void;
    onRequestEditWaypoint: (point: IWayPoint) => void;
}

interface IWaypointItemState {

}

export default class WaypointItem extends React.Component<IWaypointItemProps, IWaypointItemState> {
    private onEdit = () => this.props.onRequestEditWaypoint(this.props.waypoint);

    private onRemove = () => this.props.onRemoveWaypoint(this.props.waypoint);

    render() {
        const { waypoint } = this.props;
        return (
            <div className="waypoint-item" key={waypoint.id}>
                <div className="waypoint-item--info">
                    <h3>{waypoint.title}</h3>
                    <p>{waypoint.description}</p>
                </div>
                <div className="waypoint-item--actions">
                    <Button label="Edit" onClick={this.onEdit} />
                    <Button label="Remove" onClick={this.onRemove} />
                </div>
            </div>
        );
    }
}
