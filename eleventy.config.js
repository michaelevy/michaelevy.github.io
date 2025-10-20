import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("**/*.css");
  eleventyConfig.addPassthroughCopy("**/favicon.png");
  eleventyConfig.addPassthroughCopy("**/*.ttf");
  eleventyConfig.addPassthroughCopy("**/*.otf");
  eleventyConfig.addPlugin(eleventyImageTransformPlugin);
}
