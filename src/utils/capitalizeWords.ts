// export function capitalizeWord(word: string) {
//     const splitWord = word.split(' ').map((val, index) => {
//         const wordToUpperCase = val.split('')
//         const capitalize = wordToUpperCase.map((val, index) => {
//             if (index == 0) {
//                 return val.toUpperCase()
//             }
//             return val
//         }).join('')
//         return capitalize;
//     })
//     return splitWord.join(' ')
// }



export function capitalizeWord(word: string) {

    return word
        .split(" ")
        .map((segment) =>
            segment
                .split("-")
                .map(
                    (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
                )
                .join(" ")
        )
        .join(" ");
}
