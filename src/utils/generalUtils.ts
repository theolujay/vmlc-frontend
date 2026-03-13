// import { SessionQuestionItemType } from "@/types/Examtype";

export function getUserName(firstName: string, lastName: string): string {
  return [firstName, lastName].join(" ");
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

export function getOptionAsArray<T extends Record<string, unknown>>(
  data: T,
): Array<{ option: string; optionKey: string }> {
  const optionsArray: Array<{ option: string; optionKey: string }> = [];

  for (const key in data) {
    if (key.startsWith("option")) {
      const value = data[key];

      optionsArray.push({
        option: value as string,
        optionKey: key,
      });
    }
  }

  return optionsArray;
}

export function getOrdinal(n: number): string {
  const v = n % 100;

  if (v >= 11 && v <= 13) {
    return `${n}TH`;
  }

  switch (n % 10) {
    case 1:
      return `${n}ST`;
    case 2:
      return `${n}ND`;
    case 3:
      return `${n}RD`;
    default:
      return `${n}TH`;
  }
}

export function formatExamTitle(title: string | undefined): string {
  if (!title) return "";

  return title.replace(/^\d{4}\s*\|\s*/, "");
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * Formats a phone number for use in a WhatsApp (wa.me) link.
 * It removes all non-numeric characters and ensures the number is ready for wa.me.
 */
export function formatWhatsAppLink(phone: string | undefined): string {
  if (!phone) return "#";

  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, "");

  // If it starts with 0 (and not 234), it's likely a local Nigerian number
  // We should probably handle this case if the API ever returns local numbers
  if (cleaned.startsWith("0") && !cleaned.startsWith("234")) {
    return `https://wa.me/234${cleaned.slice(1)}`;
  }

  return `https://wa.me/${cleaned}`;
}
