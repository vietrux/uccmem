import md5 from 'md5';

export function getGravatarUrl(email: string, options: Record<string, string | number> = {}): string {
  const hash = md5(email.toLowerCase().trim());
  const params = new URLSearchParams(options as Record<string, string>);
  return `https://gravatar.com/avatar/${hash}?${params.toString()}`;
}

export interface GravatarProfile {
  entry: Array<{
    id: string;
    hash: string;
    requestHash: string;
    profileUrl: string;
    preferredUsername: string;
    thumbnailUrl: string;
    photos: Array<{ value: string; type: string }>;
    name: { givenName: string; familyName: string; formatted: string };
    displayName: string;
    aboutMe: string;
    currentLocation: string;
    emails: Array<{ value: string }>;
    accounts: Array<{ domain: string; display: string; url: string; username: string; verified: boolean }>;
    urls: Array<{ value: string; title: string }>;
  }>;
}

export async function getGravatarProfile(email: string): Promise<GravatarProfile | null> {
  const hash = md5(email.toLowerCase().trim());
  try {
    const response = await fetch(`https://gravatar.com/${hash}.json`);
    if (!response.ok) {
      return null;
    }
    const data: GravatarProfile = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Gravatar profile:', error);
    return null;
  }
}