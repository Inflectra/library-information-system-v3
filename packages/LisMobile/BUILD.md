### Android APK Build Instructions for macOS

Here are the commands to build the Android APK on macOS:

#### Prerequisites

Make sure you have installed:

*   **Node.js** (v16 or later)
*   **Java JDK 17**
*   **Android Studio** (or Android SDK with command-line tools)

#### Build Steps

1.  **Extract the zip and navigate to the project:**
    ```bash
    cd LisMobile
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Generate native Android project (if not already present):**
    ```bash
    npx expo prebuild --platform android
    ```

4.  **Build the APK:**
    ```bash
    cd android
    ./gradlew assembleRelease
    ```

5.  **Find your APK:**
    The APK will be located at: `android/app/build/outputs/apk/release/app-release.apk`

---

### Alternative: Build with Expo EAS (easier)

If you have issues with the local build, you can use Expo's cloud build service:

```bash
npm install -g eas-cli
eas build --platform android --profile preview
```

---

#### Notes:

*   The `./gradlew` command uses the Gradle wrapper included in the project.
*   Make sure the `ANDROID_HOME` environment variable is set to your Android SDK location (usually `~/Library/Android/sdk`).
*   For a signed APK, you'll need to configure signing in `android/app/build.gradle` and provide a keystore file.
*   The current build will create an unsigned APK suitable for testing.
*   The only difference from Windows is using `./gradlew` instead of `gradlew.bat` and forward slashes (`/`) instead of backslashes (`\`) in paths.

---
---

### iOS Simulator .app Build Instructions for macOS

Here are the commands to build the iOS simulator .app on macOS:

#### Prerequisites

*   **macOS** with **Xcode** installed
*   **Node.js** (v16 or later)
*   **CocoaPods** (`sudo gem install cocoapods`)

#### Build Steps

1.  **Extract the zip and navigate to the project:**
    ```bash
    cd LisMobile
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Generate native iOS project (if not already present):**
    ```bash
    npx expo prebuild --platform ios --clean
    ```

4.  **Install iOS dependencies:**
    ```bash
    cd ios
    pod install
    cd ..
    ```

5.  **Build for iOS Simulator:**
    ```bash
    xcodebuild -workspace ios/LibraryInformationSystem.xcworkspace \
      -scheme LibraryInformationSystem \
      -configuration Debug \
      -sdk iphonesimulator \
      -derivedDataPath ios/build
    ```

6.  **Find your .app:**
    The `.app` will be located at: `ios/build/Build/Products/Debug-iphonesimulator/LibraryInformationSystem.app`

7.  **Install on simulator (optional):**
    ```bash
    # Boot a simulator
    xcrun simctl boot "iPhone 16"

    # Install the app
    xcrun simctl install booted ios/build/Build/Products/Debug-iphonesimulator/LibraryInformationSystem.app

    # Launch the app
    xcrun simctl launch booted com.yourcompany.libraryapp
    ```

---

### Alternative: Use Expo CLI (easier)

```bash
npm install
npx expo run:ios
```

This will automatically build and launch in the simulator.

---

#### Notes:

*   iOS builds only work on macOS with Xcode.
*   The simulator `.app` cannot run on real devices.
*   For real devices, you need to build an `.ipa` with proper code signing.