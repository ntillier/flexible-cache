import { LRUCache } from "lru-cache";

type FlexibleCacheOptions<K extends {}, V extends {}, FC = unknown> = LRUCache.Options<K, V, FC> & {
  primaryKey: K;
  secondaryKeys?: K[];

  dispose?: undefined;
};

class FlexibleCache<K extends {}, V extends Record<any, any>, FC = unknown> {
  private primaryKey: K;

  private secondaryKeys: K[];
  private conversionMaps: Map<K, any>;

  private cache: LRUCache<K, V, FC>;

  constructor(options: FlexibleCacheOptions<K, V, FC>) {
    if (!options.primaryKey) {
      throw Error("You must specify a `primaryKey` in the options");
    }
    this.primaryKey = options.primaryKey;

    this.secondaryKeys = options.secondaryKeys ?? [];
    this.conversionMaps = new Map<K, any>();

    this.cache = new LRUCache<K, V, FC>({
      ...options,

      dispose: (value: V) => {
        for (const key of this.secondaryKeys) {
          const keyValue = value[key];
          this.conversionMaps.get(key)?.delete(keyValue);
        }
      }
    });

    for (const key of this.secondaryKeys) {
      this.conversionMaps.set(key, new Map());
    }
  }

  set(value: V) {
    const primaryKey = value[this.primaryKey];

    this.cache.set(primaryKey as K, value);

    for (const key of this.secondaryKeys) {
      this.conversionMaps.get(key)?.set(value[key], primaryKey);
    }
  }

  get(key: K, conversionKey?: K) {
    if (conversionKey) {
      const primaryKey = this.conversionMaps.get(conversionKey)?.get(key);

      if (primaryKey) {
        return this.cache.get(primaryKey);
      } else {
        return undefined;
      }
    } else {
      return this.cache.get(key);
    }
  }

  delete(key: K, conversionKey?: K) {
    let primaryKey;

    if (conversionKey) {
      primaryKey = this.conversionMaps.get(conversionKey)?.get(key);
    } else {
      primaryKey = key;
    }

    if (primaryKey) {
      this.cache.delete(primaryKey);
    }
  }
}

export = FlexibleCache;