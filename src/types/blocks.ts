import type { Spacing } from '../utils/spacing';

export type Alignment = 'left' | 'center' | 'right';
export type FontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
export type TextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize';
export type DividerStyle = 'solid' | 'dashed' | 'dotted';
export type BlockWidth = 'auto' | 'full';

export interface TextBlockProps {
  content: string;
  fontSize: number;
  fontWeight: FontWeight;
  textTransform: TextTransform;
  color: string;
  align: Alignment;
  lineHeight: number;
  padding: Spacing;
  margin: Spacing;
  bgColor: string;
}

export interface HeadingBlockProps {
  text: string;
  fontSize: number;
  fontWeight: FontWeight;
  textTransform: TextTransform;
  color: string;
  align: Alignment;
  padding: Spacing;
  margin: Spacing;
  bgColor: string;
  icon: string;
}

export interface ImageBlockProps {
  src: string;
  alt: string;
  width: number;
  align: Alignment;
  linkUrl: string;
  padding: Spacing;
  bgColor: string;
}

export interface ButtonBlockProps {
  text: string;
  url: string;
  bgColor: string;
  textColor: string;
  borderRadius: number;
  align: Alignment;
  width: BlockWidth;
  padding: Spacing;
}

export interface LinkBlockProps {
  text: string;
  url: string;
  color: string;
  align: Alignment;
  bgColor: string;
}

export interface DividerBlockProps {
  color: string;
  thickness: number;
  style: DividerStyle;
  margin: number;
  badgeIcon: string;
  badgeText: string;
  badgeColor: string;
  badgePosition: Alignment;
}

export interface SpacerBlockProps {
  height: number;
}

export interface ContainerBlockProps {
  bgColor: string;
  border: string;
  borderRadius: number;
  padding: Spacing;
  align: Alignment;
}

export interface HeaderBlockProps {
  logoUrl: string;
  companyName: string;
  bgColor: string;
  textColor: string;
  align: Alignment;
  padding: Spacing;
  logoWidth: number;
}

export interface FooterBlockProps {
  companyName: string;
  supportEmail: string;
  privacyUrl: string;
  termsUrl: string;
  copyrightText: string;
  align: Alignment;
  bgColor: string;
  textColor: string;
}

export interface OtpBlockProps {
  label: string;
  otpVariable: string;
  expiryVariable: string;
  digits: number;
  align: Alignment;
  bgColor: string;
  textColor: string;
}

export interface TransactionBlockProps {
  title: string;
  amountVariable: string;
  transactionIdVariable: string;
  dateVariable: string;
  statusVariable: string;
  bgColor: string;
  textColor: string;
  border: string;
  padding: Spacing;
}

export interface SecurityAlertBlockProps {
  title: string;
  message: string;
  bgColor: string;
  textColor: string;
  align: Alignment;
}

export interface SocialIconsBlockProps {
  facebookUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  iconSize: number;
  align: Alignment;
  padding: Spacing;
  bgColor: string;
}

export interface ImageGroupItem {
  id: string;
  src: string;
  alt: string;
  linkUrl: string;
}

export interface ImageGroupBlockProps {
  images: ImageGroupItem[];
  imageHeight: number;
  gap: number;
  align: Alignment;
  padding: Spacing;
  bgColor: string;
}

export interface BlockPropsMap {
  text: TextBlockProps;
  heading: HeadingBlockProps;
  image: ImageBlockProps;
  button: ButtonBlockProps;
  link: LinkBlockProps;
  divider: DividerBlockProps;
  spacer: SpacerBlockProps;
  container: ContainerBlockProps;
  header: HeaderBlockProps;
  footer: FooterBlockProps;
  otp: OtpBlockProps;
  transaction: TransactionBlockProps;
  securityAlert: SecurityAlertBlockProps;
  socialIcons: SocialIconsBlockProps;
  imageGroup: ImageGroupBlockProps;
}

export type EmailBlockType = keyof BlockPropsMap;

export type EmailBlock = {
  [K in EmailBlockType]: {
    id: string;
    type: K;
    props: BlockPropsMap[K];
  };
}[EmailBlockType];

export type BlockGroup = 'content' | 'layout' | 'fintech' | 'common';
