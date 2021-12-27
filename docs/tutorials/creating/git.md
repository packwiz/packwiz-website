# Usage with Git

- On Windows, line ending conversion causes the hashes to change when files are uploaded to Git, so you'll get a ton of errors when trying to install the pack
	- You'll want to add a `.gitattributes` file in the root folder with the content `* -text` - this disables line ending conversion
	- If you have existing files committed to Git, you'll need to run `git rm --cached -r .` then `git add .` to re-add them after adding .gitattributes
- You'll also want a `.packwizignore` file containing `.git/**` and `.gitattributes` (same format as `.gitignore`) so that Git metadata isn't included in the pack index
