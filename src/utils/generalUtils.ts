import { QuestionType } from "@/types/Examtype";

export function getUserName(firstName: string, lastName: string): string {
    return [firstName, lastName].join(' ')
}




export function getOptionAsArray(data: QuestionType): Record<string, string>[] {
  let optionsArray = []
  for (const key in data) {
    if (key.startsWith('option')) {
      const value = (data as Record<string, any>)[key];
      let valOption: Record<string, string> = {
        option: value,
        optionKey: key
      };
      optionsArray.push(valOption);
    }
  }
  return optionsArray;
}