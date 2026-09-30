import {css} from '@linaria/core';
import {buttonSize} from './button';
import {iconSize} from './icon';

export const headerSize: number = buttonSize + iconSize;

export const header = css`
  margin: ${headerSize}px;
`;
