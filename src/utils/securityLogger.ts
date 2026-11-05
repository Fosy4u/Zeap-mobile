type SecurityEvent =
  | 'secure_storage_delete_failed'
  | 'logout_failed'
  | 'notification_registration_failed'
  | 'document_cleanup_failed';
export const securityEvent = (event: SecurityEvent): void => {
  if (__DEV__) console.warn(`[security] ${event}`);
};
