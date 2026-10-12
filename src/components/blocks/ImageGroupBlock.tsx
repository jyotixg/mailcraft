import type { ImageGroupBlockProps } from '../../types/blocks';
import { normalizeSpacing, spacingToCss } from '../../utils/spacing';
import type { BlockComponentProps } from './TextBlock';

const justifyForAlign: Record<ImageGroupBlockProps['align'], string> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

export function ImageGroupBlock({ props }: BlockComponentProps<ImageGroupBlockProps>) {
  return (
    <div
      style={{
        padding: spacingToCss(normalizeSpacing(props.padding)),
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: justifyForAlign[props.align],
        gap: props.gap,
        fontFamily: 'Arial, Helvetica, sans-serif',
        backgroundColor: props.bgColor,
      }}
    >
      {props.images.length === 0 ? (
        <span style={{ color: '#868e96', fontSize: 13 }}>No images added yet</span>
      ) : (
        props.images.map((image) => {
          const content = image.src ? (
            <img src={image.src} alt={image.alt} style={{ height: props.imageHeight, width: 'auto', display: 'block' }} />
          ) : (
            <div
              style={{
                height: props.imageHeight,
                width: props.imageHeight * 2,
                backgroundColor: '#f1f3f5',
                border: '1px dashed #ced4da',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#adb5bd',
                fontSize: 11,
              }}
            >
              No image
            </div>
          );
          return image.linkUrl ? (
            <a key={image.id} href={image.linkUrl}>
              {content}
            </a>
          ) : (
            <span key={image.id}>{content}</span>
          );
        })
      )}
    </div>
  );
}
