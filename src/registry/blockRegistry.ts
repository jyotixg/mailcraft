import CollectionsIcon from '@mui/icons-material/Collections';
import CropFreeIcon from '@mui/icons-material/CropFree';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';
import PasswordIcon from '@mui/icons-material/Password';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ShareIcon from '@mui/icons-material/Share';
import SmartButtonIcon from '@mui/icons-material/SmartButton';
import SpaceBarIcon from '@mui/icons-material/SpaceBar';
import TitleIcon from '@mui/icons-material/Title';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import type { SvgIconComponent } from '@mui/icons-material';
import type { ComponentType } from 'react';

import { ButtonBlock } from '../components/blocks/ButtonBlock';
import { ContainerBlock } from '../components/blocks/ContainerBlock';
import { DividerBlock } from '../components/blocks/DividerBlock';
import { FooterBlock } from '../components/blocks/FooterBlock';
import { HeaderBlock } from '../components/blocks/HeaderBlock';
import { HeadingBlock } from '../components/blocks/HeadingBlock';
import { ImageBlock } from '../components/blocks/ImageBlock';
import { ImageGroupBlock } from '../components/blocks/ImageGroupBlock';
import { LinkBlock } from '../components/blocks/LinkBlock';
import { OTPBlock } from '../components/blocks/OTPBlock';
import { SecurityAlertBlock } from '../components/blocks/SecurityAlertBlock';
import { SocialIconsBlock } from '../components/blocks/SocialIconsBlock';
import { SpacerBlock } from '../components/blocks/SpacerBlock';
import type { BlockComponentProps } from '../components/blocks/TextBlock';
import { TextBlock } from '../components/blocks/TextBlock';
import { TransactionBlock } from '../components/blocks/TransactionBlock';
import {
  ALIGN_OPTIONS,
  BLOCK_WIDTH_OPTIONS,
  DIVIDER_STYLE_OPTIONS,
  EMOJI_ICON_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  TEXT_TRANSFORM_OPTIONS,
  type PropertyFieldConfig,
} from './propertyRegistry';
import type { BlockGroup, BlockPropsMap, EmailBlockType } from '../types/blocks';
import { uniformSpacing } from '../utils/spacing';

export interface BlockRegistryEntry<K extends EmailBlockType> {
  type: K;
  label: string;
  description: string;
  icon: SvgIconComponent;
  group: BlockGroup;
  defaultProps: BlockPropsMap[K];
  fields: PropertyFieldConfig[];
  component: ComponentType<BlockComponentProps<BlockPropsMap[K]>>;
  /** Returns block-level validation error messages (required fields, etc). */
  validate?: (props: BlockPropsMap[K]) => string[];
}

export type BlockRegistry = { [K in EmailBlockType]: BlockRegistryEntry<K> };

export const blockRegistry: BlockRegistry = {
  text: {
    type: 'text',
    label: 'Text',
    description: 'Paragraph content',
    icon: ViewHeadlineIcon,
    group: 'content',
    defaultProps: {
      content: 'Hello {{userName}},',
      fontSize: 15,
      fontWeight: 'normal',
      textTransform: 'none',
      color: '#333333',
      align: 'left',
      lineHeight: 1.5,
      padding: uniformSpacing(16),
      margin: uniformSpacing(0),
      bgColor: '#ffffff',
    },
    fields: [
      { key: 'content', label: 'Content', type: 'textarea', supportsVariables: true, supportsRichColor: true },
      { key: 'fontSize', label: 'Font Size', type: 'number', min: 10, max: 48 },
      { key: 'fontWeight', label: 'Font Weight', type: 'select', options: FONT_WEIGHT_OPTIONS },
      { key: 'textTransform', label: 'Font Style', type: 'select', options: TEXT_TRANSFORM_OPTIONS },
      { key: 'align', label: 'Alignment', type: 'select', options: ALIGN_OPTIONS },
      { key: 'color', label: 'Text Color', type: 'color' },
      { key: 'lineHeight', label: 'Line Height', type: 'number', min: 1, max: 3, step: 0.1 },
      { key: 'padding', label: 'Padding', type: 'spacing' },
      { key: 'margin', label: 'Margin', type: 'spacing' },
      { key: 'bgColor', label: 'Background Color', type: 'color' },
    ],
    component: TextBlock,
  },
  heading: {
    type: 'heading',
    label: 'Heading',
    description: 'Section heading',
    icon: TitleIcon,
    group: 'content',
    defaultProps: {
      text: 'Section Heading',
      fontSize: 22,
      fontWeight: 'bold',
      textTransform: 'none',
      color: '#1a1a1a',
      align: 'left',
      padding: uniformSpacing(16),
      margin: uniformSpacing(0),
      bgColor: '#ffffff',
      icon: '',
    },
    fields: [
      { key: 'icon', label: 'Icon', type: 'select', options: EMOJI_ICON_OPTIONS },
      { key: 'text', label: 'Text', type: 'text', supportsVariables: true, supportsRichColor: true },
      { key: 'fontSize', label: 'Font Size', type: 'number', min: 12, max: 64 },
      { key: 'fontWeight', label: 'Font Weight', type: 'select', options: FONT_WEIGHT_OPTIONS },
      { key: 'textTransform', label: 'Font Style', type: 'select', options: TEXT_TRANSFORM_OPTIONS },
      { key: 'align', label: 'Alignment', type: 'select', options: ALIGN_OPTIONS },
      { key: 'color', label: 'Text Color', type: 'color' },
      { key: 'padding', label: 'Padding', type: 'spacing' },
      { key: 'margin', label: 'Margin', type: 'spacing' },
      { key: 'bgColor', label: 'Background Color', type: 'color' },
    ],
    component: HeadingBlock,
    validate: (props) => (props.text.trim() ? [] : ['Heading text is empty']),
  },
  image: {
    type: 'image',
    label: 'Image',
    description: 'Logo or illustration',
    icon: ImageIcon,
    group: 'content',
    defaultProps: {
      src: 'https://placehold.co/560x200/EEF1F5/667085?text=Image',
      alt: 'Descriptive alt text',
      width: 280,
      align: 'center',
      linkUrl: '',
      padding: uniformSpacing(16),
      bgColor: '#ffffff',
    },
    fields: [
      { key: 'src', label: 'Image', type: 'image' },
      { key: 'alt', label: 'Alt Text', type: 'text', supportsVariables: true },
      { key: 'width', label: 'Width (px)', type: 'number', min: 32, max: 600 },
      { key: 'align', label: 'Alignment', type: 'select', options: ALIGN_OPTIONS },
      { key: 'linkUrl', label: 'Link URL', type: 'url', supportsVariables: true },
      { key: 'padding', label: 'Padding', type: 'spacing' },
      { key: 'bgColor', label: 'Background Color', type: 'color' },
    ],
    component: ImageBlock,
    validate: (props) => {
      const errors: string[] = [];
      if (!props.src.trim()) errors.push('Image URL is required');
      if (!props.alt.trim()) errors.push('Image is missing alt text');
      return errors;
    },
  },
  button: {
    type: 'button',
    label: 'Button',
    description: 'Call to action',
    icon: SmartButtonIcon,
    group: 'content',
    defaultProps: {
      text: 'Verify Account',
      url: '{{verificationUrl}}',
      bgColor: '#4f46e5',
      textColor: '#ffffff',
      borderRadius: 8,
      align: 'center',
      width: 'auto',
      padding: uniformSpacing(16),
    },
    fields: [
      { key: 'text', label: 'Button Text', type: 'text', supportsVariables: true },
      { key: 'url', label: 'URL', type: 'url', supportsVariables: true },
      { key: 'align', label: 'Alignment', type: 'select', options: ALIGN_OPTIONS },
      { key: 'width', label: 'Width', type: 'select', options: BLOCK_WIDTH_OPTIONS },
      { key: 'bgColor', label: 'Background Color', type: 'color' },
      { key: 'textColor', label: 'Text Color', type: 'color' },
      { key: 'borderRadius', label: 'Radius', type: 'number', min: 0, max: 32 },
      { key: 'padding', label: 'Padding', type: 'spacing' },
    ],
    component: ButtonBlock,
    validate: (props) => {
      const errors: string[] = [];
      if (!props.text.trim()) errors.push('Button text is required');
      if (!props.url.trim()) errors.push('Button URL is required');
      return errors;
    },
  },
  link: {
    type: 'link',
    label: 'Link',
    description: 'Inline text link',
    icon: LinkIcon,
    group: 'content',
    defaultProps: {
      text: 'View in browser',
      url: '{{verificationUrl}}',
      color: '#2f6feb',
      align: 'left',
      bgColor: '#ffffff',
    },
    fields: [
      { key: 'text', label: 'Link Text', type: 'text', supportsVariables: true },
      { key: 'url', label: 'URL', type: 'url', supportsVariables: true },
      { key: 'color', label: 'Color', type: 'color' },
      { key: 'align', label: 'Alignment', type: 'select', options: ALIGN_OPTIONS },
      { key: 'bgColor', label: 'Background Color', type: 'color' },
    ],
    component: LinkBlock,
    validate: (props) => (props.url.trim() ? [] : ['Link URL is required']),
  },
  divider: {
    type: 'divider',
    label: 'Divider',
    description: 'Horizontal rule',
    icon: HorizontalRuleIcon,
    group: 'layout',
    defaultProps: {
      color: '#e9ecef',
      thickness: 1,
      style: 'solid',
      margin: 16,
      badgeIcon: '',
      badgeText: '',
      badgeColor: '#1971c2',
      badgePosition: 'right',
    },
    fields: [
      { key: 'color', label: 'Color', type: 'color' },
      { key: 'thickness', label: 'Thickness', type: 'number', min: 1, max: 8 },
      { key: 'style', label: 'Style', type: 'select', options: DIVIDER_STYLE_OPTIONS },
      { key: 'margin', label: 'Margin', type: 'number', min: 0, max: 64 },
      { key: 'badgeIcon', label: 'Badge Icon', type: 'select', options: EMOJI_ICON_OPTIONS },
      { key: 'badgeText', label: 'Badge Text', type: 'text', helperText: 'Optional label, e.g. "Step 2" or "OR" — shown alongside/instead of the icon' },
      { key: 'badgeColor', label: 'Badge Color', type: 'color' },
      { key: 'badgePosition', label: 'Badge Position', type: 'select', options: ALIGN_OPTIONS },
    ],
    component: DividerBlock,
  },
  spacer: {
    type: 'spacer',
    label: 'Spacer',
    description: 'Vertical spacing',
    icon: SpaceBarIcon,
    group: 'layout',
    defaultProps: { height: 24 },
    fields: [{ key: 'height', label: 'Height', type: 'number', min: 4, max: 200 }],
    component: SpacerBlock,
  },
  container: {
    type: 'container',
    label: 'Container',
    description: 'Layout wrapper',
    icon: CropFreeIcon,
    group: 'layout',
    defaultProps: {
      bgColor: '#f8f9fa',
      border: '1px solid #e9ecef',
      borderRadius: 8,
      padding: uniformSpacing(0),
      align: 'left',
    },
    fields: [
      { key: 'bgColor', label: 'Background Color', type: 'color' },
      { key: 'border', label: 'Border', type: 'text' },
      { key: 'borderRadius', label: 'Border Radius', type: 'number', min: 0, max: 32 },
      { key: 'padding', label: 'Padding', type: 'spacing' },
      { key: 'align', label: 'Alignment', type: 'select', options: ALIGN_OPTIONS },
    ],
    component: ContainerBlock,
  },
  header: {
    type: 'header',
    label: 'Header',
    description: 'Brand header with logo',
    icon: ViewAgendaIcon,
    group: 'common',
    defaultProps: {
      logoUrl: '',
      companyName: '{{companyName}}',
      bgColor: '#ffffff',
      textColor: '#1a1a1a',
      align: 'center',
      padding: uniformSpacing(24),
      logoWidth: 140,
    },
    fields: [
      { key: 'logoUrl', label: 'Logo', type: 'image' },
      { key: 'companyName', label: 'Company Name', type: 'text', supportsVariables: true },
      { key: 'bgColor', label: 'Background Color', type: 'color' },
      { key: 'textColor', label: 'Text Color', type: 'color' },
      { key: 'align', label: 'Alignment', type: 'select', options: ALIGN_OPTIONS },
      { key: 'padding', label: 'Padding', type: 'spacing' },
      { key: 'logoWidth', label: 'Logo Width', type: 'number', min: 40, max: 400 },
    ],
    component: HeaderBlock,
  },
  footer: {
    type: 'footer',
    label: 'Footer',
    description: 'Legal / support footer',
    icon: ViewHeadlineIcon,
    group: 'common',
    defaultProps: {
      companyName: '{{companyName}}',
      supportEmail: '{{supportEmail}}',
      privacyUrl: 'https://example.com/privacy',
      termsUrl: 'https://example.com/terms',
      copyrightText: `© ${new Date().getFullYear()} {{companyName}}. All rights reserved.`,
      align: 'center',
      bgColor: '#ffffff',
      textColor: '#868e96',
    },
    fields: [
      { key: 'companyName', label: 'Company Name', type: 'text', supportsVariables: true },
      { key: 'supportEmail', label: 'Support Email', type: 'text', supportsVariables: true },
      { key: 'privacyUrl', label: 'Privacy URL', type: 'url' },
      { key: 'termsUrl', label: 'Terms URL', type: 'url' },
      { key: 'copyrightText', label: 'Copyright Text', type: 'text', supportsVariables: true },
      { key: 'align', label: 'Alignment', type: 'select', options: ALIGN_OPTIONS },
      { key: 'bgColor', label: 'Background Color', type: 'color' },
      { key: 'textColor', label: 'Text Color', type: 'color' },
    ],
    component: FooterBlock,
    validate: (props) => (props.supportEmail.trim() ? [] : ['Footer is missing a support email']),
  },
  otp: {
    type: 'otp',
    label: 'OTP',
    description: 'One-time password display',
    icon: PasswordIcon,
    group: 'fintech',
    defaultProps: {
      label: 'Your verification code',
      otpVariable: '{{otp}}',
      expiryVariable: '{{expiryMinutes}}',
      digits: 6,
      align: 'center',
      bgColor: '#f8f9fa',
      textColor: '#1a1a1a',
    },
    fields: [
      { key: 'label', label: 'Label', type: 'text', supportsVariables: true },
      {
        key: 'otpVariable',
        label: 'OTP Value',
        type: 'text',
        supportsVariables: true,
        helperText: 'Type a literal value, or insert {{otp}} to pull from a variable',
      },
      {
        key: 'expiryVariable',
        label: 'Expiry Value',
        type: 'text',
        supportsVariables: true,
        helperText: 'Type a literal value, or insert {{expiryMinutes}} to pull from a variable',
      },
      { key: 'digits', label: 'Number of Digits', type: 'number', min: 4, max: 8 },
      { key: 'align', label: 'Alignment', type: 'select', options: ALIGN_OPTIONS },
      { key: 'bgColor', label: 'Background', type: 'color' },
      { key: 'textColor', label: 'Text Color', type: 'color' },
    ],
    component: OTPBlock,
    validate: (props) => (props.otpVariable.trim() ? [] : ['OTP value is required']),
  },
  transaction: {
    type: 'transaction',
    label: 'Transaction Summary',
    description: 'Amount, ID, date, status',
    icon: ReceiptLongIcon,
    group: 'fintech',
    defaultProps: {
      title: 'Transaction Details',
      amountVariable: '{{amount}}',
      transactionIdVariable: '{{transactionId}}',
      dateVariable: '{{transactionDate}}',
      statusVariable: '{{status}}',
      bgColor: '#f8f9fa',
      textColor: '#1a1a1a',
      border: '1px solid #e9ecef',
      padding: uniformSpacing(20),
    },
    fields: [
      { key: 'title', label: 'Title', type: 'text', supportsVariables: true },
      {
        key: 'amountVariable',
        label: 'Amount',
        type: 'text',
        supportsVariables: true,
        helperText: 'Type a literal value, or insert a {{variable}}',
      },
      {
        key: 'transactionIdVariable',
        label: 'Transaction ID',
        type: 'text',
        supportsVariables: true,
        helperText: 'Type a literal value, or insert a {{variable}}',
      },
      {
        key: 'dateVariable',
        label: 'Date',
        type: 'text',
        supportsVariables: true,
        helperText: 'Type a literal value, or insert a {{variable}}',
      },
      {
        key: 'statusVariable',
        label: 'Status',
        type: 'text',
        supportsVariables: true,
        helperText: 'Type a literal value, or insert a {{variable}}',
      },
      { key: 'bgColor', label: 'Background', type: 'color' },
      { key: 'textColor', label: 'Text Color', type: 'color' },
      { key: 'border', label: 'Border', type: 'text' },
      { key: 'padding', label: 'Padding', type: 'spacing' },
    ],
    component: TransactionBlock,
    validate: (props) => (props.amountVariable.trim() ? [] : ['Amount is required']),
  },
  securityAlert: {
    type: 'securityAlert',
    label: 'Security Alert',
    description: 'Fraud / security notice',
    icon: GppMaybeIcon,
    group: 'fintech',
    defaultProps: {
      title: 'Security Alert',
      message: 'If you did not perform this activity, please contact support immediately.',
      bgColor: '#fff4e6',
      textColor: '#985a0b',
      align: 'left',
    },
    fields: [
      { key: 'title', label: 'Title', type: 'text', supportsVariables: true, supportsRichColor: true },
      { key: 'message', label: 'Message', type: 'textarea', supportsVariables: true, supportsRichColor: true },
      { key: 'bgColor', label: 'Background', type: 'color' },
      { key: 'textColor', label: 'Text Color', type: 'color' },
      { key: 'align', label: 'Alignment', type: 'select', options: ALIGN_OPTIONS },
    ],
    component: SecurityAlertBlock,
    validate: (props) => (props.message.trim() ? [] : ['Security alert message is empty']),
  },
  socialIcons: {
    type: 'socialIcons',
    label: 'Social Icons',
    description: 'Row of social media links',
    icon: ShareIcon,
    group: 'common',
    defaultProps: {
      facebookUrl: '',
      twitterUrl: '',
      linkedinUrl: '',
      instagramUrl: '',
      youtubeUrl: '',
      iconSize: 36,
      align: 'center',
      padding: uniformSpacing(16),
      bgColor: '#ffffff',
    },
    fields: [
      { key: 'facebookUrl', label: 'Facebook URL', type: 'url' },
      { key: 'twitterUrl', label: 'X (Twitter) URL', type: 'url' },
      { key: 'linkedinUrl', label: 'LinkedIn URL', type: 'url' },
      { key: 'instagramUrl', label: 'Instagram URL', type: 'url' },
      { key: 'youtubeUrl', label: 'YouTube URL', type: 'url' },
      { key: 'iconSize', label: 'Icon Size', type: 'number', min: 24, max: 56 },
      { key: 'align', label: 'Alignment', type: 'select', options: ALIGN_OPTIONS },
      { key: 'padding', label: 'Padding', type: 'spacing' },
      { key: 'bgColor', label: 'Background Color', type: 'color' },
    ],
    component: SocialIconsBlock,
  },
  imageGroup: {
    type: 'imageGroup',
    label: 'Image Group',
    description: 'Multiple logos or badges in a row',
    icon: CollectionsIcon,
    group: 'content',
    defaultProps: {
      images: [],
      imageHeight: 32,
      gap: 20,
      align: 'center',
      padding: uniformSpacing(16),
      bgColor: '#ffffff',
    },
    fields: [
      { key: 'images', label: 'Images', type: 'imageList' },
      { key: 'imageHeight', label: 'Image Height', type: 'number', min: 16, max: 120 },
      { key: 'gap', label: 'Gap', type: 'number', min: 0, max: 48 },
      { key: 'align', label: 'Alignment', type: 'select', options: ALIGN_OPTIONS },
      { key: 'padding', label: 'Padding', type: 'spacing' },
      { key: 'bgColor', label: 'Background Color', type: 'color' },
    ],
    component: ImageGroupBlock,
  },
};

export const blockRegistryList = Object.values(blockRegistry) as BlockRegistryEntry<EmailBlockType>[];

export function getBlockEntry<K extends EmailBlockType>(type: K): BlockRegistryEntry<K> {
  return blockRegistry[type];
}
