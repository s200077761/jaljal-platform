# Jaljal AI Platform - GitLab Repository Setup

## Repository Information
- **Name**: jaljal-platform
- **Group**: jaljal-ai
- **Description**: منصة جلاجل للذكاء الاصطناعي المفتوحة - Advanced open-source AI platform for model management and development
- **Language**: TypeScript
- **Framework**: Next.js 15
- **License**: MIT

## Repository Structure
```
jaljal-platform/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
│   ├── app/
│   ├── components/
│   └── lib/
├── public/
├── docs/
├── package.json
├── README.md
└── LICENSE
```

## Setup Instructions

### 1. Create GitLab Repository
```bash
# Create repository on GitLab
glab repo create jaljal-ai/jaljal-platform --public --description "منصة جلاجل للذكاء الاصطناعي المفتوحة - Advanced open-source AI platform"

# Add remote origin
git remote add gitlab https://gitlab.com/jaljal-ai/jaljal-platform.git

# Push to GitLab
git push -u gitlab main
```

### 2. Configure GitLab CI/CD
Create `.gitlab-ci.yml`:
```yaml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

test:
  stage: test
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run lint
    - npm test
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'

build:
  stage: build
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - .next/
    expire_in: 1 hour

deploy:
  stage: deploy
  image: node:$NODE_VERSION
  script:
    - echo "Deploying Jaljal AI Platform..."
  only:
    - main
```

### 3. Configure GitLab Settings
- Enable GitLab Pages for documentation
- Set up protected branches
- Configure merge request approvals
- Set up security scanning
- Enable container registry

### 4. Branch Strategy
- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: Feature branches
- `hotfix/*`: Emergency fixes

## GitLab Commands
```bash
# Create issue
glab issue create --title "Feature Request" --description "Description of feature"

# Create merge request
glab mr create --title "New Feature" --description "Description of changes"

# Create release
glab release create v1.0.0 --title "Jaljal AI Platform v1.0.0" --notes "Initial release"
```

## GitLab CI/CD Features
- Automated testing on merge requests
- Build verification
- Deployment automation
- Security scanning with SAST
- Container scanning
- Dependency scanning

## GitLab Integration
- Docker registry for container images
- GitLab Pages for documentation
- Kubernetes integration
- Monitoring with Prometheus
- Error tracking with Sentry

## Repository Badges
[![pipeline status](https://gitlab.com/jaljal-ai/jaljal-platform/badges/main/pipeline.svg)](https://gitlab.com/jaljal-ai/jaljal-platform/-/commits/main)
[![coverage report](https://gitlab.com/jaljal-ai/jaljal-platform/badges/main/coverage.svg)](https://gitlab.com/jaljal-ai/jaljal-platform/-/commits/main)