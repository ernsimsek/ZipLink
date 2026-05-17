const OWNER_KEY = "ziplink_owner_id";

export function getOwnerId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(OWNER_KEY);
  if (!id) {
    id = `own_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem(OWNER_KEY, id);
  }
  return id;
}
