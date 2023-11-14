import WofDB from '@wg/objects-db';
import { IndustrialViewer, LoaderFeature, MoveCameraFeature, NavigationCubeFeature, OrbitFeature } from '@wg/industrial-viewer';
import { zipDataLoader } from '../zip-data-loader';
import { Component, createRef, ReactNode } from 'react';

export interface ViewerAPI {
    iv: IndustrialViewer;
    db: WofDB;
}

export class Viewer extends Component implements ViewerAPI {
    public container = createRef<HTMLDivElement>();
    public iv!: IndustrialViewer;
    public db!: WofDB;

    async componentDidMount(): Promise<void> {
        if (this.container.current === null) {
            throw new Error();
        }

        const db = new WofDB();
        const iv = new IndustrialViewer(this.container.current);

        iv.addFeature(LoaderFeature);
        iv.addFeature(OrbitFeature);
        iv.addFeature(NavigationCubeFeature);
        iv.addFeature(MoveCameraFeature);

        await iv.init();

        this.iv = iv;
        this.db = db;
    }

    async load(zipURL: string): Promise<void> {
        const dataLoader = zipDataLoader(new URL(zipURL, import.meta.url).toString());
        const { response: wofBlob } = await dataLoader('objects.wof', 'blob');
        const wofBlobURL = URL.createObjectURL(wofBlob);

        this.iv.setDataLoader(dataLoader);

        const loader = this.iv.getFeature(LoaderFeature);

        await this.db.load(wofBlobURL);
        await loader.load('model.wmd');

        const defaultCameraPosition = { position: { x: 1064, y: 487, z: -647 }, target: { x: 443, y: 0, z: -43 } };
        const moveCamera = this.iv.getFeature(MoveCameraFeature);
        await moveCamera.toPosition(defaultCameraPosition);
        await moveCamera.toObjects(null);
    }

    render(): ReactNode {
        return (
            <div className='w-full h-full' ref={this.container}></div>
        );
    }
}