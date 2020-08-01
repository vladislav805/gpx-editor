import Manager, { IManager } from './manager';
import { convert, create } from 'xmlbuilder2';
import { saveAs } from 'file-saver';

export default class GPXManager extends Manager implements IManager {

    private readonly root: IGPXRoot;

    private constructor(file: IGPXFile) {
        super();

        this.root = file.gpx;

        this.live();
    }

    public static empty() {
        return new GPXManager({
            gpx: {
                time: '',
                metadata: {
                    name: 'track',
                    desc: '',
                    author: [{
                        name: 'GPX editor by Vladislav Veluga',
                    }],
                },
                wpt: [],
            },
        });
    }

    private live() {
        this.root.wpt.forEach(point => this.add({
            lat: Number(point['@lat']),
            lng: Number(point['@lon']),
            title: point.name,
            description: point.desc,
        }));
    }

    public static open(xmlString: string): GPXManager {
        const xml = convert(xmlString, { format: 'object' }) as unknown as IGPXFile;

        if (!Array.isArray(xml.gpx.wpt)) {
            xml.gpx.wpt = [xml.gpx.wpt];
        }

        return new GPXManager(xml);
    }

    public save() {
        const doc = create({
            version: '1.0',
            encoding: 'utf-8',
        }, {
            gpx: {
                '@xmlns': 'http://www.topografix.com/GPX/1/1',
                '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                '@xsi:schemaLocation': 'http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd',
                time: new Date().toJSON(),
                metadata: this.root.metadata,
                wpt: this.waypoints.map(point => ({
                    '@lat': point.lat,
                    '@lon': point.lng,
                    name: point.title,
                    desc: point.description,
                    extensions: point.color ? {
                        color: point.color,
                    } : undefined,
                })),
            }
        });

        const xml = doc.end({ prettyPrint: false });
        const blob = new Blob([xml], { type: 'application/gpx+xml' });

        saveAs(blob, `${this.root.metadata.name}.gpx`);
    }

    public setTitle(title: string) {
        this.root.metadata.name = title;
        return this;
    }

    public getTitle(): string {
        return this.root.metadata.name;
    }

}

export interface IGPXFile {
    gpx: IGPXRoot;
}

export interface IGPXRoot {
    time: string;
    metadata: IGPXMeta;
    wpt: IGPXWayPoint[];
}

export interface IGPXMeta {
    name: string;
    desc: string;
    author: IGPXAuthor[];
}

export interface IGPXAuthor {
    name: string;
}

export interface IGPXWayPoint {
    '@lat': number;
    '@lon': number;
    time?: string;
    name: string;
    desc: string;
}
