import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class RepoListComponent extends Component {
  @tracked showPrivate = true;
  @tracked selectedLanguage = '';

  get showLoading() {
    return this.args.isLoading && this.args.repos.length === 0;
  }
}
