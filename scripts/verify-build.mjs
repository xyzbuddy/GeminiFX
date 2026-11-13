// Verifies extension/manifest.json is MV3, every file it references exists in extension/,
// and the manifest version matches package.json.
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(root, "extension");
const manifest = JSON.parse(readFileSync(resolve(out, "manifest.json"), "utf8"));
const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
const errors = [];

if (manifest.manifest_version !== 3) errors.push("manifest_version is not 3");
if (manifest.version !== pkg.version) {
  errors.push(`manifest version ${manifest.version} != package.json version ${pkg.version}`);
}

const refs = new Set();
refs.add(manifest.background?.service_worker);
refs.add(manifest.action?.default_popup);
for (const p of Object.values(manifest.icons ?? {})) refs.add(p);
for (const p of Object.values(manifest.action?.default_icon ?? {})) refs.add(p);
for (const cs of manifest.content_scripts ?? []) {
  for (const p of cs.js ?? []) refs.add(p);
  for (const p of cs.css ?? []) refs.add(p);
}
refs.delete(undefined);

for (const ref of refs) {
  if (!existsSync(resolve(out, ref))) errors.push(`missing file referenced by manifest: ${ref}`);
}

const hosts = manifest.host_permissions ?? [];
if (hosts.length !== 1 || hosts[0] !== "https://gemini.google.com/*") {
  errors.push(`unexpected host_permissions: ${JSON.stringify(hosts)}`);
}
const perms = manifest.permissions ?? [];
if (perms.some((p) => p !== "storage")) errors.push(`unexpected permissions: ${JSON.stringify(perms)}`);

if (errors.length) {
  console.error("verify-build FAILED:\n  " + errors.join("\n  "));
  process.exit(1);
}
console.log(`verify-build OK: MV3 manifest v${manifest.version}, ${refs.size} referenced files present in extension/`);
