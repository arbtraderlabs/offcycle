import * as vscode from 'vscode';
import { loadState, saveState } from './state';

export class OffcycleViewProvider implements vscode.WebviewViewProvider {
  private view?: vscode.WebviewView;
  private readonly state: ReturnType<typeof loadState>;
  public constructor(private readonly context: vscode.ExtensionContext, private readonly output: vscode.OutputChannel) { this.state = loadState(context); }
  public resolveWebviewView(view: vscode.WebviewView): void {
    this.view = view;
    view.webview.options = { enableScripts: true, localResourceRoots: [vscode.Uri.joinPath(this.context.extensionUri, 'dist', 'webview')] };
    const nonce = String(Date.now());
    const script = view.webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'dist', 'webview', 'game.js'));
    const style = view.webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'dist', 'webview', 'styles.css'));
    view.webview.html = `<!doctype html><html><head><meta charset="UTF-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${view.webview.cspSource}; script-src 'nonce-${nonce}';"><link rel="stylesheet" href="${style}"></head><body><main id="app"><canvas id="screen" width="160" height="144" aria-label="OFFCYCLE game"></canvas><section id="controls"><button data-action="start">START</button><button data-action="replay">REPLAY LAST RUN</button></section><p id="hint">ARROWS MOVE / X ROTATE / SPACE DROP</p></main><script nonce="${nonce}" src="${script}"></script></body></html>`;
    view.webview.onDidReceiveMessage(message => {
      if (message.type === 'log') this.output.appendLine(String(message.value));
      if (message.type === 'getState') void view.webview.postMessage({ type: 'state', state: this.state });
      if (message.type === 'saveState') { this.state.best = Math.max(this.state.best, Number(message.score) || 0); this.state.runs += 1; void saveState(this.context, this.state); }
    });
  }
  public sendAgentEvent(event: string): void { this.view?.webview.postMessage({ type: 'agent', event }); this.output.appendLine(`agent event: ${event}`); }
}
