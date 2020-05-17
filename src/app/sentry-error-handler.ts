import { ErrorHandler, Injectable } from '@angular/core';

import * as Sentry from '@sentry/browser';
import { environment } from '../environments/environment';

const { release, name } = environment;

Sentry.init({
  dsn: 'https://ef17b9d347b7436980d53cef564fc279@o352033.ingest.sentry.io/2467424',
  release,
  environment: name,
});

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {}
  handleError(error) {
    const eventId = Sentry.captureException(error.originalError || error);
    // Sentry.showReportDialog({ eventId }); // Optional
    console.error(error);
  }
}
