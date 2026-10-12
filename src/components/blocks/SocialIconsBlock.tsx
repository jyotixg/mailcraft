import type { SocialIconsBlockProps } from '../../types/blocks';
import { normalizeSpacing, spacingToCss } from '../../utils/spacing';
import type { BlockComponentProps } from './TextBlock';

interface Platform {
  key: 'facebookUrl' | 'twitterUrl' | 'linkedinUrl' | 'instagramUrl' | 'youtubeUrl';
  monogram: string;
  color: string;
  name: string;
}

const PLATFORMS: Platform[] = [
  { key: 'facebookUrl', monogram: 'f', color: '#1877F2', name: 'Facebook' },
  { key: 'twitterUrl', monogram: 'X', color: '#000000', name: 'X (Twitter)' },
  { key: 'linkedinUrl', monogram: 'in', color: '#0A66C2', name: 'LinkedIn' },
  { key: 'instagramUrl', monogram: 'IG', color: '#E1306C', name: 'Instagram' },
  { key: 'youtubeUrl', monogram: 'YT', color: '#FF0000', name: 'YouTube' },
];

const justifyForAlign: Record<SocialIconsBlockProps['align'], string> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

export function SocialIconsBlock({ props }: BlockComponentProps<SocialIconsBlockProps>) {
  const active = PLATFORMS.filter((platform) => props[platform.key]?.trim());

  return (
    <div
      style={{
        padding: spacingToCss(normalizeSpacing(props.padding)),
        display: 'flex',
        justifyContent: justifyForAlign[props.align],
        gap: 10,
        fontFamily: 'Arial, Helvetica, sans-serif',
        backgroundColor: props.bgColor,
      }}
    >
      {active.length === 0 ? (
        <span style={{ color: '#868e96', fontSize: 13 }}>Add social links in the properties panel</span>
      ) : (
        active.map((platform) => (
          <a
            key={platform.key}
            href={props[platform.key]}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: props.iconSize,
                height: props.iconSize,
                borderRadius: '50%',
                backgroundColor: platform.color,
                color: '#ffffff',
                fontSize: Math.round(props.iconSize * 0.4),
                fontWeight: 700,
              }}
              aria-label={platform.name}
            >
              {platform.monogram}
            </span>
          </a>
        ))
      )}
    </div>
  );
}
