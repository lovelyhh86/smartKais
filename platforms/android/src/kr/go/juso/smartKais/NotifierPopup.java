package kr.go.juso.smartKais;

import android.app.Activity;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.NotificationCompat;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.dkitec.PushLibrary.Receiver.PushLibraryReceiver;

import org.json.JSONException;
import org.json.JSONObject;


public class NotifierPopup extends Activity {
    private static final String TAG = "MKAIS[POPUP]";

    public NotifierPopup()
    {
        Log.d(TAG, "Push POPUP Creation");
    }


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Log.d(TAG, "NotifierPopup[onCreate]");
        super.onCreate(savedInstanceState);

        requestWindowFeature(Window.FEATURE_NO_TITLE);


        WindowManager.LayoutParams layoutParam = new WindowManager.LayoutParams();
        layoutParam.flags = WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
                            | WindowManager.LayoutParams.FLAG_DIM_BEHIND
                            | WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED
                            | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON;
        layoutParam.dimAmount = 0.5f;

        getWindow().setAttributes(layoutParam);

        this.setContentView(R.layout.notifier);

        findViewById(R.id.btn_ok).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        findViewById(R.id.btn_view).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {
                    new AppComponentLauncher(NotifierPopup.this).PendingActivityLaunchApp().send();
                } catch (PendingIntent.CanceledException ex) {

                } finally {
                    finish();
                }
            }
        });

        setViewState();


    }
    @Override
    protected void onNewIntent(Intent intent)
    {
        super.onNewIntent(intent);

        // display received msg
        setViewState();
    }

    private void setViewState() {
        Bundle bundle = getIntent().getExtras();

        String title = bundle.getString("title");
        String desc = bundle.getString("desc");

        if (TextUtils.isEmpty(title) == false) {
            TextView titleView = (TextView) findViewById(R.id.noti_title);
            titleView.setText(title);
        }
        if (TextUtils.isEmpty(desc) == false) {
            TextView descView = (TextView) findViewById(R.id.noti_desc);
            descView.setText(desc);
        }
    }
    //*/

}
