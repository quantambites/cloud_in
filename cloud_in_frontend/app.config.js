// app.config.js
export default () => ({
  expo: {
    name: "cloud_in",
    slug: "cloud-in",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "cloudin",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      package: "com.harsh_00796.cloudin",
      googleServicesFile: "./google-services.json"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      "expo-secure-store"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "6255c3ba-b65c-4785-9c24-87180ab62c9f" 
      }
    },
    owner: "harsh_00796"
  }
});

export const getDynamicAppConfig = () => {
  return {
    name: "cloud_in",
    bundleIdentifier:  "com.harsh_00796.cloudin",
    packageName:  "com.harsh_00796.cloudin",
    icon: "./assets/images/icon.png",
    adaptiveIcon: "./assets/images/adaptive-icon.png",
    scheme: "cloudin"
  };
};

