import * as React from 'react';
import './list.scss';
import { IWayPoint } from '../../manager/manager';
import WaypointItem from '../WaypointItem';
import {
    SortableContainer,
    SortableElement,
    SortableHandle,
} from 'react-sortable-hoc';
import { swapItems } from '../../utils';

type WaypointCallbacks = {
    onRemoveWaypoint: (point: IWayPoint) => void;
    onRequestEditWaypoint: (point: IWayPoint) => void;
};

interface IListProps extends WaypointCallbacks {
    items: IWayPoint[];
    onSortUpdate: (items: IWayPoint[]) => void;
}

interface IListState {

}

const DragHandle = SortableHandle(() => <div className="sortable-handle">::</div>);

const SortableItem = SortableElement(({ point, pr }: { point: IWayPoint, pr: WaypointCallbacks }) => (
    <li className="sortable-item">
        <DragHandle />
        <WaypointItem
            key={point.id}
            waypoint={point}
            onRequestEditWaypoint={pr.onRequestEditWaypoint}
            onRemoveWaypoint={pr.onRemoveWaypoint} />
    </li>
));

const SortableList = SortableContainer(({ items, pr }: { items: IWayPoint[], pr: WaypointCallbacks }) => {
    return (
        <ul className="sortable">
            {items.map((value, index) => (
                <SortableItem
                    key={`item-${value.id}`}
                    index={index}
                    pr={pr}
                    point={value} />
            ))}
        </ul>
    );
});

export class List extends React.Component<IListProps, IListState> {

    private onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) => {
        this.props.onSortUpdate(swapItems(this.props.items, oldIndex, newIndex));
    };

    render() {
        const { items, onRemoveWaypoint, onRequestEditWaypoint } = this.props;

        const pr: WaypointCallbacks = { onRemoveWaypoint, onRequestEditWaypoint };
        return (
            <div className="app-list">
                <SortableList
                    items={items}
                    onSortEnd={this.onSortEnd}
                    lockAxis="y"
                    useDragHandle
                    pr={pr} />
            </div>
        );
    }
}
