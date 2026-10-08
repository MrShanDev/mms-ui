import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../src/router/pluginFederation/runtime.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
let manifests = [{ id: 'audit.plugin', version: '1.0.0', frontend: { modulePackage: 'audit_ui' } }];
const registrations = new Map();
const requests = [];
const exports = {};
vm.runInNewContext(compiled, { exports, require(name) {
  if (name.includes('pluginMarket/api')) return { fetchPluginManifests: async () => ({ data: manifests }) };
  if (name === 'virtual:__federation__') return {
    __federation_method_setRemote: (scope, config) => registrations.set(scope, config.url),
    __federation_method_getRemote: async (scope) => { requests.push(scope); return { default: { scope } }; },
    __federation_method_unwrapDefault: (module) => module.default,
  };
  return {};
}});
await exports.loadFederationComponent('audit_ui', './Page');
assert.equal(registrations.get('audit_ui__0'), '/plugin-assets/audit.plugin/1.0.0/assets/remoteEntry.js');
manifests = [{ id: 'audit.plugin', version: '1.1.0', frontend: { modulePackage: 'audit_ui' } }, { id: 'new.plugin', version: '1.0.0', frontend: { modulePackage: 'new_ui' } }];
await exports.refreshPluginFederation();
await exports.loadFederationComponent('audit_ui', './Page');
await exports.loadFederationComponent('new_ui', './Page');
assert.equal(registrations.get('audit_ui__1'), '/plugin-assets/audit.plugin/1.1.0/assets/remoteEntry.js');
assert.equal(requests.at(-1), 'new_ui__1');
manifests = [];
await exports.refreshPluginFederation();
await assert.rejects(() => exports.loadFederationComponent('audit_ui', './Page'), /未找到/);
console.log('插件联邦安装、升级、卸载运行时回归通过');

const buildConfig = fs.readFileSync(new URL('../vite.config.ts', import.meta.url), 'utf8');
assert.match(buildConfig, /mms_runtime_bootstrap/, 'originjs 构建必须保留 Host 初始化标记');
