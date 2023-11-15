import WofDB from '@wg/objects-db';
import {
    CameraProjectionType,
    ColorFeature,
    HoverFeature,
    IndustrialViewer,
    IVPointerEvent,
    LoaderFeature,
    MoveCameraFeature,
    MoveCameraState,
    NavigationCubeFeature,
    OrbitFeature
} from '@wg/industrial-viewer';
import { zipDataLoader } from '../data/zip-data-loader.ts';
import { Component, createRef, ReactNode } from 'react';

export interface ViewerAPI {
    iv: IndustrialViewer;
    db: WofDB;
}

export interface ViewerProps {
    onClickObject?: (id: number) => void;
    selectedId?: number;
    allowMoveCamera: boolean;
}

export class Viewer extends Component<ViewerProps> implements ViewerAPI {
    public container = createRef<HTMLDivElement>();
    public iv!: IndustrialViewer;
    public db!: WofDB;

    meshIds!: Set<number>;
    homePosition: MoveCameraState | null = null;

    updateSelection(): void {
        if (!this.meshIds) return;
        const { selectedId = -1 } = this.props;
        this.iv.getFeature(ColorFeature).color([
            {
                color: '#ff0000',
                ids: this.meshIds.has(selectedId) ? [selectedId] : []
            }
        ]);
        this.moveCameraToSelection();
    }

    async moveCameraToSelection(): Promise<void> {
        if (!this.meshIds) return;
        let { selectedId = -1, allowMoveCamera } = this.props;
        if (this.meshIds.has(selectedId) && allowMoveCamera) {
            await this.iv.getFeature(MoveCameraFeature).toObjects([selectedId], 400);
        }
    }

    async moveCameraToHomePosition(duration: number = 400): Promise<void> {
        if (this.homePosition === null) {
            throw new Error(`no home position`);
        }
        await this.iv.getFeature(MoveCameraFeature).toPosition({
            position: this.homePosition.position,
            target: this.homePosition.target
        }, duration);
    }

    toggleCameraProjection(): CameraProjectionType {
        const oldProjectionType = this.iv.getCameraProjection().type;
        const newProjectionType = oldProjectionType === CameraProjectionType.ORTHOGRAPHIC
            ? CameraProjectionType.PERSPECTIVE
            : CameraProjectionType.ORTHOGRAPHIC;
        this.iv.setCameraProjection({ type: newProjectionType });

        return newProjectionType;
    }

    async componentDidMount(): Promise<void> {
        if (this.container.current === null) {
            throw new Error();
        }

        const db = new WofDB();
        const iv = new IndustrialViewer(this.container.current);
        iv.setCameraProjection({
            yfov: Math.PI / 180 * 24
        })

        iv.addFeature(LoaderFeature);
        iv.addFeature(OrbitFeature);
        iv.addFeature(NavigationCubeFeature, {
            xOffset: '32px',
            yOffset: '4px'
        });
        iv.addFeature(MoveCameraFeature);
        iv.addFeature(ColorFeature);
        iv.addFeature(HoverFeature);

        await iv.init();

        this.iv = iv;
        this.db = db;

        iv.addEventListener('click', (e: IVPointerEvent): void => {
            if (this.props.onClickObject) {
                this.props.onClickObject(e.id ?? -1);
            }
        });
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
        this.meshIds = new Set(this.iv.getObjects());
        this.updateSelection();

        this.homePosition = moveCamera.getOptions();
    }

    componentDidUpdate(): void {
        this.updateSelection();
    }

    render(): ReactNode {
        return (
            <div className='w-full h-full' ref={this.container}></div>
        );
    }
}