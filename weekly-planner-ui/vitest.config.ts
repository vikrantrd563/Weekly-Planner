import { defineConfig } from 'vitest/config';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

export default defineConfig({
  plugins: [
    {
      name: 'inline-angular-resources',
      transform(code, id) {
        if (!id.endsWith('.ts') || id.endsWith('.spec.ts')) return;

        code = code.replace(
          /templateUrl:\s*['"]([^'"]+)['"]/g,
          (_, url) => {
            const filePath = resolve(dirname(id), url);
            try {
              const content = readFileSync(filePath, 'utf-8')
                .replace(/\\/g, '\\\\')
                .replace(/`/g, '\\`')
                .replace(/\$\{/g, '\\${');
              return `template: \`${content}\``;
            } catch {
              return `template: ''`;
            }
          }
        );

        code = code.replace(/styleUrl:\s*['"][^'"]+['"]/g, `styles: []`);
        code = code.replace(/styleUrls:\s*\[[^\]]*\]/g, `styles: []`);

        return { code };
      }
    }
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    server: {
      deps: {
        inline: [/@angular/]
      }
    }
  }
});