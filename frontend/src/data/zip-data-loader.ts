import { unzip, Unzipped } from 'fflate';
import type { DataLoader, DataLoaderResult, ProgressWatcher, ResponseTypeNames } from '@wge/core';

export const zipDataLoader = (zipFileURL: string): DataLoader => {
    let willLoadZip: Promise<Unzipped> | null = null;
    const loadZip = (progressWatcher?: ProgressWatcher): Promise<Unzipped> => {
        if (willLoadZip) {
            return willLoadZip;
        }
        const xhr = new XMLHttpRequest();
        xhr.open('GET', zipFileURL, true);
        xhr.responseType = 'arraybuffer';

        willLoadZip = new Promise<ArrayBuffer>((resolve, reject) => {
            xhr.onload = () => {
                if (xhr.status < 400) {
                    resolve(xhr.response as ArrayBuffer);
                } else {
                    reject(new Error(`ZipLoader failed to load ${zipFileURL}; status=${xhr.status}`));
                }
            };
            xhr.onerror = () => {
                reject(new Error('ZipLoader xhr.onerror was triggered'));
            };
        }).then((arraybuffer) => {
            return new Promise((resolve, reject) => {
                unzip(new Uint8Array(arraybuffer), (error, data: Unzipped) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
        });

        if (progressWatcher) {
            const childWatcher = progressWatcher.createChild({
                type: 'zip',
                name: zipFileURL,
                unit: 'byte'
            });

            xhr.onprogress = (e) => {
                childWatcher.change({
                    current: e.loaded,
                    total: e.total,
                    computable: e.lengthComputable
                });
            };
        }
        xhr.send(null);

        return willLoadZip;
    };

    return (async (url: string, responseType: ResponseTypeNames, progressWatcher?: ProgressWatcher, watcherId: string = responseType): Promise<DataLoaderResult> => {
        const unzipped = await loadZip(progressWatcher);

        const _url = url.replace(/^\//, '');

        if (!(_url in unzipped)) {
            throw new Error(`ZipLoader: no such entry ${url} inside "${zipFileURL}"`);
        }
        const data = unzipped[_url];
        if (progressWatcher) {
            const childWatcher = progressWatcher.createChild({
                type: watcherId,
                name: _url,
                unit: 'byte'
            });
            childWatcher.change({
                current: data.length,
                total: data.length,
                complete: true,
                computable: true
            });
        }
        if (responseType === 'text') {
            return {
                response: new TextDecoder().decode(data),
                mimeType: 'plain/text'
            };
        }
        if (responseType === 'json') {
            return {
                response: JSON.parse(new TextDecoder().decode(data)),
                mimeType: 'application/json'
            };
        }
        if (responseType === 'arraybuffer') {
            return {
                response: data.buffer,
                mimeType: 'application/octet-stream'
            };
        }
        if (responseType === 'blob') {
            return {
                response: new Blob([data]),
                mimeType: 'application/octet-stream'
            };
        }
        throw new Error(`unknown responseType ${responseType}`);
    }) as DataLoader;
};
