/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	webpackDevMiddleware: config => {
		config.watchOptions.poll = 300
		return config
	},
}

module.exports = nextConfig
