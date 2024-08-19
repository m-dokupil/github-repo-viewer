import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { set } from '@ember/object';
import { run } from '@ember/runloop';

module('Unit | Controller | index', function (hooks) {
  setupTest(hooks);

  test('it handles token and orgName validations', function (assert) {
    let controller = this.owner.lookup('controller:index');

    // Test empty fields
    controller.token = '';
    controller.orgName = '';
    controller.fetchRepos();
    assert.equal(
      controller.errorMessage,
      'Please fill in both the GitHub Access Token and Organization Name.',
      'Displays error message for empty fields'
    );

    // Test valid fields
    controller.token = 'valid-token';
    controller.orgName = 'emberjs';
    controller.errorMessage = '';
    run(() => controller.fetchRepos());
    assert.equal(controller.errorMessage, '', 'No error message should be set');
  });

  test('it filters repos by language and visibility', function (assert) {
    let controller = this.owner.lookup('controller:index');

    controller.repos = [
      { name: 'Repo1', private: false, language: 'JavaScript' },
      { name: 'Repo2', private: true, language: 'TypeScript' },
      { name: 'Repo3', private: false, language: 'JavaScript' },
    ];

    controller.selectedLanguage = 'JavaScript';
    controller.showPrivate = false;

    assert.equal(
      controller.filteredRepos.length,
      2,
      'Filters repos correctly by language and visibility'
    );
  });
});
