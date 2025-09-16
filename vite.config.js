import zipPack from "vite-plugin-zip-pack";

module.exports = {
	root: 'src',
	public: './assets',
	build: {
	  outDir: '../dist',
	  emptyOutDir: true
	},
  base: '',
  plugins: [zipPack({
	outDir: './',
	outFileName: '13th-century-siege.zip'
  })],
}