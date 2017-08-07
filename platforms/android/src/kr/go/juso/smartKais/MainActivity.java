package kr.go.juso.smartKais;

import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
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
        loadUrl("javascript:sso = JSON.parse('" + sso + "');");


        String version;
        try {
            PackageInfo i = getPackageManager().getPackageInfo(getPackageName(), 0);
            version = i.versionName;
        } catch(PackageManager.NameNotFoundException e) { }



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

    @Override
    protected void onStop() {
        Log.d(TAG, "onStop");
        super.onStop();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);

        String data = intent.getStringExtra("PUSH");
        if(data != null){
            loadUrl(String.format("javascript:util.pushProc(%s);", data));
        }

    }


}
