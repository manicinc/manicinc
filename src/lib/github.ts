// File: src/lib/github.ts

import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  userAgent: "manicinc-site/1.0",
  timeout: 10000
});

// --- Generic GitHub Utilities ---

/**
 * Fetch basic repository metadata
 */
export async function fetchRepoMetadata(user: string, repo: string) {
  try {
    const { data } = await octokit.repos.get({ owner: user, repo });
    return data;
  } catch (err) {
    console.error(`[GitHub] Failed to fetch repo metadata: ${user}/${repo}`, err);
    return null;
  }
}

export function parseGitHubUrl(url: string): { user: string; repo: string } | null {
    try {
      const match = url.match(/github\.com[:/]([\w-]+)\/([\w.-]+)/);
      if (match) {
        return {
          user: match[1],
          repo: match[2].replace(/\.git$/, "")
        };
      }
      return null;
    } catch {
      return null;
    }
  }

/**
 * Fetch contributors to a repo
 */
export async function fetchRepoContributors(user: string, repo: string) {
  try {
    const { data } = await octokit.repos.listContributors({ owner: user, repo });
    return data;
  } catch (err) {
    console.error(`[GitHub] Failed to fetch contributors for: ${user}/${repo}`, err);
    return [];
  }
}

/**
 * Fetch commit activity over time
 */
export async function fetchRepoCommitActivity(user: string, repo: string) {
  try {
    const { data } = await octokit.repos.getCommitActivityStats({ owner: user, repo });
    return data; // array of 52 weeks
  } catch (err) {
    console.error(`[GitHub] Failed to fetch commit activity: ${user}/${repo}`, err);
    return [];
  }
}

/**
 * Fetch languages used in the repo
 */
export async function fetchRepoLanguages(user: string, repo: string) {
  try {
    const { data } = await octokit.repos.listLanguages({ owner: user, repo });
    return data;
  } catch (err) {
    console.error(`[GitHub] Failed to fetch languages: ${user}/${repo}`, err);
    return {};
  }
}

/**
 * Get all public repos from a given user/org
 */
export async function fetchUserRepos(user: string) {
  try {
    const { data } = await octokit.repos.listForUser({ username: user, per_page: 100 });
    return data;
  } catch (err) {
    console.error(`[GitHub] Failed to fetch repos for user: ${user}`, err);
    return [];
  }
}

/**
 * Detect if repo uses GitHub Pages / CI
 */
export async function fetchRepoPagesStatus(user: string, repo: string) {
  try {
    const { data } = await octokit.repos.getPages({ owner: user, repo });
    return data.status; // 'built', 'building', etc.
  } catch (err) {
    return null;
  }
}
