import WofDB from '@wge/objects-db';
import {
    CameraProjectionType,
    ColorFeature, EnvironmentFeature,
    HoverFeature,
    IndustrialViewer,
    IVPointerEvent,
    LoaderFeature,
    MoveCameraFeature,
    MoveCameraState,
    NavigationCubeFeature,
    ProgressiveRenderingFeature,
    OrbitFeature
} from '@wge/industrial-viewer';
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

interface ViewerState {
    modelLoaded: boolean;
}

export class Viewer extends Component<ViewerProps, ViewerState> implements ViewerAPI {
    public container = createRef<HTMLDivElement>();
    public iv!: IndustrialViewer;
    public db!: WofDB;

    private _glob2int = new Map<string, number>();
    private _int2glob = new Map<number, string>();
    private _envPromise!: Promise<void>;

    meshIds!: Set<number>;
    homePosition: MoveCameraState | null = null;

    state = {
        modelLoaded: false
    };

    toInternalID(id: string): number {
        return this._glob2int.get(id) ?? -1;
    }

    toGlobalID(id: number): string {
        return this._int2glob.get(id) ?? '';
    }

    updateSelection(): void {
        if (!this.meshIds) return;
        const { selectedId = -1 } = this.props;
        this.iv.getFeature(ColorFeature).color([
            {
                color: '#3A55F9',
                ids: this.meshIds.has(selectedId) ? [selectedId] : []
            }
        ]);
    }

    async moveCameraToSelection(): Promise<void> {
        if (!this.meshIds) return;
        const { selectedId = -1, allowMoveCamera } = this.props;
        if (this.meshIds.has(selectedId) && allowMoveCamera) {
            await this.iv.getFeature(MoveCameraFeature).toObjects([selectedId], { duration: 400 });
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

        iv.addFeature(LoaderFeature);
        iv.addFeature(OrbitFeature);
        iv.addFeature(NavigationCubeFeature, {
            xOffset: '32px',
            yOffset: '4px'
        });
        iv.addFeature(MoveCameraFeature);
        iv.addFeature(ProgressiveRenderingFeature);
        iv.addFeature(ColorFeature);
        iv.addFeature(HoverFeature);
        iv.addFeature(EnvironmentFeature);

        await iv.init();

        this.iv = iv;
        this.db = db;

        iv.addEventListener('click', (e: IVPointerEvent): void => {
            if (this.props.onClickObject) {
                this.props.onClickObject(e.id ?? -1);
            }
        });

        this._envPromise = (async () => {
            //NOTE: do not inline this constant. It is here to trick Vite not to transform new URL(...)
            //      without it, some combinations of development and production modes of backend & frontend don't work
            const url = '/parking.wenv';
            const environmentFeature = this.iv.getFeature(EnvironmentFeature);
            const parkingTextureId = environmentFeature.createTextureID('wenv', new URL(url, import.meta.url).toString());
            await environmentFeature.getTextureLoadedPromise(parkingTextureId);
            environmentFeature.setOptions({
                ibl: parkingTextureId
            });
        })();

        iv.setCameraEV100({
            aperture: 6.4,
            shutterSpeed: 0.008,
            ISO: 100,
            expComp: 0
        });
    }

    async load(zipURL: string): Promise<void> {
        const dataLoader = zipDataLoader(zipURL);
        const { response: wofBlob } = await dataLoader('objects.wof', 'blob');
        const wofBlobURL = URL.createObjectURL(wofBlob);

        this.iv.setDataLoader(dataLoader);

        const loaderFeature = this.iv.getFeature(LoaderFeature);

        await this._envPromise;
        await this.db.load(wofBlobURL);
        await this._buildIdMaps();
        URL.revokeObjectURL(wofBlobURL);
        const containerElement = this.container.current;
        if (containerElement === null) {
            console.warn('The Viewer component has been unmounted, but its code is still executing');
            return;
        }
        await loaderFeature.load('model.wmd');

        const moveCameraFeature = this.iv.getFeature(MoveCameraFeature);
        await moveCameraFeature.toObjects(null, {
            direction: {
                polar: Math.PI / 3,
                azimuthal: 2 * Math.PI / 3
            }
        });
        this.meshIds = new Set(this.iv.getObjects());
        this.updateSelection();

        this.homePosition = moveCameraFeature.getOptions();
        this.setState({
            modelLoaded: true
        });
    }

    private async _buildIdMaps(): Promise<void> {
        type DBResponse = { GlobalId: string; _id: number };
        const response = (await this.db.request(null, ['_id', 'GlobalId'])) as DBResponse[];
        for (const { GlobalId, _id: internalID } of response) {
            this._glob2int.set(GlobalId, internalID);
            this._int2glob.set(internalID, GlobalId);
        }
    }

    componentDidUpdate(): void {
        this.updateSelection();
    }

    render(): ReactNode {
        return (
            <>
                <div className={`flex items-center justify-center absolute inset-0 text-lg ${this.state.modelLoaded ? 'invisible' : ''}`}>Loading...</div>
                <div className={`w-full h-full ${this.state.modelLoaded ? '' : 'invisible'}`} ref={this.container}></div>
            </>
        );
    }
}
