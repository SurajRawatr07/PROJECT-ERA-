export interface ParsedGitHubRepo {
  valid: boolean;
  githubUrl: string;
  owner: string;
  repositoryName: string;
  advancedVerificationAvailable: boolean;
  message?: string;
}

const GITHUB_REPO_REGEX = /^https?:\/\/(www\.)?github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)\/?$/;

/**
 * Validates a GitHub repository URL and extracts owner and repositoryName.
 * Does NOT fabricate commit counts or fake metrics when GitHub API credentials are absent.
 */
export function parseAndValidateGitHubUrl(rawUrl?: string): ParsedGitHubRepo {
  const trimmed = (rawUrl || '').trim().replace(/\.git$/, '');
  if (!trimmed) {
    return {
      valid: false,
      githubUrl: '',
      owner: '',
      repositoryName: '',
      advancedVerificationAvailable: Boolean(process.env.GITHUB_TOKEN),
      message: 'No GitHub URL provided.'
    };
  }

  const match = trimmed.match(GITHUB_REPO_REGEX);
  if (!match) {
    return {
      valid: false,
      githubUrl: trimmed,
      owner: '',
      repositoryName: '',
      advancedVerificationAvailable: Boolean(process.env.GITHUB_TOKEN),
      message: 'Invalid GitHub repository URL. Expected https://github.com/<owner>/<repository>'
    };
  }

  const owner = match[2];
  const repositoryName = match[3];
  const normalizedUrl = `https://github.com/${owner}/${repositoryName}`;

  return {
    valid: true,
    githubUrl: normalizedUrl,
    owner,
    repositoryName,
    advancedVerificationAvailable: Boolean(process.env.GITHUB_TOKEN),
    message: process.env.GITHUB_TOKEN
      ? 'GitHub API credentials configured.'
      : 'Repository URL validated. Advanced GitHub API commit verification is unavailable until GITHUB_TOKEN is configured.'
  };
}
