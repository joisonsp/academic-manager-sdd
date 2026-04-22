// tests/helpers/step-context.ts
// Shared HTTP response context used across all step files

import type { AxiosResponse } from 'axios';

export interface SharedStepContext {
    response?: AxiosResponse<any>;
    error?: any;
    currentId?: string;
    listaAlunos?: any[];
}

export const sharedContext: SharedStepContext = {};

export function resetSharedContext(): void {
    delete sharedContext.response;
    delete sharedContext.error;
    delete sharedContext.currentId;
    delete sharedContext.listaAlunos;
}
