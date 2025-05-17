plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.google.android.libraries.mapsplatform.secrets.gradle.plugin)
}

android {
    namespace = "com.example.myparkease2"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.myparkease2"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    buildFeatures{
        viewBinding = true
    }
}

dependencies {


    implementation("com.google.zxing:core:3.3.3")

    implementation(libs.appcompat)
    implementation(libs.material)
    implementation(libs.activity)
    implementation(libs.constraintlayout)

    testImplementation(libs.junit)
    androidTestImplementation(libs.ext.junit)
    androidTestImplementation(libs.espresso.core)
    implementation ("androidx.constraintlayout:constraintlayout:2.1.4")
    implementation ("com.squareup.okhttp3:okhttp:4.9.3")
    implementation("com.android.volley:volley:1.2.1")

    implementation ("com.google.android.gms:play-services-location:17.0.0")

    implementation ("com.google.android.gms:play-services-location:21.0.1")
    implementation ("androidx.fragment:fragment:1.6.1")
    implementation ("com.google.android.gms:play-services-maps:18.1.0")
    implementation("com.journeyapps:zxing-android-embedded:4.3.0")
    implementation ("com.github.VishnuSivadasVS:Advanced-HttpURLConnection:1.2")
    testImplementation("junit:junit:4.13")
    implementation ("com.squareup.retrofit2:retrofit:2.9.0")
    implementation ("com.squareup.retrofit2:converter-gson:2.9.0")

    implementation ("com.google.android.material:material:1.9.0' // ou la dernière version")


    // Room database dependencies - Updated format
    implementation("androidx.room:room-runtime:2.5.0")
    implementation("androidx.room:room-ktx:2.5.0")  // Added for Kotlin extensions
    annotationProcessor ("androidx.room:room-compiler:2.5.0")


}