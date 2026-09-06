import * as vscode from 'vscode';
export interface LocalState { best: number; runs: number; sound: boolean; agentEvents: boolean; }
export function loadState(context: vscode.ExtensionContext): LocalState { return { best: context.globalState.get('best', 0), runs: context.globalState.get('runs', 0), sound: context.globalState.get('sound', true), agentEvents: context.globalState.get('agentEvents', true) }; }
export async function saveState(context: vscode.ExtensionContext, state: LocalState): Promise<void> { await context.globalState.update('best', state.best); await context.globalState.update('runs', state.runs); }
