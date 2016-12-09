package kr.go.juso.smartKais;

import android.app.Activity;
import android.app.PendingIntent;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ResolveInfo;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.TextView;

import java.util.List;


public class AppComponentLauncher extends Activity {
    private static final String TAG = "MKAIS[POPUP]";
    private Context context_;

    public AppComponentLauncher(Context context)
    {
        this.context_ = context;
    }


    public PendingIntent PendingActivityLaunchApp () {

        Intent intent = new Intent(Intent.ACTION_MAIN, null);
        intent.addCategory("android.intent.category.mobp.mff");
        List<ResolveInfo> appList = context_.getPackageManager()
                .queryIntentActivities(intent, 0);

        String target = "kr.go.juso.smartKais";
        String tartgetActivity = "";
        for (ResolveInfo info : appList) {
            if (info.activityInfo.packageName.equals(target)) {
                tartgetActivity = info.activityInfo.name.toString();
            }
        }

        ComponentName compName = new ComponentName(target, tartgetActivity);
        Intent actIntent = new Intent(Intent.ACTION_MAIN);
        actIntent.addCategory("android.intent.category.mobp.mff");
        actIntent.setComponent(compName);
        actIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP
                | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        return PendingIntent.getActivity(context_,0,actIntent, PendingIntent.FLAG_ONE_SHOT);

    }

}
