export enum PhraseActionType {
  START_DOCUMENT_SCAN = 'START_DOCUMENT_SCAN',
  SHOW_EMAIL_INPUT = 'SHOW_EMAIL_INPUT'
}

export interface StartDocumentScanAction {
  type: PhraseActionType.START_DOCUMENT_SCAN;
  apiKey: string;
}

export interface ShowEmailInputAction {
  type: PhraseActionType.SHOW_EMAIL_INPUT;
  // Add any specific parameters for this action if needed
}

export type PhraseAction = StartDocumentScanAction | ShowEmailInputAction; 