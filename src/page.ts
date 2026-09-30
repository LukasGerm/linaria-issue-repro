import {css} from '@linaria/core';
import {headerSize} from './header';
import {footerSize} from './footer';

export const pageSize: number = headerSize + footerSize;

export const page = css`
  margin: ${pageSize}px;
`;
