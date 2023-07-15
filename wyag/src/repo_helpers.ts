import { GitRepository } from "@/git_repository";
import os_path from "path";
import fs from "fs";

function repoPath(repo: GitRepository, ...path: string[]): string {
	return os_path.join(repo.gitdir, ...path);
}

function repoFile(repo: GitRepository, mkdir: boolean = false, ...path: string[]): string|null {
	if (repoDir(repo, mkdir, ...path.slice(0, path.length - 1))) {
		return repoPath(repo, ...path)
	}
	return null;
}

function repoDir(repo: GitRepository, mkdir: boolean, ...path: string[]): string|null|never {
	const pathname = repoPath(repo, ...path);
	if (fs.existsSync(pathname)) {
		if (fs.statSync(pathname).isDirectory()) {
			return pathname;
		} else {
			throw new Error(`Not a directory ${pathname}.`);
		}
	}

	if (mkdir) {
		fs.mkdirSync(pathname);
		return pathname;
	} else {
		return null;
	}
}

export {
	repoPath,
	repoFile,
	repoDir
}