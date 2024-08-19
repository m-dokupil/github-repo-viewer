import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class RepoItemComponent extends Component {
  @tracked showBranches = false;
  @tracked isBranchesLoading = false;

  get repoBranches() {
    return this.args.repo.branches;
  }

  @action
  async toggleBranches() {
    try {
      if (this.repoBranches) return;

      this.isBranchesLoading = true;
      await this.args.fetchBranches(this.args.repo);
    } catch (error) {
      console.error(error);
    } finally {
      this.isBranchesLoading = false;
      this.showBranches = !this.showBranches;
    }
  }
}
