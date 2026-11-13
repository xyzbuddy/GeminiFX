import { ensureStoredSettings } from "../settings/storage";

/**
 * Background service worker. Its only job is to write a valid, migrated
 * settings object on install/update. No network access, no tab tracking.
 */
chrome.runtime.onInstalled.addListener(() => {
  void ensureStoredSettings();
});
