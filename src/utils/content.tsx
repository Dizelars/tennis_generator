export const getContent = async (): Promise<string> => {
  const res = await fetch("/data/data.json");
  if (!res.ok) {
    throw new Error("Failed to load content");
  }
  return await res.text();
};
