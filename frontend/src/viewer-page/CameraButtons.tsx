import { MutableRefObject, useState } from 'react';
import { iconCameraOrthographic, iconCameraPerspective, iconHome } from './camera-svg-icons.ts';
import { Viewer } from './Viewer.tsx';
import { CameraProjectionType } from '@wge/industrial-viewer';

export interface CameraButtonsProps {
    viewerRef: MutableRefObject<Viewer>;
}

export function CameraButtons({viewerRef}: CameraButtonsProps) {
    const [projectionType, setProjectionType] = useState(viewerRef.current?.iv.getCameraProjection().type ?? CameraProjectionType.PERSPECTIVE);

    const projectionIcon = projectionType === CameraProjectionType.PERSPECTIVE
        ? iconCameraOrthographic
        : iconCameraPerspective;

    return (
        <>
            <button className={'absolute bottom-32 right-4 w-6 h-6 fill-gray-500'}
                    dangerouslySetInnerHTML={{__html: iconHome}}
                    title={'Move the camera to the initial position'}
                    onClick={() => viewerRef.current?.moveCameraToHomePosition()}></button>
            <button className={'absolute bottom-4 right-4 w-6 h-6 fill-gray-500'}
                    dangerouslySetInnerHTML={{__html: projectionIcon}}
                    title={projectionType === CameraProjectionType.PERSPECTIVE
                        ? 'Switch to orthographic projection'
                        : 'Switch to perspective projection'
                    }
                    onClick={() => setProjectionType(viewerRef.current?.toggleCameraProjection() ?? projectionType)}></button>
        </>
    );
}
