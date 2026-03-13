import { redirect } from "next/navigation";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = new URLSearchParams();
  const resolvedSearchParams = await searchParams;
  
  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => params.append(key, v));
    } else if (value !== undefined) {
      params.set(key, value);
    }
  });

  const queryString = params.toString();

  redirect(`/login${queryString ? `?${queryString}` : ""}`);
}
