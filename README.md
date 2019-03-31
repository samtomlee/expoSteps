# expoSteps
pedometer for Solemate

based off of the expo pedometer example, this code will calculate the bpm and save the values in an array

# Installation

This package is pre-installed in [managed](https://docs.expo.io/versions/latest/introduction/managed-vs-bare/) Expo projects. You may skip the rest of the installation guide if this applies to you.

For bare React Native projects, you must ensure that you have [installed and configured the `react-native-unimodules` package](https://github.com/unimodules/react-native-unimodules) before continuing.

### Add the package to your npm dependencies

```
npm install expo-sensors
```

### Configure for iOS

Run `pod install` in the ios directory after installing the npm package.

**Note:** to access DeviceMotion stats on iOS, the NSMotionUsageDescription key must be present in your Info.plist.
