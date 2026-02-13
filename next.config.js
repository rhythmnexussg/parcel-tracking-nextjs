module.exports = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'deltaboxstore.com',
          },
        ],
        destination: 'https://rhythmnexus.org/:path*',
        permanent: true,
      },
    ];
  },
};
