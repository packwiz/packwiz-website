# Publishing to Modrinth

Exporting a Modrinth pack is as simple as running `packwiz modrinth export` - this gives you a `.mrpack` in your pack folder that you can upload to Modrinth!

Since this pack format doesn't support side-only mods, packwiz can't create a pack that differs between server and client, and will export a pack for Minecraft clients (containing mods with side `client` or `both`). Mods without the necessary Modrinth metadata (such as those installed from CurseForge) will be placed as JARs into the modpack zip; make sure that you have the licenses for these mods [as it is your responsibility as a pack creator to](https://support.modrinth.com/en/articles/8797527-obtaining-modpack-permissions).

Be wary of including files that you don't want (the `packwiz` executable, and the modpack zip itself) in the pack!

The Modrinth pack format doesn't really support optional mods. The user won't be prompted for optional mods, and unlike with CurseForge, they'll be included in the modpack file (even if they default to being disabled!)

See [the corresponding reference page](../../reference/commands/packwiz/modrinth/export/index.md) for less information. <!-- TODO: add documentation to CLI itself!! -->