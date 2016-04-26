import * as Babel from "babel-core";
import Chai from "chai";

Chai.config.showDiff = true;

const expect = Chai.expect;

const config = {
	compact: true,
	plugins: [
		"transform-async-to-generator",
		"transform-class-properties",
		"transform-decorators-legacy",
		"transform-es2015-destructuring",
		"transform-es2015-modules-commonjs",
		"transform-exponentiation-operator",
		"transform-function-bind",
		"transform-object-rest-spread",
		"transform-react-jsx"
	]
};

const normalize = (code) => {
	return code.replace(/\s|"use strict";/g, "");
};

const transform = (code) => {
	return Babel.transform(code, config).code;
};

const test = (input, isSupported, isNative, custom) => {
	if (input) {
		if (isSupported) {
			const transformed = transform(input);
			if (isNative) {
				expect(normalize(transformed)).to.equal(normalize(input));
			} else {
				expect(normalize(transformed)).not.to.equal(normalize(input));
			}
			expect(() => {
				eval(transformed); // eslint-disable-line no-eval
			}).not.to.throw();
		} else {
			expect(() => {
				eval(transform(input)); // eslint-disable-line no-eval
			}).to.throw();
		}
	}
	if (typeof custom === "function") {
		custom();
	}
};

describe("Syntax", () => {
	describe("Node", () => {
		[
			["array inclusion check", "[\"foo\"].includes(\"foo\");"],
			["arrow functions", "const foo = () => {};"],
			["classes", `
				let Foo = class Foo {
					bar() {}
				};
				let Bar = class Bar extends Foo {
					foo() {
						super.bar();
					}
				};
			`],
			["computed properties", "const foo = { [\"bar\"]: \"foo\" };"],
			["default parameters", "const foo = (bar = \"foo\") => {};"],
			["destructuring parameters", "const foo = ({ bar }) => {};"],
			["for-of loops", "for (const foo of [\"bar\"]) {}"],
			["generators", `
				function * foo() {
					yield "bar";
				}
			`],
			["object prototypes", `
				const foo = { bar() {} };
				const bar = {
					foo() {
						super.bar();
					}
				};
				Object.setPrototypeOf(bar, foo);
			`],
			["rest parameters", `
				const foo = (...bar) => {
					foo(bar);
				};
			`],
			["scoped variables", `
				const foo = "bar";
				let bar = "foo";
			`],
			["shorthand object properties", `
				const foo = "bar";
				const bar = { foo };
			`],
			["sticky regular expressions", "\"foo\".match(/foo/y);"],
			["symbols", "const foo = Symbol();"],
			["template strings", `const foo = \`${"foo"}bar\`;`],
			["unicode literals", null, () => {
				expect("\u6b7b").to.equal("死");
			}],
			["unicode regular expressions", "\"死\".match(/死/u);"]
		].forEach((feature) => {
			it(`should support ${feature[0]}`, () => {
				test(feature[1], true, true, feature[2]);
			});
		});
	});
	describe("Babel", () => {
		[
			["JSX", `
				import React from "./react";
				class Foo extends React.Component {}
				<Foo />;
			`],
			["asynchronous functions", `
				const foo = async() => {
					await new Promise((resolve) => {
						resolve();
					})
				}
			`],
			["class properties", `
				let Foo = class Foo {
					foo = "bar";
					static bar = "foo";
				};
			`],
			["decorators", `
				function foo() {
					return () => {};
				}
				@foo()
				class Bar {}
			`],
			["destructuring", `
				const foo = { bar: "foo" };
				const { bar } = foo;
			`],
			["exponentiation operator", "const foo = 1 ** 1;"],
			["function bind operator", `
				const foo = { bar() {} };
				::foo.bar();
			`],
			["modules", "import Empty from \"./empty\";"],
			["rest array destructuring", `
				const foo = ["foo", "bar"];
				const [bar, ...rest] = foo;
			`],
			["rest object destructuring", `
				const foo = { bar: "foo", foo: "bar" };
				const { bar, ...rest } = foo;
			`]
		].forEach((feature) => {
			it(`should support ${feature[0]}`, () => {
				test(feature[1], true, false, feature[2]);
			});
		});
	});
	describe("Nothing", () => {
		[
			["anonymous function names", null, () => {
				const foo = () => {
					// Do nothing
				};
				expect(foo.name).not.to.equal("foo");
			}]
		].forEach((feature) => {
			it(`should support ${feature[0]}`, () => {
				test(feature[1], false, false, feature[2]);
			});
		});
	});
});
