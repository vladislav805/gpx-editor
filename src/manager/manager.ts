import { IPoint } from './geo';

export interface IManager {
    add(point: IWayPoint): this;
    edit(point: IWayPoint): this;
    remove(point: IWayPoint): this;
    save(): void;
    getItems(): IWayPoint[];
    setTitle(title: string): this;
    getTitle(): string;
}

export interface IWayPoint extends IPoint {
    id?: number;
    title: string;
    description: string;
    color?: string;
}

export default abstract class Manager implements IManager {
    protected waypoints: IWayPoint[];

    private curId = 0;

    protected constructor() {
        this.waypoints = [];
    }

    public static empty(): IManager {
        return null;
    }

    public add(point: IWayPoint) {
        point.id = ++this.curId;

        if (!point.title) {
            point.title = `Waypoint #${point.id}`;
        }

        this.waypoints.push(point);
        return this;
    }

    public edit(point: IWayPoint) {
        const index = this.waypoints.indexOf(point);

        if (~index) {
            const listItem = this.waypoints[index];
            console.log(point, listItem, point === listItem);
        }

        return this;
    }

    public remove(point: IWayPoint) {
        const index = this.waypoints.indexOf(point);

        if (~index) {
            this.waypoints.splice(index, 1);
        }

        return this;
    }

    abstract save(): void;

    public getItems() {
        return this.waypoints;
    }

    // eslint-disable-next-line
    public setTitle(title: string) {
        return this;
    }

    public abstract getTitle(): string;
}
