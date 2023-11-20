export function getModelURL(): string {
    let modelURL = '/simple.zip';
    if (window.forBrowser === undefined) {
        console.warn('Your browser is offline');
    } else {
        modelURL = window.forBrowser.modelUrl;
    }

    return modelURL;
}