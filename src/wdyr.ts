// src/wdyr.ts
import React from 'react';

if (process.env.NODE_ENV === 'development') {
  // Using dynamic import to avoid require statement
  import('@welldone-software/why-did-you-render').then(module => {
    const whyDidYouRender = module.default;
    whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackHooks: true,
    logOnDifferentValues: true,
    collapseGroups: true,
    });
    
    console.log('Why-did-you-render is enabled');
  }).catch(err => {
    console.error('Error loading why-did-you-render:', err);
  });
}
