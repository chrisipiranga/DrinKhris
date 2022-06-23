const { REACT_APP_LOCAL_STORAGE_KEY } = process.env;

const storageKey = REACT_APP_LOCAL_STORAGE_KEY || "";

export function saveLocalStorage(data) {
  const dataStr = JSON.stringify(data);
  localStorage.setItem(storageKey, dataStr);
}

export function loadLocalStorage() {
  const localStorageData = localStorage.getItem(storageKey);
  return JSON.parse(localStorageData);
}
