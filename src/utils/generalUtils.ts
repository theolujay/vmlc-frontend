import { SessionQuestionItemType } from "@/types/Examtype";

export function getUserName(firstName: string, lastName: string): string {
    return [firstName, lastName].join(' ')
}




// export function getOptionAsArray(data:SessionQuestionItemType
  
// ): Record<string, string>[] {
//   let optionsArray = []
//   for (const key in data) {
//     if (key.startsWith('option')) {
//       const value = (data as Record<string, any>)[key];
//       let valOption: Record<string, string> = {
//         option: value,
//         optionKey: key
//       };
//       optionsArray.push(valOption);
//     }
//   }
//   return optionsArray;
// }


// export function getOptionAsArray(data:SessionQuestionItemType): Record<string, string>[] {
//   let optionsArray = []
//   for (const key in data) {
//     if (key.startsWith('option')) {
//       const value = (data as Record<string, any>)[key];
//       let valOption: Record<string, string> = {
//         option: value,
//         optionKey: key
//       };
//       optionsArray.push(valOption);
//     }
//   }
//   return optionsArray;
// }

// export function getOptionAsArray<T extends Record<string, any>>(data: T): Record<string, string>[] {
//   const optionsArray: Record<string, string>[] = [];

//   for (const key in data) {
//     if (key.startsWith("option")) {
//       const value = data[key];

//       const valOption: Record<string, string> = {
//         option: value,
//         optionKey: key,
//       };

//       optionsArray.push(valOption);
//     }
//   }

//   return optionsArray;
// }


export function getOptionAsArray<T extends Record<string, any>>(
  data: T
): Array<{ option: string; optionKey: string }> {
  const optionsArray: Array<{ option: string; optionKey: string }> = [];

  for (const key in data) {
    if (key.startsWith("option")) {
      const value = data[key];

      optionsArray.push({
        option: value,
        optionKey: key,
      });
    }
  }

  return optionsArray;
}
