import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | repo-item', function (hooks) {
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

    // Click the button to show branches
    await click('.button');

    // Assert branches are loaded
    assert.dom('.repo-details ul').exists('Branches are loaded');
  });
});
