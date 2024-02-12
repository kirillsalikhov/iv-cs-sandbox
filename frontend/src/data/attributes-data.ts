export interface AttributeData {
    originalName: string;
    [key: string]: unknown;
}

type AttributesMap = Map<string, AttributeData>;

const _attributes: AttributesMap = new Map();
async function getAttributesMap(url: string): Promise<AttributesMap> {
    if (_attributes.size || !url) {
        return _attributes;
    }

    const response = await fetch(url);
    if (!response.ok) { throw new Error(); }
    const attribArray = await response.json();

    for (const attr of attribArray) {
        _attributes.set(attr.id, attr);
    }

    return _attributes;
}

function getAttributesURL(): string {
    const { forBrowser } = window;
    if (forBrowser && forBrowser.attributesUrl) {
        return forBrowser.attributesUrl;
    }

    console.warn('Standalone mode. No attributes data');
    return '';
}

// Note: imitation of server request to get data for single attribute
export async function fetchAttributeData(id: string): Promise<AttributeData> {
    const url = getAttributesURL();
    const attributes = await getAttributesMap(url);
    const attribute = attributes.get(id);
    if (attribute === undefined) {
        throw new Error(`Can't get attribute data for id="${id}"`);
    }

    return attribute;
}