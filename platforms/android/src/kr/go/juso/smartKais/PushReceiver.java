package kr.go.juso.smartKais;

import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;

import com.dkitec.PushLibrary.Listener.PushAppRegistListener;
import com.dkitec.PushLibrary.PushLibrary;
import com.dkitec.PushLibrary.Receiver.PushLibraryReceiver;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;


public class PushReceiver extends PushLibraryReceiver {
    private static final String TAG = "MKAIS[PR]";

    public PushReceiver()
    {
        Log.d(TAG, "Push Receiver Creation");
    }



    @Override
    public void didPushReportResult(Bundle bundle) {
        Log.v(TAG, "LocalPushReceiver[didPushReportResult]");
    }

    @Override
    public void onMsgReceive(Context context, Bundle bundle) {
        Log.v(TAG, "LocalPushReceiver[onMsgReceive]");

        String message = bundle.getString("message");
        String requestid = bundle.getString("requestid");
        Log.d(TAG, "message=" + message);
        Log.d(TAG, "requestid=" + requestid);

        JSONObject json = new JSONObject();
        try{
            json.put("eventName","notification");
            JSONObject jsonArg = new JSONObject();
            jsonArg.put("message",message);
            jsonArg.put("requestId",requestid);
            //  jsonArg.put("message",message);
            json.put("args",jsonArg);
        }catch (JSONException je){

        }

        boolean isforground = Plugins.isIsForeground();
        if (isforground)
        {
            Plugins.triggerNotification(json);
        }



    }

    @Override
    public void onRegistration(Context context, String string) {
        Log.v(TAG, "LocalPushReceiver[onRegistration]");
        Log.d(TAG, "result=" + string);

    }
}
