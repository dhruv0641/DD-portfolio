/**
 * Email Service Deprecated.
 * Inbound messages are saved directly to the database and managed via the Admin Inbox Dashboard.
 */
export async function sendContactEmail(params: any): Promise<{ success: boolean; error?: string }> {
  console.log('[Email Notice] Email sending is disabled. Messages are managed directly via the Admin Inbox Dashboard.');
  return { success: true };
}
