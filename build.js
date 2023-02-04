const yaml = require("js-yaml");
const fs = require("fs");
const { execSync } = require("child_process");
const { green } = require("kleur/colors");
const path = require("path");

console.log(green("Installing packwiz..."));
execSync("go install github.com/packwiz/packwiz@latest");

console.log(green("Cleaning old packwiz cli docs..."));
fs.rmSync("./docs/reference/commands", { recursive: true });

console.log(green("Outputting packwiz cli docs..."));
execSync("packwiz utils markdown --dir=docs/reference/commands", {
	env: {
		...process.env,
		PATH: `${process.env.GOPATH}/bin:${process.env.PATH}`,
	},
});

console.log(green("Massaging packwiz cli docs into mkdocs compatible form..."));
let mkdocsConfig = yaml.load(fs.readFileSync("mkdocs-base.yml", "utf8"));
Promise.all(
	// Generate navigation
	mkdocsConfig.nav.map(async el => {
		if (el.Reference != null) {
			await Promise.all(
				el.Reference.map(async el => {
					if (el.Commands != null) {
						let commands = {};

						const base = "./docs/reference/commands/";
						const files = await fs.promises.readdir(base);
						for (const file of files) {
							// Move to path with subfolders
							let fileRenamed = file.slice(0, -3).replace(/_/g, "/") + "/index.md";
							await fs.promises.mkdir(path.dirname(base + fileRenamed), {recursive: true});
							await fs.promises.rename(base + file, base + fileRenamed);

							let fileContents = await fs.promises.readFile(base + fileRenamed, { encoding: "utf8" });
							// Update links
							fileContents = fileContents.replace(/\]\((.+\.md)\)/g, (_, dest) => {
								let depth = file.split("_").length;
								return `](${"../".repeat(depth)}${dest.slice(0, -3).replace(/_/g, "/")}/index.md)`;
							});
							fileContents = fileContents.replace(/^(#+) (.+)$/gm, (_, headingMarker, headingText) => {
								if (headingMarker.length == 2) {
									// Turn title into mkdocs title
									return `---
title: "${headingText}"
---`;
								} else {
									// Promote all other headings
									return `${"#".repeat(headingMarker.length - 1)} ${headingText}`;
								}
							});
							await fs.promises.writeFile(base + fileRenamed, fileContents);

							// Store nav hierarchy
							let name = file.slice(0, -3).replace(/_/g, " ").split(" ");
							let curCmd = commands;
							for (let i = 0; i < name.length; i++) {
								if (curCmd[name[i]] == null) {
									curCmd[name[i]] = {};
								}
								curCmd = curCmd[name[i]];
							}
							curCmd["_index"] = "reference/commands/" + fileRenamed;
						}

						/* Wrangle nav hierarchy into the format mkdocs likes
						*/

						// Flatten top level
						let commandsFlattened = {};
						for (const key of Object.keys(commands)) {
							for (const subkey of Object.keys(commands[key])) {
								if (subkey == "_index") {
									commandsFlattened[key] = commands[key][subkey];
								} else {
									commandsFlattened[key + " " + subkey] = commands[key][subkey];
								}
							}
						}

						function objsToArrays(obj, key) {
							console.assert(typeof obj == "object", "%s not an object", obj);
							if (key == "_index" || typeof obj[key] == "string") {
								console.assert(typeof obj[key] == "string", "%s not a string", obj);
								return obj[key];
							}
							const res = {};
							if (Object.keys(obj[key]).length == 1 && obj[key]["_index"] != null) {
								res[key] = obj[key]["_index"];
							} else {
								res[key] = Object.keys(obj[key]).map(k => objsToArrays(obj[key], k));
							}
							return res;
						}

						el.Commands = Object.keys(commandsFlattened).map(k => objsToArrays(commandsFlattened, k));
					}
				})
			);
		}
		return el;
	})
).then(nav => {
	mkdocsConfig.nav = nav;
	fs.writeFileSync("mkdocs.yml", yaml.dump(mkdocsConfig));

	console.log(green("Installing json-schema-docs..."));
	execSync("go install github.com/marcusolsson/json-schema-docs@latest");

	console.log(green("Adding the pack-format pages from packwiz-spec"));
	const schemas = ["pack", "index", "mod"];
	for (let schema of schemas) {
		execSync(
			`json-schema-docs -schema ./packwiz-spec/schemas/${schema}.json > docs/reference/pack-format/${schema}-toml.md`,
			{
				env: {
					...process.env,
					PATH: `${process.env.GOPATH}/bin:${process.env.PATH}`,
				},
			}
		);
	}

	console.log(green("Building docs!"));
	execSync("mkdocs build");
	console.log(green("Successfully built docs!"));
});
