package com.ipassio_;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen; // Import this.
import android.os.Bundle; // Import this.
public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "ipassio_";
  }
// Add this method. for splash screen
@Override
protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this);
    super.onCreate(savedInstanceState);
}
//   @Override
// protected void onCreate(Bundle savedInstanceState) {
//   SplashScreen.show(this);
//   super.onCreate(null);
// }
}
