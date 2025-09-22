



export function capitalizeWord(word: string):string {

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
