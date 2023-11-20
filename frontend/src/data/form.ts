import axios from 'axios';

const getKeyFromURL = (url: string): string => {
    return new URL(url).pathname.split('/')[2];
}

const getLoadingURL = async (): Promise<string> => {
    return (await axios.post('api/files/create-upload')).data as string;
}

export enum ConvertationType {
    Cad2WMDOpt = 'cad2wmdOpt',
    Cad2WMD = 'cad2wmd'
}

export async function sendConvertionRequest(file: File, type: ConvertationType): Promise<void> {
    const url = await getLoadingURL();
    await axios.put(url, file);

    const form = {
        fileKey: getKeyFromURL(url),
        fileName: file.name,
        conversionType: type
    };

    await axios.post('/api/documents/convert', form);
}
