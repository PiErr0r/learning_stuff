import { ArgumentParser } from "@/argument_parser";

const cmd_add = (args: ArgumentParser) => { process.stdout.write('add\n') };
const cmd_cat_file = (args: ArgumentParser) => { process.stdout.write('cat_file\n') };
const cmd_checkout = (args: ArgumentParser) => { process.stdout.write('checkout\n') };
const cmd_commit = (args: ArgumentParser) => { process.stdout.write('commit\n') };
const cmd_hash_object = (args: ArgumentParser) => { process.stdout.write('hash_object\n') };
const cmd_init = (args: ArgumentParser) => { process.stdout.write('init\n') };
const cmd_log = (args: ArgumentParser) => { process.stdout.write('log\n') };
const cmd_ls_files = (args: ArgumentParser) => { process.stdout.write('ls_files\n') };
const cmd_ls_tree = (args: ArgumentParser) => { process.stdout.write('ls_tree\n') };
const cmd_merge = (args: ArgumentParser) => { process.stdout.write('merge\n') };
const cmd_rebase = (args: ArgumentParser) => { process.stdout.write('rebase\n') };
const cmd_rev_parse = (args: ArgumentParser) => { process.stdout.write('rev_parse\n') };
const cmd_rm = (args: ArgumentParser) => { process.stdout.write('rm\n') };
const cmd_show_ref = (args: ArgumentParser) => { process.stdout.write('show_ref\n') };
const cmd_tag = (args: ArgumentParser) => { process.stdout.write('tag\n') };

export {
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
};