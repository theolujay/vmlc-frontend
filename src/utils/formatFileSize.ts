export function formatStorageSize(bytes: number=0, decimalPlaces: number = 2): string {
    if (bytes < 0) {
        throw new Error('Input must be a non-negative number');
    }
    
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = parseFloat((bytes / Math.pow(k, i)).toFixed(decimalPlaces));
    
    return `${value} ${sizes[i]}`;
}