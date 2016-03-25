const prefix = (name) => {
	return `babel-plugin-transform-${name}`;
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
	"react-jsx",
	"runtime"
].map((plugin) => {
	return require(prefix(plugin));
});

plugins.push(require(prefix("decorators-legacy")).default);

module.exports = { plugins };
