const prefix = (name) => {
	return `babel-plugin-transform-${name}`;
};

const plugins = [
	"async-to-generator",
	"class-properties",
	"es2015-modules-commonjs",
	"function-bind",
	"object-rest-spread",
	"react-jsx"
].map((plugin) => {
	return require(prefix(plugin));
});

plugins.push(require(prefix("decorators-legacy")).default);

module.exports = { plugins };
