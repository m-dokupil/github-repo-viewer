import Controller from '@ember/controller';
import { action, set } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import fetch from 'fetch';

export default class IndexController extends Controller {
  @tracked token = '';
  @tracked orgName = '';
  @tracked repos = [];
  @tracked showPrivate = true;
  @tracked selectedLanguage = '';
  @tracked languages = [];
  @tracked errorMessage = '';
  @tracked isLoading = false;
  @tracked selectedSorting = '';

  @action
  async fetchRepos() {
    this.errorMessage = '';

    // Basic validation for token and organization name
    if (!this.token.trim() || !this.orgName.trim()) {
      this.errorMessage =
        'Please fill in both the GitHub Access Token and Organization Name.';
      return;
    }

    try {
      this.isLoading = true;
      const response = await fetch(
        `https://api.github.com/orgs/${this.orgName}/repos`,
        {
          headers: {
            Authorization: `token ${this.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API returned an error: ${response.statusText}`);
      }

      const repos = await response.json();

      this.repos = repos;
      this.languages = [
        ...new Set(repos.map((repo) => repo.language).filter(Boolean)),
      ];
    } catch (error) {
      this.errorMessage = `Please check your GitHub Access Token and Organization Name. GitHub API returned an error`;
    } finally {
      this.isLoading = false;
    }
  }

  @action
  async fetchBranches(repo) {
    try {
      const response = await fetch(repo.branches_url.replace('{/branch}', ''), {
        headers: {
          Authorization: `token ${this.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch branches for repo ${repo.name}: ${response.statusText}`
        );
      }

      const branches = await response.json();
      set(repo, 'branches', branches);
    } catch (error) {
      this.errorMessage = `Error: ${error.message}`;
    }
  }

  get filteredRepos() {
    const reposFiltered = this.repos.filter((repo) => {
      return (
        (this.showPrivate || !repo.private) &&
        (!this.selectedLanguage || repo.language === this.selectedLanguage)
      );
    });

    console.log({
      selectedSorting: this.selectedSorting,
    })

    reposFiltered.sort((a, b) => {
      if (this.selectedSorting === 'asc') {
        return a.stargazers_count - b.stargazers_count;
      } else if (this.selectedSorting === 'desc') {
        return b.stargazers_count - a.stargazers_count;
      }
    })

    return reposFiltered;

  }

  @action
  updateToken(event) {
    this.token = event.target.value;
  }

  @action
  updateOrgName(event) {
    this.orgName = event.target.value;
  }

  @action
  toggleShowPrivate(event) {
    this.showPrivate = event.target.checked;
  }

  @action
  selectLanguage(event) {
    this.selectedLanguage = event.target.value;
  }

  @action
  handleKeyup(event) {
    if (event.key === 'Enter') {
      this.fetchRepos();
    }
  }

  @action
  selectStarSorting(event) {
    this.selectedSorting = event.target.value;
  }
}
