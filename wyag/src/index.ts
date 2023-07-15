
import {
  cmd_add
, cmd_cat_file
, cmd_checkout
, cmd_commit
, cmd_hash_object
, cmd_init
, cmd_log
, cmd_ls_files
, cmd_ls_tree
, cmd_merge
, cmd_rebase
, cmd_rev_parse
, cmd_rm
, cmd_show_ref
, cmd_tag
} from "@/cmds";
import { ArgumentParser } from "@/argument_parser";

const main = () => {
	const args = new ArgumentParser(process.argv.slice(1));
	switch (args.command) {
		case "add"         : cmd_add(args); break;
	    case "cat-file"    : cmd_cat_file(args); break;
	    case "checkout"    : cmd_checkout(args); break;
	    case "commit"      : cmd_commit(args); break;
	    case "hash-object" : cmd_hash_object(args); break;
	    case "init"        : cmd_init(args); break;
	    case "log"         : cmd_log(args); break;
	    case "ls-files"    : cmd_ls_files(args); break;
	    case "ls-tree"     : cmd_ls_tree(args); break;
	    case "merge"       : cmd_merge(args); break;
	    case "rebase"      : cmd_rebase(args); break;
	    case "rev-parse"   : cmd_rev_parse(args); break;
	    case "rm"          : cmd_rm(args); break;
	    case "show-ref"    : cmd_show_ref(args); break;
	    case "tag"         : cmd_tag(args); break;
	    default: {
	    	args.usage(process.argv[0]);
	    }
	}
}

main();