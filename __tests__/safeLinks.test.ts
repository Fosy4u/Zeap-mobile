import {describe, it, expect, jest, beforeEach} from '@jest/globals';
import {Alert, Linking} from 'react-native';
import {
  getSecureLinkHost,
  isTrustedWebLink,
  openSecureLink,
  openExternalLinkWithConfirm,
} from '../src/utils/safeLinks';

describe('getSecureLinkHost', () => {
  it.each([
    ['https://admin.zeaper.com/docs/Zeaper_Policy.pdf', 'admin.zeaper.com'],
    ['https://firebasestorage.googleapis.com/v0/b/x/o/doc.pdf?alt=media', 'firebasestorage.googleapis.com'],
    ['https://zeaper.com', 'zeaper.com'],
    ['https://Example.COM:443/path', 'example.com'],
    ['  https://zeaper.com/a  ', 'zeaper.com'],
  ])('accepts secure link %s', (url, host) => {
    expect(getSecureLinkHost(url)).toBe(host);
  });

  it.each([
    'http://zeaper.com',
    'javascript:alert(1)',
    'intent://scan#Intent;scheme=zxing;end',
    'tel:+2348000000000',
    'sms:+2348000000000',
    'mailto:a@b.com',
    'file:///etc/passwd',
    'https://zeaper.com@evil.com/login',
    'https://evil.com\\@zeaper.com',
    'https:///nohost',
    'https://localhost',
    'https://-bad-.com',
    '//zeaper.com',
    '',
    null,
    undefined,
  ])('rejects %p', url => {
    expect(getSecureLinkHost(url as any)).toBeNull();
  });
});

describe('isTrustedWebLink', () => {
  it.each([
    'https://zeaper.com/help',
    'https://admin.zeaper.com/docs/Zeaper_Policy.pdf',
    'https://zeaper-web-dev.vercel.app/shop',
  ])('trusts %s', url => {
    expect(isTrustedWebLink(url)).toBe(true);
  });

  it.each([
    'https://evilzeaper.com',
    'https://zeaper.com.evil.com',
    'https://evil.vercel.app',
    'http://zeaper.com',
    'https://zeaper.com@evil.com',
  ])('does not trust %s', url => {
    expect(isTrustedWebLink(url)).toBe(false);
  });
});

describe('opening links', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    jest.spyOn(Linking, 'openURL').mockResolvedValue(true as never);
  });

  it('blocks unsafe links without opening them', () => {
    openSecureLink('javascript:alert(1)');
    expect(Linking.openURL).not.toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledWith('Link not supported', "This link can't be opened.");
  });

  it('opens secure links', () => {
    openSecureLink('https://admin.zeaper.com/docs/Zeaper_Policy.pdf');
    expect(Linking.openURL).toHaveBeenCalledWith('https://admin.zeaper.com/docs/Zeaper_Policy.pdf');
  });

  it('opens Zeaper links from descriptions directly', () => {
    openExternalLinkWithConfirm('https://zeaper.com/sales');
    expect(Alert.alert).not.toHaveBeenCalled();
    expect(Linking.openURL).toHaveBeenCalledWith('https://zeaper.com/sales');
  });

  it('asks before opening another site from a description', () => {
    openExternalLinkWithConfirm('https://pay-me-here.example/checkout');
    expect(Linking.openURL).not.toHaveBeenCalled();
    const [title, message, buttons] = (Alert.alert as jest.Mock).mock.calls[0] as any[];
    expect(title).toBe('Leaving Zeaper');
    expect(message).toBe('This link goes to pay-me-here.example. Do you want to open it?');
    buttons[1].onPress();
    expect(Linking.openURL).toHaveBeenCalledWith('https://pay-me-here.example/checkout');
  });

  it('blocks app-launching links in descriptions', () => {
    openExternalLinkWithConfirm('intent://scan#Intent;scheme=zxing;end');
    openExternalLinkWithConfirm('tel:+2348000000000');
    expect(Linking.openURL).not.toHaveBeenCalled();
  });
});
