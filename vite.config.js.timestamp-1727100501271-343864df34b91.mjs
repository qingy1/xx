// vite.config.js
import path from "path";
import vue from "file:///E:/WENMOUX/vue-XiuXianGame-main/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Icons from "file:///E:/WENMOUX/vue-XiuXianGame-main/node_modules/unplugin-icons/dist/vite.js";
import { VitePWA } from "file:///E:/WENMOUX/vue-XiuXianGame-main/node_modules/vite-plugin-pwa/dist/index.js";
import AutoImport from "file:///E:/WENMOUX/vue-XiuXianGame-main/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///E:/WENMOUX/vue-XiuXianGame-main/node_modules/unplugin-vue-components/dist/vite.js";
import IconsResolver from "file:///E:/WENMOUX/vue-XiuXianGame-main/node_modules/unplugin-icons/dist/resolver.js";
import { defineConfig } from "file:///E:/WENMOUX/vue-XiuXianGame-main/node_modules/vite/dist/node/index.js";
import { ElementPlusResolver } from "file:///E:/WENMOUX/vue-XiuXianGame-main/node_modules/unplugin-vue-components/dist/resolvers.js";
import vitePluginBundleObfuscator from "file:///E:/WENMOUX/vue-XiuXianGame-main/node_modules/vite-plugin-bundle-obfuscator/dist/index.mjs";
var __vite_injected_original_dirname = "E:\\WENMOUX\\vue-XiuXianGame-main";
var vite_config_default = defineConfig({
  base: "./",
  build: {
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) return "vendor";
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith(".ico")) return "[name].[ext]";
          return "assets/[ext]/[name]-[hash].[ext]";
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true
      }
    }
  },
  plugins: [
    vue(),
    Icons({
      autoInstall: true
    }),
    VitePWA({
      manifest: {
        name: "\u6211\u7684\u6587\u5B57\u4FEE\u4ED9\u5168\u9760\u5237",
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ],
        short_name: "\u6587\u5B57\u4FEE\u4ED9",
        description: "\u6587\u5B57\u6E38\u620F: \u6211\u7684\u6587\u5B57\u4FEE\u4ED9\u5168\u9760\u5237",
        theme_color: "#4d4d4d"
      },
      devOptions: {
        enabled: true
      },
      registerType: "autoUpdate"
    }),
    AutoImport({
      resolvers: [
        IconsResolver({
          prefix: "Icon"
        }),
        ElementPlusResolver()
      ]
    }),
    Components({
      resolvers: [
        IconsResolver({
          enabledCollections: ["ep"]
        }),
        ElementPlusResolver()
      ]
    }),
    vitePluginBundleObfuscator({
      log: false,
      enable: true,
      options: {
        log: false,
        compact: true,
        stringArray: true,
        renameGlobals: false,
        selfDefending: false,
        debugProtection: false,
        rotateStringArray: true,
        deadCodeInjection: false,
        stringArrayEncoding: ["none"],
        disableConsoleOutput: true,
        stringArrayThreshold: 0.75,
        controlFlowFlattening: false,
        unicodeEscapeSequence: true,
        identifierNamesGenerator: "hexadecimal"
      },
      excludes: ["router.js"],
      autoExcludeNodeModules: true
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "src")
    }
  },
  logLevel: "error"
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxXRU5NT1VYXFxcXHZ1ZS1YaXVYaWFuR2FtZS1tYWluXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxXRU5NT1VYXFxcXHZ1ZS1YaXVYaWFuR2FtZS1tYWluXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi9XRU5NT1VYL3Z1ZS1YaXVYaWFuR2FtZS1tYWluL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSc7XG5pbXBvcnQgSWNvbnMgZnJvbSAndW5wbHVnaW4taWNvbnMvdml0ZSc7XG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJztcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnO1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSc7XG5pbXBvcnQgSWNvbnNSZXNvbHZlciBmcm9tICd1bnBsdWdpbi1pY29ucy9yZXNvbHZlcic7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnO1xuaW1wb3J0IHZpdGVQbHVnaW5CdW5kbGVPYmZ1c2NhdG9yIGZyb20gJ3ZpdGUtcGx1Z2luLWJ1bmRsZS1vYmZ1c2NhdG9yJztcblxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAgIGJhc2U6ICcuLycsXG4gICAgYnVpbGQ6IHtcbiAgICAgICAgbWluaWZ5OiAndGVyc2VyJyxcbiAgICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgICAgICAgbWFudWFsQ2h1bmtzOiAoaWQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkgcmV0dXJuICd2ZW5kb3InO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdhc3NldHMvanMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgICAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdhc3NldHMvanMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgICAgICAgICAgYXNzZXRGaWxlTmFtZXM6IChhc3NldEluZm8pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFzc2V0SW5mby5uYW1lICYmIGFzc2V0SW5mby5uYW1lLmVuZHNXaXRoKCcuaWNvJykpIHJldHVybiAnW25hbWVdLltleHRdJztcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdhc3NldHMvW2V4dF0vW25hbWVdLVtoYXNoXS5bZXh0XSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB0ZXJzZXJPcHRpb25zOiB7XG4gICAgICAgICAgICBjb21wcmVzczoge1xuICAgICAgICAgICAgICAgIGRyb3BfY29uc29sZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBwbHVnaW5zOiBbXG4gICAgICAgIHZ1ZSgpLFxuICAgICAgICBJY29ucyh7XG4gICAgICAgICAgICBhdXRvSW5zdGFsbDogdHJ1ZVxuICAgICAgICB9KSxcbiAgICAgICAgVml0ZVBXQSh7XG4gICAgICAgICAgICBtYW5pZmVzdDoge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdcdTYyMTFcdTc2ODRcdTY1ODdcdTVCNTdcdTRGRUVcdTRFRDlcdTUxNjhcdTk3NjBcdTUyMzcnLFxuICAgICAgICAgICAgICAgIGljb25zOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyYzogJy9pY29ucy9pY29uLTE5MngxOTIucG5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemVzOiAnMTkyeDE5MicsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzcmM6ICcvaWNvbnMvaWNvbi01MTJ4NTEyLnBuZycsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZydcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgc2hvcnRfbmFtZTogJ1x1NjU4N1x1NUI1N1x1NEZFRVx1NEVEOScsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdcdTY1ODdcdTVCNTdcdTZFMzhcdTYyMEY6IFx1NjIxMVx1NzY4NFx1NjU4N1x1NUI1N1x1NEZFRVx1NEVEOVx1NTE2OFx1OTc2MFx1NTIzNycsXG4gICAgICAgICAgICAgICAgdGhlbWVfY29sb3I6ICcjNGQ0ZDRkJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRldk9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZSdcbiAgICAgICAgfSksXG4gICAgICAgIEF1dG9JbXBvcnQoe1xuICAgICAgICAgICAgcmVzb2x2ZXJzOiBbXG4gICAgICAgICAgICAgICAgSWNvbnNSZXNvbHZlcih7XG4gICAgICAgICAgICAgICAgICAgIHByZWZpeDogJ0ljb24nXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgRWxlbWVudFBsdXNSZXNvbHZlcigpXG4gICAgICAgICAgICBdXG4gICAgICAgIH0pLFxuICAgICAgICBDb21wb25lbnRzKHtcbiAgICAgICAgICAgIHJlc29sdmVyczogW1xuICAgICAgICAgICAgICAgIEljb25zUmVzb2x2ZXIoe1xuICAgICAgICAgICAgICAgICAgICBlbmFibGVkQ29sbGVjdGlvbnM6IFsnZXAnXVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoKVxuICAgICAgICAgICAgXVxuICAgICAgICB9KSxcbiAgICAgICAgdml0ZVBsdWdpbkJ1bmRsZU9iZnVzY2F0b3Ioe1xuICAgICAgICAgICAgbG9nOiBmYWxzZSxcbiAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBsb2c6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGNvbXBhY3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgc3RyaW5nQXJyYXk6IHRydWUsXG4gICAgICAgICAgICAgICAgcmVuYW1lR2xvYmFsczogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2VsZkRlZmVuZGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgZGVidWdQcm90ZWN0aW9uOiBmYWxzZSxcbiAgICAgICAgICAgICAgICByb3RhdGVTdHJpbmdBcnJheTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkZWFkQ29kZUluamVjdGlvbjogZmFsc2UsXG4gICAgICAgICAgICAgICAgc3RyaW5nQXJyYXlFbmNvZGluZzogWydub25lJ10sXG4gICAgICAgICAgICAgICAgZGlzYWJsZUNvbnNvbGVPdXRwdXQ6IHRydWUsXG4gICAgICAgICAgICAgICAgc3RyaW5nQXJyYXlUaHJlc2hvbGQ6IDAuNzUsXG4gICAgICAgICAgICAgICAgY29udHJvbEZsb3dGbGF0dGVuaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB1bmljb2RlRXNjYXBlU2VxdWVuY2U6IHRydWUsXG4gICAgICAgICAgICAgICAgaWRlbnRpZmllck5hbWVzR2VuZXJhdG9yOiAnaGV4YWRlY2ltYWwnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXhjbHVkZXM6IFsncm91dGVyLmpzJ10sXG4gICAgICAgICAgICBhdXRvRXhjbHVkZU5vZGVNb2R1bGVzOiB0cnVlXG4gICAgICAgIH0pXG4gICAgXSxcbiAgICByZXNvbHZlOiB7XG4gICAgICAgIGFsaWFzOiB7XG4gICAgICAgICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKVxuICAgICAgICB9XG4gICAgfSxcbiAgICBsb2dMZXZlbDogJ2Vycm9yJ1xufSk7XG5cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBcVIsT0FBTyxVQUFVO0FBQ3RTLE9BQU8sU0FBUztBQUNoQixPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sbUJBQW1CO0FBQzFCLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsMkJBQTJCO0FBQ3BDLE9BQU8sZ0NBQWdDO0FBVHZDLElBQU0sbUNBQW1DO0FBWXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLE1BQU07QUFBQSxFQUNOLE9BQU87QUFBQSxJQUNILFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxNQUNYLFFBQVE7QUFBQSxRQUNKLGNBQWMsQ0FBQyxPQUFPO0FBQ2xCLGNBQUksR0FBRyxTQUFTLGNBQWMsRUFBRyxRQUFPO0FBQUEsUUFDNUM7QUFBQSxRQUNBLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQixDQUFDLGNBQWM7QUFDM0IsY0FBSSxVQUFVLFFBQVEsVUFBVSxLQUFLLFNBQVMsTUFBTSxFQUFHLFFBQU87QUFDOUQsaUJBQU87QUFBQSxRQUNYO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNYLFVBQVU7QUFBQSxRQUNOLGNBQWM7QUFBQSxRQUNkLGVBQWU7QUFBQSxNQUNuQjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDTCxJQUFJO0FBQUEsSUFDSixNQUFNO0FBQUEsTUFDRixhQUFhO0FBQUEsSUFDakIsQ0FBQztBQUFBLElBQ0QsUUFBUTtBQUFBLE1BQ0osVUFBVTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sT0FBTztBQUFBLFVBQ0g7QUFBQSxZQUNJLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNWO0FBQUEsVUFDQTtBQUFBLFlBQ0ksS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFVBQ1Y7QUFBQSxRQUNKO0FBQUEsUUFDQSxZQUFZO0FBQUEsUUFDWixhQUFhO0FBQUEsUUFDYixhQUFhO0FBQUEsTUFDakI7QUFBQSxNQUNBLFlBQVk7QUFBQSxRQUNSLFNBQVM7QUFBQSxNQUNiO0FBQUEsTUFDQSxjQUFjO0FBQUEsSUFDbEIsQ0FBQztBQUFBLElBQ0QsV0FBVztBQUFBLE1BQ1AsV0FBVztBQUFBLFFBQ1AsY0FBYztBQUFBLFVBQ1YsUUFBUTtBQUFBLFFBQ1osQ0FBQztBQUFBLFFBQ0Qsb0JBQW9CO0FBQUEsTUFDeEI7QUFBQSxJQUNKLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxNQUNQLFdBQVc7QUFBQSxRQUNQLGNBQWM7QUFBQSxVQUNWLG9CQUFvQixDQUFDLElBQUk7QUFBQSxRQUM3QixDQUFDO0FBQUEsUUFDRCxvQkFBb0I7QUFBQSxNQUN4QjtBQUFBLElBQ0osQ0FBQztBQUFBLElBQ0QsMkJBQTJCO0FBQUEsTUFDdkIsS0FBSztBQUFBLE1BQ0wsUUFBUTtBQUFBLE1BQ1IsU0FBUztBQUFBLFFBQ0wsS0FBSztBQUFBLFFBQ0wsU0FBUztBQUFBLFFBQ1QsYUFBYTtBQUFBLFFBQ2IsZUFBZTtBQUFBLFFBQ2YsZUFBZTtBQUFBLFFBQ2YsaUJBQWlCO0FBQUEsUUFDakIsbUJBQW1CO0FBQUEsUUFDbkIsbUJBQW1CO0FBQUEsUUFDbkIscUJBQXFCLENBQUMsTUFBTTtBQUFBLFFBQzVCLHNCQUFzQjtBQUFBLFFBQ3RCLHNCQUFzQjtBQUFBLFFBQ3RCLHVCQUF1QjtBQUFBLFFBQ3ZCLHVCQUF1QjtBQUFBLFFBQ3ZCLDBCQUEwQjtBQUFBLE1BQzlCO0FBQUEsTUFDQSxVQUFVLENBQUMsV0FBVztBQUFBLE1BQ3RCLHdCQUF3QjtBQUFBLElBQzVCLENBQUM7QUFBQSxFQUNMO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDTCxPQUFPO0FBQUEsTUFDSCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsSUFDdEM7QUFBQSxFQUNKO0FBQUEsRUFDQSxVQUFVO0FBQ2QsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
