import { revalidateTag } from "next/cache"; // Correct import from next/cache

type Tag = string;

interface CacheEntry<T> {
  data: T;
  tag: Tag;
}

type TagsArray = readonly Tag[];

class CacheManager<T extends Record<string, unknown>> {
  private cache = new Map<keyof T, CacheEntry<T[keyof T]>>();

  constructor(private tags: TagsArray) {}

  cacheData<K extends keyof T>(tag: K, data: T[K]): void {
    const tagStr = String(tag); // Convert tag to string
    if (!this.tags.includes(tagStr)) {
      throw new Error(`Tag '${tagStr}' is not recognized.`);
    }
    this.cache.set(tag, { data, tag: tagStr });
  }

  getData<K extends keyof T>(tag: K): T[K] | null {
    const entry = this.cache.get(tag);
    if (entry && entry.tag === String(tag)) {
      // Compare with string conversion
      return entry.data as T[K];
    }
    return null;
  }

  invalidateTag<K extends keyof T>(tag: K): void {
    this.cache.delete(tag);
    if (typeof revalidateTag === "function") {
      revalidateTag(String(tag)); // Use String conversion
    }
  }

  invalidateAll(): void {
    this.tags.forEach((tag) => this.invalidateTag(tag as keyof T));
  }
}
