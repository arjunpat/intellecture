
export default class Poll {
  private prompt: string;
  private options: string[];
  private voters: Set<string>[] = [];
  private running: boolean = true;
  private uid: string;
  private elapsed: number;

  constructor(uid: string, elapsed: number, prompt: string, options: string[]) {
    this.prompt = prompt;
    this.options = options;
    this.uid = uid;
    this.elapsed = elapsed;

    this.voters.length = this.options.length;
    for (let i = 0; i < this.voters.length; i++) {
      this.voters[i] = new Set<string>();
    }
  }

  hasVoted(account_uid: string) {
    for (let i = 0; i < this.voters.length; i++) {
      if (this.voters[i].has(account_uid))
        return true;
    }
    return false;
  }

  vote(account_uid: string, choice: number) {
    if (this.hasVoted(account_uid) || choice >= this.options.length || !this.running)
      return false;
    this.voters[choice].add(account_uid);
    return true;
  }

  getVoterSummary() {
    return this.voters.map(e => e.size);
  }

  end() {
    this.running = false;
  }

  isRunning() { return this.running; }
  getPrompt() { return this.prompt; }
  getUid() { return this.uid; }
  getElapsed() { return this.elapsed; }
  getOptions() { return this.options; }
}
