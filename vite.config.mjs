import {defineConfig} from 'vite';
import wyw from '@wyw-in-js/vite';

const outputs = Number(process.env.OUTPUTS ?? 2);

export default defineConfig({
  plugins: [wyw({include: [/\.ts$/]})],
  build: {
    rolldownOptions: {
      input: 'src/main.ts',
      output: Array.from({length: outputs}, (_, i) => ({dir: `dist/out${i}`})),
    },
  },
});
