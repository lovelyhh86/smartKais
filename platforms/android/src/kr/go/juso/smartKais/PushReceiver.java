package kr.go.juso.smartKais;

import android.app.Application;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.os.PowerManager;
import android.support.v4.app.NotificationCompat;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.dkitec.PushLibrary.Receiver.PushLibraryReceiver;

import org.json.JSONException;
import org.json.JSONObject;

class AppEnvironment extends Application {
    private static int pendingNotificationsCount = 0;

    @Override
    public void onCreate() {
        super.onCreate();
    }

    public static int getPendingNotificationsCount() {
        return pendingNotificationsCount;
    }

    public static void setPendingNotificationsCount(int pendingNotifications) {
        pendingNotificationsCount = pendingNotifications;
    }
}

public class PushReceiver extends PushLibraryReceiver {
    private static final String TAG = "SmartKais[PR]";

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

        String gbn = bundle.getString("alert");
        String message = bundle.getString("message");
        String requestid = bundle.getString("requestid");
        Log.d(TAG, "gbn=" + gbn);
        Log.d(TAG, "message=" + message);
        Log.d(TAG, "requestid=" + requestid);

        String strMessage = "";
        try{
            JSONObject jsonMessage = new JSONObject(message);
            strMessage = String.valueOf(jsonMessage);

            sendPushNotification(context, strMessage);
        }catch (JSONException je){
            Log.d(TAG, je.getMessage());
        }

        boolean isforground = Plugins.isIsForeground();
        if (isforground)
        {
//            Plugins.triggerNotification(json);
            // PUSH 데이터 처리를 위한 값 전달
            Intent push = new Intent(context, MainActivity.class);
            push.putExtra("PUSH", strMessage);
            push.setFlags(Intent.FLAG_FROM_BACKGROUND);

            PendingIntent pushTask = PendingIntent.getActivity(context,0,push,PendingIntent.FLAG_CANCEL_CURRENT);
            try {
                pushTask.send();
            } catch (Exception ex) {
                Log.d(TAG, ex.getMessage());
            }
        }

    }

    @Override
    public void onRegistration(Context context, String string) {
        Log.v(TAG, "LocalPushReceiver[onRegistration]");
        Log.d(TAG, "result=" + string);

    }

    private void sendPushNotification(Context context, String strMessage) {

        String title = "스마트KAIS";
        String gbn = "";
        String cnt = "";
        String notiText = "";
        String requestid = "";

        try {
            JSONObject json = new JSONObject(strMessage);

            gbn = json.getString("gbn");
            cnt = json.getString("cnt");
            notiText = json.getString("text");
            requestid = json.getString("requestid");


        } catch(JSONException ex) {
            Log.d(TAG, ex.getMessage());
        }

        //Ticker & Notification List
        try {
//            Intent intent = new Intent(context,MainActivity.class);
//            intent.addCategory("android.intent.category.mobp.mff");

            Intent intent = new Intent();
            int count = AppEnvironment.getPendingNotificationsCount();
            AppEnvironment.setPendingNotificationsCount(count + 1);
            NotificationManager notificationmanager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            PendingIntent pendingIntent = //PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
                    new AppComponentLauncher(context).PendingActivityLaunchApp() ;


            NotificationCompat.Builder builder = new NotificationCompat.Builder(context);
            builder.setSmallIcon(R.drawable.icon).setTicker(title).setWhen(System.currentTimeMillis())
                    .setNumber(count)
                    .setContentTitle(title).setContentText(notiText)
                    .setDefaults(Notification.DEFAULT_SOUND | Notification.DEFAULT_VIBRATE)
                    .setContentIntent(pendingIntent)
                    .setAutoCancel(true);

            notificationmanager.notify(1, builder.build());

        }catch (Exception ex) {
            ex.printStackTrace();

        }

        //화면 잠금 상태
        PowerManager pm = (PowerManager)context.getSystemService(Context.POWER_SERVICE);
        Boolean isScreenon = false;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT_WATCH) {
            isScreenon = pm.isScreenOn();

        }

        //잠금상태가 아니라면 토스트
        if (isScreenon) {
            View toastView = View.inflate(context, R.layout.noti_toast,null);

            TextView titleView = (TextView)toastView.findViewById(R.id.noti_toast_title);
            TextView descView = (TextView)toastView.findViewById(R.id.noti_toast_desc);
            titleView.setText(title);
            descView.setText(notiText);

            Toast toast = new Toast(context);

            toast.setGravity(Gravity.FILL_HORIZONTAL | Gravity.TOP, 0, 100);
            toast.setDuration(Toast.LENGTH_LONG);
            toast.setView(toastView);

            //Display toast
            toast.show();
        } else {
            //잠금상태라면 카톡과 같은 팝업 출력
            Intent popup = new Intent(context, NotifierPopup.class)
                    .setFlags(
                            Intent.FLAG_ACTIVITY_NEW_TASK    |
                            Intent.FLAG_ACTIVITY_CLEAR_TOP |
                            Intent.FLAG_ACTIVITY_SINGLE_TOP);

            popup.putExtra("title", title);
            popup.putExtra("desc", notiText);

            PendingIntent popupTask = PendingIntent.getActivity(context,0,popup,PendingIntent.FLAG_ONE_SHOT);
            try {
                popupTask.send();
            } catch (Exception ex) {
                Log.d(TAG, ex.getMessage());
            }
        }
    }
}
