import { RefObject, useState } from 'react';
import { iconCameraOrthographic, iconCameraPerspective, iconHome } from './icons.ts';
import { Viewer } from './Viewer.tsx';
import { CameraProjectionType } from '@wge/industrial-viewer';
import { IconButton } from './IconButton.tsx';

export interface CameraButtonsProps {
    viewerRef: RefObject<Viewer>;
}

export function CameraButtons({viewerRef}: CameraButtonsProps) {
    const [projectionType, setProjectionType] = useState(viewerRef.current?.iv.getCameraProjection().type ?? CameraProjectionType.PERSPECTIVE);

    const projectionIcon = projectionType === CameraProjectionType.PERSPECTIVE
        ? iconCameraOrthographic
        : iconCameraPerspective;

    const projectionTitle = projectionType === CameraProjectionType.PERSPECTIVE
        ? 'Switch to orthographic projection'
        : 'Switch to perspective projection';

    return (
        <>
            <div className={'absolute bottom-32 right-4'}>
                <IconButton icon={iconHome}
                            title={'Move the camera to the initial position'}
                            onClick={() => viewerRef.current?.moveCameraToHomePosition()}/>
            </div>
            <div className={'absolute bottom-4 right-4'}>
                <IconButton icon={projectionIcon}
                            title={projectionTitle}
                            onClick={() => setProjectionType(viewerRef.current?.toggleCameraProjection() ?? projectionType)}/>
            </div>
        </>
    );
}
