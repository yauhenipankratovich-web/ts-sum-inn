# @ypankratovich/ts-sum-inn

TypeScript npm package with automated CI/CD pipeline.

## Installation

```bash
npm install @ypankratovich/ts-sum-inn
```

## Usage

```typescript
import { sum } from '@ypankratovich/ts-sum-inn';

const result = sum(2, 3); // 5
```

## CI/CD Pipeline

### PR Workflow

Triggered on: `pull_request` (opened, synchronize, reopened, labeled, unlabeled)

**Jobs:**

1. **pr-verify** (always runs):
   - Check branch is up-to-date with main
   - Check version is bumped
   - Lint, build, unit tests

2. **e2e** (runs if `verify` label is present):
   - Full E2E test with npm pack + install

3. **release-candidate** (runs if `publish` label is present):
   - Check version not in npm registry
   - Build dev version (`X.Y.Z-dev-<sha>`)
   - Upload .tgz artifact

### Release Workflow

Triggered when PR with `publish` label is merged to main:

- Lint, test, build
- `npm publish --access public`
- Create git tag `vX.Y.Z`
- Create GitHub Release

### Labels

| Label | Effect |
|-------|--------|
| `verify` | Run E2E tests |
| `publish` | Create release candidate; publish on merge |

## Versioning

- Semver required
- Version must be bumped in PR
- Linear history enforced
- Branch must be up-to-date with main

## Required Secrets

| Secret | Description |
|--------|-------------|
| `NPM_TOKEN` | npm automation token with publish rights |
| `REPO_ADMIN_TOKEN` | Fine-grained PAT with Administration:write |

### Creating NPM_TOKEN

1. Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Generate New Token → Automation
3. Copy token
4. `gh secret set NPM_TOKEN -b"YOUR_TOKEN"`

### Creating REPO_ADMIN_TOKEN

1. Go to https://github.com/settings/tokens?type=beta
2. Generate new token (Fine-grained)
3. Repository access: Select "ts-sum-inn"
4. Permissions:
   - Administration: Read and write
   - Contents: Read and write
   - Metadata: Read
5. `gh secret set REPO_ADMIN_TOKEN -b"YOUR_TOKEN"`

## Bootstrap

Run bootstrap workflow to configure branch protection:

```bash
gh workflow run bootstrap.yml
```

## License

MIT
