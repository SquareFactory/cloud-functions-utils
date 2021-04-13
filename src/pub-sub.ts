export interface PubSubMessage {
  /** The base64-encode PubSub message */
  data?: string;
}

/**
 * Decode a PubSub message.
 * @param message The PubSub message.
 * @param parser The message parser (defaults to {@see JSON.parse}); other string to data might be supplied.
 */
export function decodePubSubMessage<T>(message: PubSubMessage, parser: (raw: string) => T = JSON.parse): T {
  if (!message.data) {
    throw new Error('Invalid PubSub message: missing data key.');
  }

  try {
    return parser(Buffer.from(message.data, 'base64').toString('utf-8'));
  } catch (e) {
    throw new Error(`Unable to parse the message.data: ${e?.message ?? e.toString()}`);
  }
}

/**
 * Encode a PubSub message.
 * @param data The data to encode.
 */
export function encodePubSubMessage<T>(data: T): Buffer {
  return Buffer.from(JSON.stringify({ data: { message: data } }), 'utf-8');
}
