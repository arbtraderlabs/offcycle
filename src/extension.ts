import * as vscode from 'vscode';
import { OffcycleViewProvider } from './extension/viewProvider';

export function activate(context: vscode.ExtensionContext): void {
  const output = vscode.window.createOutputChannel('OFFCYCLE');
  const provider = new OffcycleViewProvider(context, output);
  context.subscriptions.push(output, vscode.window.registerWebviewViewProvider('offcycle.gameView', provider));
  const emit = (event: string) => provider.sendAgentEvent(event);
  context.subscriptions.push(vscode.commands.registerCommand('offcycle.simulateAgentWorking', () => emit('WORKING')));
  context.subscriptions.push(vscode.commands.registerCommand('offcycle.simulateTestPass', () => emit('TEST_PASS')));
  context.subscriptions.push(vscode.commands.registerCommand('offcycle.simulateTestFailure', () => emit('TEST_FAILURE')));
  context.subscriptions.push(vscode.commands.registerCommand('offcycle.simulateBuildPass', () => emit('BUILD_PASS')));
  output.appendLine('extension activated');
}
export function deactivate(): void { }
