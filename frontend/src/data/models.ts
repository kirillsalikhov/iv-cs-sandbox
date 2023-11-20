export function getModelURL(): string {
    let modelURL = '/2022020220211122Wellness center Sama(ifc2wmdopt).ifc.ivasset';
    if (window.forBrowser === undefined) {
        console.warn('Your browser is offline');
    } else {
        modelURL = window.forBrowser.modelUrl;
    }

    return modelURL;
}