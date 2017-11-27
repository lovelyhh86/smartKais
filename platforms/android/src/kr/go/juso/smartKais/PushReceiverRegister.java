package kr.go.juso.smartKais;

import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;

import com.dkitec.PushLibrary.Listener.PushAppRegistListener;
import com.dkitec.PushLibrary.PushLibrary;


class PushReceiverRegister implements PushAppRegistListener
{

    Context context;
    private static final String TAG = "SmartKais[PRR]";
    private static final String SVRADDR = "https://flpush.mcenter.go.kr:7001/pis/interface";


    public PushReceiverRegister(Context context)
    {
        this.context = context;
    }

    public void initialize(String userid){
        PackageManager pm = context.getPackageManager();
        String appId;
        String userId = userid;

        try {
            PackageInfo pi = pm.getPackageInfo(context.getApplicationContext().getPackageName(), PackageManager.GET_META_DATA);
            ApplicationInfo appInfo = pi.applicationInfo;

            appId = "smartkais";
            if (appId == null)
                appId = appInfo.packageName;

        }catch (PackageManager.NameNotFoundException ne)
        {
            appId = context.getApplicationContext().getPackageName();
        }

        int res = PushLibrary.getInstance().setStart(context, SVRADDR, appId);
        boolean regist = PushLibrary.getInstance().AppRegist(this, userId, null);
        Log.d("-----------------------",res + "===" + regist);
    }

    @Override
    public void didRegistResult(Bundle bundle)
    {
        Log.v(TAG, "PushAppRegistListener[didRegistResult]");
        String rt = bundle.getString("RT");
        String rtMsg = bundle.getString("RT_MSG");
        Log.d(TAG, "RT=" + rt);
        Log.d(TAG, "RT_MSG=" + rtMsg);

    }
}
