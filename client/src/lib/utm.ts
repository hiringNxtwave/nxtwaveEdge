const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "ref",
  "gclid",
  "fbclid",
  "msclkid",
  "li_fat_id",
] as const;

const STORAGE_KEY = "nxw_utm";

export function captureUtm(): void {
  const params = new URLSearchParams(window.location.search);
  const utms: Record<string, string> = {};
  UTM_KEYS.forEach((k) => {
    const v = params.get(k);
    if (v) utms[k] = v;
  });
  if (Object.keys(utms).length > 0) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utms));
    } catch {}
  }
}

export function getStoredUtm(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function appendUtmToSearch(currentSearch: string): string {
  const stored = getStoredUtm();
  if (Object.keys(stored).length === 0) return currentSearch;
  const params = new URLSearchParams(currentSearch);
  let changed = false;
  Object.entries(stored).forEach(([k, v]) => {
    if (!params.has(k)) {
      params.set(k, v);
      changed = true;
    }
  });
  return changed ? params.toString() : currentSearch;
}
