# Getting started

-   Run `packwiz init` to create a modpack in the current folder
-   Run `packwiz curseforge import [zip path]` to import from a CurseForge modpack
-   Run `packwiz refresh` to update the index of mods
-   Run `packwiz curseforge install [mod]` to install a mod from CurseForge
-   Run `packwiz modrinth install [mod]` to install a mod from Modrinth
-   Run `packwiz update [mod]` to update a mod
-   Run `packwiz update --all` to update all the mods in the modpack
-   Run `packwiz curseforge export` to export the modpack in the format supported by the CurseForge Launcher
-   Run `packwiz serve` to start a local HTTP server running the pack - which [packwiz-installer] can install from
-   Run `packwiz curseforge detect` to detect files that are available on CurseForge and make them downloaded from there
-   Use the `--help` flag for more information about any command

## Using a modpack

See the [packwiz-installer] tutorial documentation for instructions on both client and server use.

### Resources

-   See https://suspicious-joliot-f51f5c.netlify.app/index.html for some documentation
    -   I am in the process of rewriting the format, so there may be information there that is outdated
-   See https://github.com/Fibercraft/Temporary-Modpack for an example of an existing modpack using packwiz
    -   This repository can be published to a service like Github Pages or Netlify and installed using [packwiz-installer]
    -   This repository also shows the use of `.gitattributes` and `.packwizignore` to disable line ending modification (so that the hashes are correct) and ignore git-specific files
-   https://modfest.net/fallfest/1.16/server/ is also a good example of a MultiMC instance that uses [packwiz-installer]

### Tips

-   There are some useful aliases, like `packwiz cf` => `packwiz curseforge` and `packwiz mr` => `packwiz modrinth`
-   The `packwiz cf install` command supports multiple formats:
    -   `packwiz cf install sodium` (by slug)
    -   `packwiz cf install https://www.curseforge.com/minecraft/mc-mods/sodium` (by mod page URL)
    -   `packwiz cf install https://www.curseforge.com/minecraft/mc-mods/sodium/files/3067101` (by file page URL)
    -   `packwiz cf install Sodium` (by search)
    -   `packwiz cf install --addon-id 394468 --file-id 3067101` (if all else fails)
-   If files aren't being found, try running the `packwiz refresh` command to update the index!

## Options

-   Additional options can be configured in the `[options]` section of `pack.toml`, as follows:
    -   `mods-folder` The folder to save mod metadata files into, for the install commands
    -   `acceptable-game-versions` A list of additional Minecraft versions to accept when installing or updating mods
    -   `no-internal-hashes` If this is set to true, packwiz will not generate hashes of local files, to prevent merge conflicts and inconsistent hashes when using git/etc.
        -   `packwiz refresh --build` can be used in this mode to generate internal hashes for distributing the pack with [packwiz-installer]


[packwiz-installer]: packwiz-installer.md
