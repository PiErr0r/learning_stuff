import os_path from 'path';
import fs from 'fs';
import { repoFile } from "@/repo_helpers";

class Config {
	constructor() {

	}

	read(path: string): void {}
	get(a: string, b: string): number { return 0; }
}

class GitRepository {
	worktree: string;
	gitdir: string;
	conf: Config;
	constructor(path: string, force: boolean) {
		this.worktree = path;
		this.gitdir = os_path.join(path, '.git');

		if (!force || fs.existsSync(this.gitdir)) {
			throw new Error(`Not a Git repository ${this.worktree}.`);
		}

		this.conf = new Config();
		const cf = repoFile(this, false, 'config');

		if (cf && fs.existsSync(cf)) {
			this.conf.read(cf);
		} else if (!force) {
			throw new Error("Configuration file missing.");
		}

		if (!force) {
			const v = this.conf.get("core", "repositoryformatversion");
			if (v !== 0) {
				throw new Error(`Unsupported repositoryformatversion version ${v}`);
			}
		}
	}
}

export { GitRepository };