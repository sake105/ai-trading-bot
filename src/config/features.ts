
export const features = {
  congress: (import.meta.env.VITE_FEATURE_CONGRESS ?? 'true') === 'true',
  shipping: (import.meta.env.VITE_FEATURE_SHIPPING ?? 'true') === 'true',
};
