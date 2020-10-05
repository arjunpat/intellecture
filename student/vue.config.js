module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  pwa: {
    name: 'Intellecture',
    short_name: 'Intellecture',
    themeColor: '#81C784',
    msTileColor: '#000000',
    backgroundColor: '#81C784',
    manifestOptions: {
        icons: [
            {
                src: "img/icons/intellecturelogo-192x192.png",
                sizes: "192x192",
                type: "image/png"
            },
            {
                src: "img/icons/intellecturelogo-512x512.png",
                sizes: "512x512",
                type: "image/png"
            }
        ]
    }
}
};
