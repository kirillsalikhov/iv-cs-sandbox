export function getModelURL(): string {
    let modelURL = '/simple.zip';
    if (window.forBrowser === undefined) {
        console.warn('Standalone mode. Using static data.');
    } else {
        modelURL = window.forBrowser.modelUrl;
    }

    return modelURL;
}