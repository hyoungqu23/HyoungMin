import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CodeBlock } from '../CodeBlock';

describe('CodeBlock', () => {
  it('should render code block', () => {
    render(
      <CodeBlock>
        <code>const test = 'hello';</code>
      </CodeBlock>,
    );

    expect(screen.getByText("const test = 'hello';")).toBeInTheDocument();
    expect(screen.getByLabelText('Copy code')).toBeInTheDocument();
  });
});
