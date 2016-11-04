package kr.go.juso.smartKais;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.graphics.BitmapFactory;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Bundle;
import android.os.PowerManager;
import android.support.v4.app.NotificationCompat;
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
            sendPushNotification(context,message);
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

    private void sendPushNotification(Context context, String message) {
        System.out.println("received message : " + message);


        NotificationManager notificationmanager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, new Intent(context, MainActivity.class), PendingIntent.FLAG_UPDATE_CURRENT);
        NotificationCompat.Builder builder = new NotificationCompat.Builder(context);
        builder.setSmallIcon(R.drawable.icon).setTicker("HETT").setWhen(System.currentTimeMillis())
                .setNumber(1).setContentTitle("푸쉬 제목").setContentText("푸쉬내용")
                .setDefaults(Notification.DEFAULT_SOUND | Notification.DEFAULT_VIBRATE).setContentIntent(pendingIntent).setAutoCancel(true);

        notificationmanager.notify(1, builder.build());

/*

      //  Intent intent = new Intent(this, MainActivity.class);
      //  intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
      //  PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent,
      //          PendingIntent.FLAG_ONE_SHOT);

        Uri defaultSoundUri= RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this)
            //    .setSmallIcon(R.drawable.noti).setLargeIcon(BitmapFactory.decodeResource(getResources(),R.mipmap.ic_launcher) )
                .setContentTitle("Push Title ")
                .setContentText(message)
                .setAutoCancel(true)
                .setSound(defaultSoundUri).setLights(000000255,500,2000)
       //         .setContentIntent(pendingIntent);

        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        PowerManager pm = (PowerManager) this.getSystemService(Context.POWER_SERVICE);
        PowerManager.WakeLock wakelock = pm.newWakeLock(PowerManager.FULL_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP, "TAG");
        wakelock.acquire(5000);

        notificationManager.notify(0
























        , notificationBuilder.build());

        //*/
    }

}
