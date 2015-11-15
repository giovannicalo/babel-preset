const prefix = (name) => {
	return "babel-plugin-transform-" + name;
};

const plugins = [
	"async-to-generator",
	"class-properties",
	"es2015-destructuring",
	"es2015-modules-commonjs",
	"es2015-parameters",
	"es2015-unicode-regex",
	"exponentiation-operator",
	"function-bind",
	"object-rest-spread",
	"react-jsx"
].map((plugin) => {
	return require(prefix(plugin));
});

module.exports = { plugins };
