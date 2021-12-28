const yaml = require("js-yaml");
const fs = require("fs");
const { execSync } = require("child_process");
const { green } = require("kleur/colors");

console.log(green("Installing packwiz..."));
execSync("go install github.com/packwiz/packwiz@latest");

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
	mkdocsConfig.nav.map(async el => {
		if (el.Reference != null) {
			await Promise.all(
				el.Reference.map(async el => {
					if (el.Commands != null) {
						el.Commands = [];

						const files = await fs.promises.readdir(
							"./docs/reference/commands/"
						);
						for (const file of files) {
							let ref = {};
							let name = file.slice(0, -3).replace(/_/g, " ");
							if (name == "overview") {
								name = "Overview";
							}
							ref[name] = "reference/commands/" + file;
							el.Commands.push(ref);
						}
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
	execSync("go install github.com/grafana/json-schema-docs@latest");

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
