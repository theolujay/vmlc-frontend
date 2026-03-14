export function getUserInitials(userName: string) {
  if (!userName) {
    return "";
  }
  //   const userInitials = userName.split(' ').map((val) => val[0]).join('')
  const userInitials = userName
    .split(" ")
    .map((val) => val.charAt(0))
    .join("");
  return userInitials;
}

export function capitalizeWord(word: string): string {
  if (!word) return "";
  return word
    .split(" ")
    .map((segment) =>
      segment
        .split("-")
        .map(
          (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
        )
        .join(" "),
    )
    .join(" ");
}
