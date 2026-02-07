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



export function formatDate(date:Date | string):string{
 return new Date(date).toLocaleDateString('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})
}

export function formatDateTime(date: Date | string): string {
    return new Date(date).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}


export function formatTimeToString(date:Date):string{
  return new Date(date).toLocaleTimeString([], {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

}



export function dataURLtoFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}




export function getAppropriateColor(val: string) {
  switch (val) {
    case 'moderate':
      return 'bg-[#FEF6E7] text-[#865503]';
    case 'easy':
      return 'bg-[#E7F6EC] text-[#099137]';
    case 'hard':
      return 'bg-[#FBEAE9] text-[#9E0A05]';
    default:
      return 'bg-grey text-black'
  }
}



