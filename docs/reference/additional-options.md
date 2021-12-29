# Additional options
Additional options can be configured in the `[options]` section of `pack.toml`, as follows:

- `mods-folder` The folder to save mod metadata files into, for the install commands
- `acceptable-game-versions` A list of additional Minecraft versions to accept when installing or updating mods (see [Adding mods](../tutorials/creating/adding-mods.md))
- `no-internal-hashes` If this is set to true, packwiz will not generate hashes of local files, to prevent merge conflicts and inconsistent hashes when using git/etc.
	- `packwiz refresh --build` can be used in this mode to generate internal hashes for distributing the pack with [packwiz-installer]