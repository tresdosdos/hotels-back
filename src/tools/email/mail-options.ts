export interface MailOptions {
  receiver: string;
  subject: string;
  text: string;
  attachments?: [
    { data: string },
    { path: string; type: string; name?: string; headers?: any }
  ];
}
