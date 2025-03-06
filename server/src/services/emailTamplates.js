const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

/**
 * Loads and compiles a Handlebars template.
 * @param {string} templateName - The name of the template file (without extension).
 * @param {object} data - The data to pass into the template.
 * @returns {string} - The compiled HTML.
 */
const loadTemplate = (templateName, data) => {
  // Build the full path to the template file. 
  const filePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
  // Read the template file synchronously 
  const templateSource = fs.readFileSync(filePath, 'utf8');
  // Compile the template with Handlebars
  const template = handlebars.compile(templateSource);
  // Return the compiled HTML
  return template(data);
};

module.exports = { loadTemplate };
