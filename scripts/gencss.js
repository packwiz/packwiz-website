const fs = require("fs");
const transform = require("lightningcss").transform;

const icons = [
	{
		type: "object",
		colour: [158, 158, 158],
		icon: fs.readFileSync(require.resolve("@material-design-icons/svg/filled/data_object.svg"), {
			encoding: "utf8",
		}),
	},
	{
		type: "string",
		colour: [43, 155, 70],
		icon: fs.readFileSync(require.resolve("@material-design-icons/svg/filled/format_quote.svg"), {
			encoding: "utf8",
		}),
	},
	{
		type: ["number", "integer"],
		colour: [219, 90, 174],
		icon: fs.readFileSync(require.resolve("@material-design-icons/svg/filled/123.svg"), { encoding: "utf8" }),
	},
	{
		type: "boolean",
		colour: [16, 103, 227],
		icon: fs.readFileSync(require.resolve("@material-design-icons/svg/filled/flaky.svg"), { encoding: "utf8" }),
	},
	{
		type: "array",
		colour: [194, 17, 61],
		icon: fs.readFileSync(require.resolve("@material-design-icons/svg/filled/data_array.svg"), {
			encoding: "utf8",
		}),
	},
	{
		type: "null",
		colour: [176, 18, 20],
		icon: fs.readFileSync(require.resolve("@material-design-icons/svg/filled/block.svg"), { encoding: "utf8" }),
	},
];

const licenseComment =
	"/* Icons licensed Apache 2.0 (c) Google (from https://github.com/google/material-design-icons) */";

function genCSS() {
	let gen = `
.json-gen-enhanced-details {
	display: flex;
	align-items: center;
	column-gap: 0.2rem;
}

.json-gen-type {
	padding: 0 0.2rem;
	border-radius: 0.2rem;
	font-style: italic;
}

.json-gen-tag {
	padding: 0 0.2rem;
	border: 0.05rem solid rgb(255, 195, 83);
	background-color: rgba(255, 195, 83, 0.3);
	border-radius: 0.2rem;
}
`;

	for (const icon of icons) {
		const iconName = "json-" + (Array.isArray(icon.type) ? icon.type[0] : icon.type);
		const iconTypes = Array.isArray(icon.type) ? icon.type : [icon.type];
		function eachType(cb) {
			let selectors = [];
			for (type of iconTypes) {
				selectors.push(cb("json-" + type));
			}
			return selectors.join(", ");
		}

		gen += `
:root {
	--md-admonition-icon--${iconName}: url('data:image/svg+xml;charset=utf-8,${icon.icon.replace(
			/\s*width="\d+"\s+height="\d+"\s*/g,
			" "
		)}');
}

${eachType(
	cl => `.md-typeset .admonition.${cl},
.md-typeset details.${cl}`
)} {
	border-color: rgb(${icon.colour.join(", ")});
}

${eachType(
	cl => `.md-typeset .${cl} > .admonition-title,
.md-typeset .${cl} > summary`
)} {
	background-color: rgba(${icon.colour.join(", ")}, 0.1);
}

${eachType(
	cl => `.md-typeset .${cl} > .admonition-title::before,
.md-typeset .${cl} > summary::before`
)} {
	background-color: rgb(${icon.colour.join(", ")});
	-webkit-mask-image: var(--md-admonition-icon--${iconName});
	mask-image: var(--md-admonition-icon--${iconName});
}
`;
	}

	const { code } = transform({
		code: Buffer.from(gen),
		minify: true,
	});

	const output = licenseComment + code.toString();
	fs.mkdirSync("docs/styles/generated", { recursive: true });
	fs.writeFileSync("docs/styles/generated/json-doc.css", output);
}

module.exports = genCSS;
