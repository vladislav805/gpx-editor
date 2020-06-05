import * as React from 'react';
import './waypoint-item.scss';
import { IWayPoint } from '../../manager/manager';
import Button from '../Button';

interface IWaypointItemProps {
    waypoint: IWayPoint;
    onRemoveWaypoint: (point: IWayPoint) => void;
    onRequestEditWaypoint: (point: IWayPoint) => void;
    onHighlightUpdate: (pointId: number) => void;
}

interface IWaypointItemState {

}

export default class WaypointItem extends React.Component<IWaypointItemProps, IWaypointItemState> {
    private onEdit = () => this.props.onRequestEditWaypoint(this.props.waypoint);

    private onRemove = () => this.props.onRemoveWaypoint(this.props.waypoint);

    private onMouseEnter = () => this.props.onHighlightUpdate(this.props.waypoint.id);

    private onMouseLeave = () => this.props.onHighlightUpdate(0);

    render() {
        const { waypoint } = this.props;
        return (
            <div className="waypoint-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                {this.props.children}
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
