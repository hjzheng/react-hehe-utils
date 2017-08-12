const resourceContext = require.context('../src/resource', true, /\.js$/);
resourceContext.keys().forEach(resourceContext);
