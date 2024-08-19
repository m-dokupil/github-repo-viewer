import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit, fillIn, click } from '@ember/test-helpers';

module('Acceptance | application', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting / and fetching repos', async function (assert) {
    await visit('/');
    await fillIn('#token', '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');
    await fillIn('#name', 'github');
    await click('button');

    assert.dom('h3').exists();
  });
});
