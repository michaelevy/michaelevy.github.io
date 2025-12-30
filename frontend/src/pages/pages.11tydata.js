export default {
  eleventyComputed: {
    permalink: (data) => {
      // Get the file path without the src/pages prefix
      let path = data.page.filePathStem.replace('/src/pages', '');
      
      // For files named the same as their parent directory (e.g., /about/about.html)
      // convert to /about/index.html for clean URLs
      const parts = path.split('/');
      const filename = parts[parts.length - 1];
      const parentDir = parts[parts.length - 2];
      
      if (filename === parentDir) {
        // Remove the duplicate filename, keep the directory
        parts.pop();
        path = parts.join('/');
      }
      
      return `${path}/index.html`;
    }
  }
};
