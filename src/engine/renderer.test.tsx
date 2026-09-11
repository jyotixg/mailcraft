import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createOtpTemplate } from '../templates/otp';
import { renderBlocks } from './renderer';

describe('renderBlocks', () => {
  it('renders one element per schema block, in order', () => {
    const schema = createOtpTemplate();
    render(<div>{renderBlocks(schema.blocks)}</div>);

    // Header/footer both reference {{companyName}}, greeting text and the OTP block should all be present.
    expect(screen.getAllByText('{{companyName}}').length).toBeGreaterThan(0);
    expect(screen.getByText(/Hello \{\{userName\}\}/)).toBeInTheDocument();
    expect(screen.getByText('Your verification code')).toBeInTheDocument();
  });

  it('shows raw {{tokens}} when no preview values are supplied', () => {
    const schema = createOtpTemplate();
    render(<div>{renderBlocks(schema.blocks)}</div>);
    expect(screen.getByText(/\{\{userName\}\}/)).toBeInTheDocument();
  });

  it('resolves {{tokens}} to supplied preview values', () => {
    const schema = createOtpTemplate();
    render(<div>{renderBlocks(schema.blocks, { userName: 'Jyoti', otp: '483921', expiryMinutes: '10' })}</div>);
    expect(screen.getByText(/Hello Jyoti/)).toBeInTheDocument();
    expect(screen.queryByText((content) => content.includes('{{userName}}'))).not.toBeInTheDocument();
  });
});
