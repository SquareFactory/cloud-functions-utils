import { load } from 'js-yaml';
import { decodePubSubMessage, encodePubSubMessage } from './pub-sub';

describe('decodePubSubMessage', () => {
  it.each([
    ['eyJmb28iOiJiYXIifQo=', { foo: 'bar' }, JSON.parse], // echo '{"foo":"bar"}' | base64
    ['Zm9vOiBiYXIKYmFyOiBiYXo=', { foo: 'bar', bar: 'baz' }, load],
  ])('should decode %p to %p', (base64: string, expected, parser: (input: string) => any = JSON.parse) => {
    const result = decodePubSubMessage({ data: base64 }, parser);

    expect(result).toStrictEqual(expected);
  });

  it('should throw an error when the message.data key is missing', () => {
    expect(() => decodePubSubMessage({})).toThrow();
  });

  it('should throw an error when the base64 payload is malformed', () => {
    expect(() => {
      decodePubSubMessage({
        data: 'dc5s4d@@54qs4sqc', // Malformed JSON output
      });
    }).toThrow();
  });
});

describe('encodePubSubMessage', () => {
  it('should encode %p to %p', () => {
    expect(encodePubSubMessage({ foo: 'bar' }).toString('utf-8')).toBe(`{"data":{"message":{"foo":"bar"}}}`);
  });
});
