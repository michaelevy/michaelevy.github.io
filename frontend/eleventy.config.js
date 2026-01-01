import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";

export default function (eleventyConfig) {
  // Copy all static assets from public/
  eleventyConfig.addPassthroughCopy("public");
  
  // Copy CSS and JS
  eleventyConfig.addPassthroughCopy("src/**/*.css");
  eleventyConfig.addPassthroughCopy("src/**/*.js");

  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(eleventyImageTransformPlugin);

  // Add safe filter for Liquid (allows raw HTML)
  eleventyConfig.addFilter("safe", function(content) {
    return content;
  });

  // Add filter to render Contentful rich text
  eleventyConfig.addFilter("renderRichText", function(richText) {
    if (!richText) return '';
    
    // Handle already-rendered HTML
    if (typeof richText === 'string') {
      return richText;
    }

    // Contentful rich text format
    if (richText.nodeType === 'document' && richText.content) {
      return renderNodes(richText.content);
    }

    return '';
  });

  function renderNodes(nodes) {
    if (!Array.isArray(nodes)) return '';
    return nodes.map(node => renderNode(node)).join('');
  }

  function renderNode(node) {
    if (!node || !node.nodeType) return '';

    switch (node.nodeType) {
      case 'paragraph':
        return `<p>${renderNodes(node.content || [])}</p>`;
      case 'heading-1':
        return `<h1>${renderNodes(node.content || [])}</h1>`;
      case 'heading-2':
        return `<h2>${renderNodes(node.content || [])}</h2>`;
      case 'heading-3':
        return `<h3>${renderNodes(node.content || [])}</h3>`;
      case 'heading-4':
        return `<h4>${renderNodes(node.content || [])}</h4>`;
      case 'heading-5':
        return `<h5>${renderNodes(node.content || [])}</h5>`;
      case 'heading-6':
        return `<h6>${renderNodes(node.content || [])}</h6>`;
      case 'blockquote':
        return `<blockquote>${renderNodes(node.content || [])}</blockquote>`;
      case 'unordered-list':
        return `<ul>${renderNodes(node.content || [])}</ul>`;
      case 'ordered-list':
        return `<ol>${renderNodes(node.content || [])}</ol>`;
      case 'list-item':
        return `<li>${renderNodes(node.content || [])}</li>`;
      case 'hr':
        return '<hr>';
      case 'text':
        return renderTextNode(node);
      case 'hyperlink':
        const url = node.data?.uri || '#';
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${renderNodes(node.content || [])}</a>`;
      default:
        if (node.content) {
          return renderNodes(node.content);
        }
        return '';
    }
  }

  function renderTextNode(node) {
    let text = node.value || '';
    
    // Escape HTML
    text = text.replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');

    // Apply marks (bold, italic, etc.)
    if (node.marks && node.marks.length > 0) {
      node.marks.forEach(mark => {
        switch (mark.type) {
          case 'bold':
            // Bold text becomes spoiler
            text = `<span class="spoiler" onclick="this.classList.toggle('revealed')">${text}</span>`;
            break;
          case 'italic':
            text = `<em>${text}</em>`;
            break;
          case 'underline':
            text = `<u>${text}</u>`;
            break;
          case 'code':
            text = `<code>${text}</code>`;
            break;
        }
      });
    }

    return text;
  }

  // Create a collection of published lab experiments
  eleventyConfig.addCollection("publishedExperiments", function(collectionApi) {
    return collectionApi.getFilteredByTag("labExperiment")
      .filter(item => {
        // Exclude the main lab.html page itself
        if (item.fileSlug === "lab") return false;
        // Only include non-draft experiments
        return !item.data.draft;
      })
      .sort((a, b) => {
        // Sort by order field if it exists, otherwise by date
        return (a.data.order || 999) - (b.data.order || 999);
      });
  });

  // Set input/output directories to remove src/pages from URLs
  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["html", "liquid", "md"],
    pathPrefix: "/"
  };
}
