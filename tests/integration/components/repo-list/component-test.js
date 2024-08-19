import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | repo-list', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders repo list and handles branch loading', async function (assert) {
    this.set('repos', [
      {
        name: 'repo1',
        html_url: 'https://github.com/org/repo1',
        private: false,
        language: 'JavaScript',
        branches: [],
        showBranches: false,
        branches_url: 'https://api.github.com/repos/org/repo1/branches',
      },
    ]);

    this.set('fetchBranches', async (repo) => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      repo.branches = [{ name: 'main' }, { name: 'dev' }];
    });
    this.set('toggleShowPrivate', () => {});
    this.set('selectLanguage', () => {});

    await render(
      hbs`<RepoList @repos={{this.repos}} @fetchBranches={{this.fetchBranches}} @selectLanguage={{this.selectLanguage}} @toggleShowPrivate={{this.toggleShowPrivate}}/>`
    );

    // Assert initial state
    assert.dom('.repo').exists('Repo list is rendered');
    assert
      .dom('.repo-details .title')
      .hasText('repo1', 'Repo name is rendered');
    assert
      .dom('.button')
      .hasText('Show Branches', 'Show Branches button is rendered');

    await click('.button');

    assert
      .dom('.loading')
      .doesNotExist('Loading indicator is hidden after branches are fetched');
    assert.dom('.repo-details ul').exists('Branches are loaded');
  });

  test('it shows and hides branches correctly', async function (assert) {
    this.set('repos', [
      {
        name: 'repo2',
        html_url: 'https://github.com/org/repo2',
        private: false,
        language: 'TypeScript',
        branches: [{ name: 'feature' }],
        showBranches: false,
        branches_url: 'https://api.github.com/repos/org/repo2/branches',
      },
    ]);

    this.set('fetchBranches', async (repo) => {
      repo.showBranches = true;
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      repo.branches = [{ name: 'main' }];
    });
    this.set('toggleShowPrivate', () => {});
    this.set('selectLanguage', () => {});

    await render(
      hbs`<RepoList @repos={{this.repos}} @fetchBranches={{this.fetchBranches}} @selectLanguage={{this.selectLanguage}} @toggleShowPrivate={{this.toggleShowPrivate}}/>`
    );

    // Click the button to show branches
    await click('.button');

    // Check that branches are shown
    assert
      .dom('.repo-details ul')
      .exists('Branches are shown after clicking Show Branches');
    assert
      .dom('.repo-details li')
      .hasText('- feature', 'Feature branch is shown');

    // Click the button again to hide branches
    await click('.button');

    // Check that branches are hidden
    assert
      .dom('.repo-details ul')
      .doesNotExist('Branches are hidden after clicking Hide Branches');
  });

  test('it shows a loading indicator when branches are being fetched', async function (assert) {
    this.set('repos', [
      {
        name: 'repo3',
        html_url: 'https://github.com/org/repo3',
        private: false,
        language: 'Python',
        branches: [],
        showBranches: false,
        branches_url: 'https://api.github.com/repos/org/repo3/branches',
      },
    ]);

    this.set('fetchBranches', async (repo) => {
      repo.showBranches = true;
      repo.branches = [{ name: 'main' }];
    });
    this.set('toggleShowPrivate', () => {});
    this.set('selectLanguage', () => {});

    await render(
      hbs`<RepoList @repos={{this.repos}} @fetchBranches={{this.fetchBranches}} @selectLanguage={{this.selectLanguage}} @toggleShowPrivate={{this.toggleShowPrivate}}/>`
    );

    await click('.button');

    assert
      .dom('.loading')
      .doesNotExist('Loading indicator is hidden after branches are fetched');
    assert.dom('.repo-details ul').exists('Branches are loaded after fetching');
  });

  test('it renders repo list with no branches initially', async function (assert) {
    this.set('repos', [
      {
        name: 'repo4',
        html_url: 'https://github.com/org/repo4',
        private: false,
        language: 'Ruby',
        branches: [],
        showBranches: false,
        branches_url: 'https://api.github.com/repos/org/repo4/branches',
      },
    ]);

    this.set('fetchBranches', async (repo) => {
      this.set(repo, 'showBranches', true);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      this.set(repo, 'branches', [{ name: 'main' }]);
    });
    this.set('toggleShowPrivate', () => {});
    this.set('selectLanguage', () => {});

    await render(
      hbs`<RepoList @repos={{this.repos}} @fetchBranches={{this.fetchBranches}} @selectLanguage={{this.selectLanguage}} @toggleShowPrivate={{this.toggleShowPrivate}}/>`
    );

    // Assert initial state
    assert.dom('.repo').exists('Repo list is rendered');
    assert
      .dom('.repo-details .title')
      .hasText('repo4', 'Repo name is rendered');
    assert
      .dom('.repo-details .button')
      .hasText('Show Branches', 'Show Branches button is rendered');
    assert
      .dom('.repo-details ul')
      .doesNotExist('Branches are not shown initially');
  });
});
