export function capitalizeWordInformally(word: string): string {
    return word.split(' ').map((val) => {
        const wordToUpperCase = val.split('')
        const capitalize = wordToUpperCase.map((val, index) => {
            if (index == 0) {
                return val.toUpperCase()
            }
            return val
        }).join('')
        return capitalize;
    }).join(' ')
    
}



export function capitalizeWord(word: string) {

    return word
        .split(" ")
        .map((segment) =>
            segment
                .split("-")
                .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
                .join(" ")
        )
        .join(" ");
}
