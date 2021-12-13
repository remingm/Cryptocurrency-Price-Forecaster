module.exports = {
  mode: 'jit',
  purge: [
    './**/*.html',
    './src/**/*.html',
    './src/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
      roboto: ['Roboto', 'serif']
    },
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: []
}
