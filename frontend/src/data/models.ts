export function getModelURL(): string {
    let modelURL = '/wellness-center.zip';
    if (window.forBrowser === undefined) {
        console.warn('Standalone mode. Using static data.');
    } else {
        modelURL = window.forBrowser.modelUrl;
    }

    return modelURL;
}

export function getViewerURL(): { model: string; attributes: string | null; } {
    let modelURL = '/wellness-center.zip';
    let attributesUrl: string | null = null;

    const { forBrowser } = window;
    if (forBrowser === undefined) {
        console.warn('Standalone mode. Using static data.');
    } else {
        attributesUrl = forBrowser.attributesUrl;
        modelURL = forBrowser.modelUrl;
    }

    return {
        model: modelURL,
        attributes: attributesUrl
    };
}