export type TextNode = string | { type: 'link'; href: string; text: string };

export function formatTextWithLinks(text: string): TextNode[] {
    if (!text || typeof text !== 'string') return [];

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    const result: TextNode[] = [];

    parts.forEach((part) => {
        if (part) { // Ensure part is not empty
            if (part.startsWith('http://') || part.startsWith('https://')) {
                result.push({ type: 'link', href: part, text: part });
            } else {
                result.push(part);
            }
        }
    });

    return result;
}
