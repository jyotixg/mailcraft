import CropFreeIcon from '@mui/icons-material/CropFree';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';
import PasswordIcon from '@mui/icons-material/Password';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
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
import { LinkBlock } from '../components/blocks/LinkBlock';
import { OTPBlock } from '../components/blocks/OTPBlock';
import { SecurityAlertBlock } from '../components/blocks/SecurityAlertBlock';
import { SpacerBlock } from '../components/blocks/SpacerBlock';
import type { BlockComponentProps } from '../components/blocks/TextBlock';
import { TextBlock } from '../components/blocks/TextBlock';
import { TransactionBlock } from '../components/blocks/TransactionBlock';
import {
  ALIGN_OPTIONS,
  BLOCK_WIDTH_OPTIONS,
  DIVIDER_STYLE_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  type PropertyFieldConfig,
} from './propertyRegistry';
import type { BlockGroup, BlockPropsMap, EmailBlockType } from '../types/blocks';

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
      color: '#333333',
      align: 'left',
      lineHeight: 1.5,
      padding: 16,
      margin: 0,
    },
    fields: [
      { key: 'content', label: 'Content', type: 'textarea', supportsVariables: true },
      { key: 'fontSize', label: 'Font Size', type: 'number', min: 10, max: 48 },
      { key: 'fontWeight', label: 'Font Weight', type: 'select', options: FONT_WEIGHT_OPTIONS },
      { key: 'align', label: 'Alignment', type: 'select', options: ALIGN_OPTIONS },
      { key: 'color', label: 'Text Color', type: 'color' },
      { key: 'lineHeight', label: 'Line Height', type: 'number', min: 1, max: 3, step: 0.1 },
      { key: 'padding', label: 'Padding', type: 'number', min: 0, max: 64 },
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
      color: '#1a1a1a',
      align: 'left',
      padding: 16,
      margin: 0,
    },
    fields: [
      { key: 'text', label: 'Text', type: 'text', supportsVariables: true },
      { key: 'fontSize', label: 'Font Size', type: 'number', min: 12, max: 64 },
      { key: 'fontWeight', label: 'Font Weight', type: 'select', options: FONT_WEIGHT_OPTIONS },
      { key: 'align', label: 'Alignment', type: 'select', options: ALIGN_OPTIONS },
      { key: 'color', label: 'Text Color', type: 'color' },
      { key: 'padding', label: 'Padding', type: 'number', min: 0, max: 64 },
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
      padding: 16,
    },
    fields: [
      { key: 'src', label: 'Image URL', type: 'url' },
      { key: 'alt', label: 'Alt Text', type: 'text', supportsVariables: true },
      { key: 'width', label: 'Width (px)', type: 'number', min: 32, max: 600 },
      { key: 'align', label: 'Alignment', type: 'select', options: ALIGN_OPTIONS },
      { key: 'linkUrl', label: 'Link URL', type: 'url', supportsVariables: true },
      { key: 'padding', label: 'Padding', type: 'number', min: 0, max: 64 },
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
      bgColor: '#2f6feb',
      textColor: '#ffffff',
      borderRadius: 6,
      align: 'center',
      width: 'auto',
      padding: 16,
    },
    fields: [
      { key: 'text', label: 'Button Text', type: 'text', supportsVariables: true },
      { key: 'url', label: 'URL', type: 'url', supportsVariables: true },
      { key: 'align', label: 'Alignment', type: 'select', options: ALIGN_OPTIONS },
      { key: 'width', label: 'Width', type: 'select', options: BLOCK_WIDTH_OPTIONS },
      { key: 'bgColor', label: 'Background Color', type: 'color' },
      { key: 'textColor', label: 'Text Color', type: 'color' },
      { key: 'borderRadius', label: 'Radius', type: 'number', min: 0, max: 32 },
      { key: 'padding', label: 'Padding', type: 'number', min: 0, max: 64 },
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
    },
    fields: [
      { key: 'text', label: 'Link Text', type: 'text', supportsVariables: true },
      { key: 'url', label: 'URL', type: 'url', supportsVariables: true },
      { key: 'color', label: 'Color', type: 'color' },
      { key: 'align', label: 'Alignment', type: 'select', options: ALIGN_OPTIONS },
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
    defaultProps: { color: '#e9ecef', thickness: 1, style: 'solid', margin: 16 },
    fields: [
      { key: 'color', label: 'Color', type: 'color' },
      { key: 'thickness', label: 'Thickness', type: 'number', min: 1, max: 8 },
      { key: 'style', label: 'Style', type: 'select', options: DIVIDER_STYLE_OPTIONS },
      { key: 'margin', label: 'Margin', type: 'number', min: 0, max: 64 },
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
      padding: 16,
      align: 'left',
    },
    fields: [
      { key: 'bgColor', label: 'Background Color', type: 'color' },
      { key: 'border', label: 'Border', type: 'text' },
      { key: 'borderRadius', label: 'Border Radius', type: 'number', min: 0, max: 32 },
      { key: 'padding', label: 'Padding', type: 'number', min: 0, max: 64 },
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
      align: 'center',
      padding: 24,
      logoWidth: 140,
    },
    fields: [
      { key: 'logoUrl', label: 'Logo URL', type: 'url' },
      { key: 'companyName', label: 'Company Name', type: 'text', supportsVariables: true },
      { key: 'bgColor', label: 'Background Color', type: 'color' },
      { key: 'align', label: 'Alignment', type: 'select', options: ALIGN_OPTIONS },
      { key: 'padding', label: 'Padding', type: 'number', min: 0, max: 64 },
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
    },
    fields: [
      { key: 'companyName', label: 'Company Name', type: 'text', supportsVariables: true },
      { key: 'supportEmail', label: 'Support Email', type: 'text', supportsVariables: true },
      { key: 'privacyUrl', label: 'Privacy URL', type: 'url' },
      { key: 'termsUrl', label: 'Terms URL', type: 'url' },
      { key: 'copyrightText', label: 'Copyright Text', type: 'text', supportsVariables: true },
      { key: 'align', label: 'Alignment', type: 'select', options: ALIGN_OPTIONS },
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
      otpVariable: 'otp',
      expiryVariable: 'expiryMinutes',
      digits: 6,
      align: 'center',
      bgColor: '#f8f9fa',
      textColor: '#1a1a1a',
    },
    fields: [
      { key: 'label', label: 'Label', type: 'text', supportsVariables: true },
      { key: 'otpVariable', label: 'OTP Variable', type: 'text', helperText: 'Variable name, without braces' },
      { key: 'expiryVariable', label: 'Expiry Variable', type: 'text', helperText: 'Variable name, without braces' },
      { key: 'digits', label: 'Number of Digits', type: 'number', min: 4, max: 8 },
      { key: 'align', label: 'Alignment', type: 'select', options: ALIGN_OPTIONS },
      { key: 'bgColor', label: 'Background', type: 'color' },
      { key: 'textColor', label: 'Text Color', type: 'color' },
    ],
    component: OTPBlock,
    validate: (props) => (props.otpVariable.trim() ? [] : ['OTP variable is required']),
  },
  transaction: {
    type: 'transaction',
    label: 'Transaction Summary',
    description: 'Amount, ID, date, status',
    icon: ReceiptLongIcon,
    group: 'fintech',
    defaultProps: {
      title: 'Transaction Details',
      amountVariable: 'amount',
      transactionIdVariable: 'transactionId',
      dateVariable: 'transactionDate',
      statusVariable: 'status',
      bgColor: '#f8f9fa',
      border: '1px solid #e9ecef',
      padding: 20,
    },
    fields: [
      { key: 'title', label: 'Title', type: 'text', supportsVariables: true },
      { key: 'amountVariable', label: 'Amount Variable', type: 'text', helperText: 'Variable name, without braces' },
      {
        key: 'transactionIdVariable',
        label: 'Transaction ID Variable',
        type: 'text',
        helperText: 'Variable name, without braces',
      },
      { key: 'dateVariable', label: 'Date Variable', type: 'text', helperText: 'Variable name, without braces' },
      { key: 'statusVariable', label: 'Status Variable', type: 'text', helperText: 'Variable name, without braces' },
      { key: 'bgColor', label: 'Background', type: 'color' },
      { key: 'border', label: 'Border', type: 'text' },
      { key: 'padding', label: 'Padding', type: 'number', min: 0, max: 64 },
    ],
    component: TransactionBlock,
    validate: (props) => (props.amountVariable.trim() ? [] : ['Amount variable is required']),
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
      { key: 'title', label: 'Title', type: 'text', supportsVariables: true },
      { key: 'message', label: 'Message', type: 'textarea', supportsVariables: true },
      { key: 'bgColor', label: 'Background', type: 'color' },
      { key: 'textColor', label: 'Text Color', type: 'color' },
      { key: 'align', label: 'Alignment', type: 'select', options: ALIGN_OPTIONS },
    ],
    component: SecurityAlertBlock,
    validate: (props) => (props.message.trim() ? [] : ['Security alert message is empty']),
  },
};

export const blockRegistryList = Object.values(blockRegistry) as BlockRegistryEntry<EmailBlockType>[];

export function getBlockEntry<K extends EmailBlockType>(type: K): BlockRegistryEntry<K> {
  return blockRegistry[type];
}
