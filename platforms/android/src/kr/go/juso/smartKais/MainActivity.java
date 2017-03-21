package kr.go.juso.smartKais;

import android.os.Bundle;
import android.util.Log;

import org.apache.cordova.CordovaActivity;
import org.json.JSONException;

public class MainActivity extends CordovaActivity {
    private static final String TAG = "MainActivity";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        Log.d(TAG, "onCreate");

        super.onCreate(savedInstanceState);

        loadUrl(launchUrl);

        String sso = getIntent().getStringExtra("sso");
        loadUrl("javascript:var sso = JSON.parse('" + sso + "');");

        AppEnvironment.setPendingNotificationsCount(0);
        try {
            new PushReceiverRegister(this).initialize(SSO.getSSOInfo(SSO.SSO_TEL));
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void onPostResume() {
        Log.d(TAG, "onPostResume");
        super.onPostResume();
        AppEnvironment.setPendingNotificationsCount(0);
    }

    @Override
    protected void onPause() {
        Log.d(TAG, "onPause");
        super.onPause();
    }

    @Override
    protected void onResume() {
        Log.d(TAG, "onResume");
        super.onResume();
    }

    protected void onStop() {
        Log.d(TAG, "onStop");
        super.onStop();
    }
}
