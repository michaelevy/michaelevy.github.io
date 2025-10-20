import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export default function (eleventyConfig) {
  // Find and copy any `jpg` files, maintaining directory structure.
  eleventyConfig.addPassthroughCopy("**/*.css");
  eleventyConfig.addPassthroughCopy("**/*.js");
  eleventyConfig.addPassthroughCopy("**/*.ttf");
  eleventyConfig.addPassthroughCopy("**/*.otf");
  eleventyConfig.addPlugin(eleventyImageTransformPlugin);
}
