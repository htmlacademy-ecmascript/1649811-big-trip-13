export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  get storeKey() {
    return this._storeKey;
  }

  getItems(key = null) {
    if (key === null) {
      key = this._storeKey;
    }
    try {
      return JSON.parse(this._storage.getItem(key)) || {};
    } catch (err) {
      return {};
    }
  }

  setItem(key, value) {
    const store = this.getItems();

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, {
              [key]: value
            })
        )
    );
  }

  removeItem(key) {
    const store = this.getItems();

    delete store[key];

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(store)
    );
  }


  setItems(items, key = null) {
    if (key === null) {
      key = this._storeKey;
    }
    this._storage.setItem(
        key,
        JSON.stringify(items)
    );
  }
}
