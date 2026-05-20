export type ComposioOrchErrorCode =
  | 'PENDING'
  | 'NEGOTIATION'
  | 'WEBHOOK'
  | 'SLUG'
  | 'PROVIDER'
  | 'STATE'
  | 'UPSTREAM'
  | 'TIMEOUT'
  | 'CONFIG';

export class ComposioOrchError extends Error {
  readonly code: ComposioOrchErrorCode;
  readonly hint?: string;
  readonly cause?: unknown;
  constructor(code: ComposioOrchErrorCode, message: string, opts: { hint?: string; cause?: unknown } = {}) {
    super(message);
    this.name = 'ComposioOrchError';
    this.code = code;
    this.hint = opts.hint;
    this.cause = opts.cause;
  }
}

export class AuthRequiredError extends ComposioOrchError {
  readonly redirectUrl: string;
  readonly toolkit: string;
  readonly connectedAccountId: string;
  constructor(args: { toolkit: string; connectedAccountId: string; redirectUrl: string }) {
    super('PENDING', `Composio toolkit "${args.toolkit}" requires user consent`, {
      hint: `Open ${args.redirectUrl} and complete the OAuth flow`,
    });
    this.name = 'AuthRequiredError';
    this.toolkit = args.toolkit;
    this.connectedAccountId = args.connectedAccountId;
    this.redirectUrl = args.redirectUrl;
  }
}
