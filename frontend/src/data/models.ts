export function getModelURL(): string {
    let modelURL = '/wellness-center.zip';
    if (window.forBrowser === undefined) {
        console.warn('Standalone mode. Using static data.');
    } else {
        modelURL = window.forBrowser.modelUrl;
    }

    return modelURL;
}