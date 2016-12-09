package kr.go.juso.smartKais;

import android.app.Application;
import android.app.KeyguardManager;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.graphics.BitmapFactory;
import android.graphics.Point;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.PowerManager;
import android.support.v4.app.NotificationCompat;
import android.util.Log;
import android.view.Display;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.TextView;
import android.widget.Toast;

import com.dkitec.PushLibrary.Listener.PushAppRegistListener;
import com.dkitec.PushLibrary.PushLibrary;
import com.dkitec.PushLibrary.Receiver.PushLibraryReceiver;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.List;

import static android.content.Context.LAYOUT_INFLATER_SERVICE;

class AppEnviroment extends Application {
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

        String ticker="";
        String title="";
        String desc="";
        String type="";
        String dlgtitle="";
        String dlgdesc="";
        try {
            JSONObject json = new JSONObject(message);
            ticker = json.getString("ticker");
            title = json.getString("title");
            //type = json.getString("type");
            desc = json.getString("desc");
            dlgtitle = json.getString("dlgtitle");
            dlgdesc = json.getString("dlgdesc");
        } catch(JSONException ex) {

        }

        //Ticker & Notification List
        try {
            Class c = //Class.forName("android.intent.category.mobp.mff");
            MainActivity.class;
            Intent intent =new Intent(context,c);
            intent.addCategory("android.intent.category.mobp.mff");

            intent = new Intent();
            int count = AppEnviroment.getPendingNotificationsCount();
            AppEnviroment.setPendingNotificationsCount(count + 1);
            NotificationManager notificationmanager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            PendingIntent pendingIntent = //PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
                    new AppComponentLauncher(context).PendingActivityLaunchApp() ;

            NotificationCompat.Builder builder = new NotificationCompat.Builder(context);
            builder.setSmallIcon(R.drawable.icon).setTicker(ticker).setWhen(System.currentTimeMillis())
                    .setNumber(count)
                    .setContentTitle(title).setContentText(desc)
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

        } else {
         //   isScreenon = pm.isInteractive();

        }

        //잠금여부
/*
        KeyguardManager km = (KeyguardManager)context.getSystemService(Context.KEYGUARD_SERVICE);

        if (km.inKeyguardRestrictedInputMode() == false ){
            return;
        }
//*/

        //잠금상태가 아니라면 토스트
        if (isScreenon) {
            View toastView = View.inflate(context, R.layout.noti_toast,null);

            TextView titleView = (TextView)toastView.findViewById(R.id.noti_toast_title);
            TextView descView = (TextView)toastView.findViewById(R.id.noti_toast_desc);
            titleView.setText(dlgtitle);
            descView.setText(dlgdesc);

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

            popup.putExtra("title", dlgtitle);
            popup.putExtra("desc", dlgdesc);

            PendingIntent popupTask = PendingIntent.getActivity(context,0,popup,PendingIntent.FLAG_ONE_SHOT);
            try {
                popupTask.send();
            } catch (Exception ex) {}
        }
        //*/
    }

}
