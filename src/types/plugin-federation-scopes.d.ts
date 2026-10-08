declare module 'virtual:__federation__' {
  export function __federation_method_setRemote(
    name: string,
    config: {
      url: string | (() => Promise<string>);
      format?: 'esm' | 'systemjs' | 'var';
      from?: 'vite' | 'webpack';
    }
  ): void;

  export function __federation_method_getRemote(name: string, exposedPath: string): Promise<unknown>;
  export function __federation_method_unwrapDefault(module: unknown): unknown;
}

// Remote exports resolved at runtime by the existing federation loader.
declare module 'mms_plugin_doc_ui/DocConfigPage';
declare module 'mms_plugin_doc_ui/DocProductPage';
declare module 'mms_plugin_doc_ui/DocOrderPage';
declare module 'mms_plugin_doc_ui/DocAuthorizeUserPage';
declare module 'mms_plugin_syslog_ui/SyslogPage';
