export type Alignment = 'left' | 'center' | 'right';
export type FontWeight = 'normal' | 'bold';
export type DividerStyle = 'solid' | 'dashed' | 'dotted';
export type BlockWidth = 'auto' | 'full';

export interface TextBlockProps {
  content: string;
  fontSize: number;
  fontWeight: FontWeight;
  color: string;
  align: Alignment;
  lineHeight: number;
  padding: number;
  margin: number;
}

export interface HeadingBlockProps {
  text: string;
  fontSize: number;
  fontWeight: FontWeight;
  color: string;
  align: Alignment;
  padding: number;
  margin: number;
}

export interface ImageBlockProps {
  src: string;
  alt: string;
  width: number;
  align: Alignment;
  linkUrl: string;
  padding: number;
}

export interface ButtonBlockProps {
  text: string;
  url: string;
  bgColor: string;
  textColor: string;
  borderRadius: number;
  align: Alignment;
  width: BlockWidth;
  padding: number;
}

export interface LinkBlockProps {
  text: string;
  url: string;
  color: string;
  align: Alignment;
}

export interface DividerBlockProps {
  color: string;
  thickness: number;
  style: DividerStyle;
  margin: number;
}

export interface SpacerBlockProps {
  height: number;
}

export interface ContainerBlockProps {
  bgColor: string;
  border: string;
  borderRadius: number;
  padding: number;
  align: Alignment;
}

export interface HeaderBlockProps {
  logoUrl: string;
  companyName: string;
  bgColor: string;
  align: Alignment;
  padding: number;
  logoWidth: number;
}

export interface FooterBlockProps {
  companyName: string;
  supportEmail: string;
  privacyUrl: string;
  termsUrl: string;
  copyrightText: string;
  align: Alignment;
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
  border: string;
  padding: number;
}

export interface SecurityAlertBlockProps {
  title: string;
  message: string;
  bgColor: string;
  textColor: string;
  align: Alignment;
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
